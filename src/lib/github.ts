import octokit from "octokit";

const oct = new octokit.Octokit();

const AeternityMainRepo = { owner: "aeternity", repo: "aeternity" };

export async function getRef(branch: string) {
  console.log("branch", branch);
  const res = await oct.rest.git.getRef({
    ...AeternityMainRepo,
    ref: `heads/${branch}`,
  });
  return res.data.object.sha;
}

export async function retrieveContractSource(
  name: "MainStaking" | "StakingValidator",
  branch: string,
  ref: string
): Promise<string> {
  const res = await oct.rest.repos.getContent({
    ...AeternityMainRepo,
    mediaType: { format: "raw" },
    branch,
    ref,
    path: `test/contracts/${name}.aes`,
  });
  // console.log("res", res.data);
  // return { source: res.data, ref: res.data.ref };
  return res.data.toString();
}

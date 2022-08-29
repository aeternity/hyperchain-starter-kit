import octokit from "octokit";
import { ContractFile } from "./contracts";
import z from "zod";

const oct = new octokit.Octokit();

export const GitRepo = z.object({
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  ref: z.string(),
});
export type GitRepo = z.infer<typeof GitRepo>;

export async function getRef(grepo: GitRepo): Promise<GitRepo> {
  if (grepo.ref != "HEAD") {
    return grepo;
  }
  const { owner, repo, branch } = grepo;
  const res = await oct.rest.git.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  console.log("retrieved ref for branch", branch, res.data.object.sha);
  return { ...grepo, ref: res.data.object.sha };
}

export async function retrieveContractSource(
  repo: GitRepo,
  fileName: ContractFile
): Promise<string> {
  const res = await oct.rest.repos.getContent({
    ...repo,
    mediaType: { format: "raw" },
    path: `test/contracts/${fileName}`,
  });
  // console.log("res", res.data);
  // return { source: res.data, ref: res.data.ref };
  return res.data.toString();
}

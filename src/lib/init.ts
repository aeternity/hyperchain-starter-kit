import z from "zod";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { ensureDir, toJSON } from "./utils.js";
import { SCHEMA_BIGINT } from "./yamlExtend.js";

const InitConfig = z.object({
  validators: z.object({ count: z.bigint(), balance: z.bigint() }),
  treasuryInitBalance: z.bigint(),
  contractSources: z.object({
    owner: z.string(),
    repo: z.string(),
    branch: z.string(),
    ref: z.string(),
  }),
  docker: z.object({
    image: z.string(),
    tag: z.string(),
  }),
});

type InitConfig = z.infer<typeof InitConfig>;

export const DEFAULT_INIT_CONF: InitConfig = {
  validators: { count: 3n, balance: 3100000000000000000000000000n },
  treasuryInitBalance: 1000000000000000000000000000000000000000000000000n,
  contractSources: {
    owner: "aeternity",
    repo: "aeternity",
    branch: "master",
    ref: "HEAD",
  },
  docker: {
    image: "aeternity/aeternity",
    tag: "latest",
  },
};

export async function initDir(dir: string) {
  ensureDir(dir);
  const initFile = path.join(dir, "init.yaml");
  if (!fs.existsSync(initFile)) {
    const encoded = yaml.dump(DEFAULT_INIT_CONF, { schema: SCHEMA_BIGINT });
    console.log(`Creating ${initFile}`);
    fs.writeFileSync(initFile, encoded);
    fs.writeFileSync(path.join(dir, ".gitignore"), "unencrypted-secrets.yaml");
  } else {
    console.error(`File ${initFile} already exists. Aborting.`);
  }
}

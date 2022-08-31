import z from "zod";
import { AccountWithSecrets, genAccount } from "./basicTypes.js";
import { genValidators, Validator } from "./validators.js";
import { loadInitConf } from "./init.js";
import path from "path";
import { writeYamlFile } from "./yamlExtend.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";

export const Economy = z.object({
  treasury: z.object({
    account: AccountWithSecrets,
    initialBalance: z.bigint(),
  }),
  validators: z.array(Validator),
});

export type Economy = z.infer<typeof Economy>;

export const mkEconomyPath = (dir: string) =>
  path.join(dir, "economy-unencrypted.yaml");

export async function genEconomy(dir: string) {
  const conf = loadInitConf(dir);
  const validators = genValidators(
    conf.validators.count,
    conf.validators.balance
  );
  const treasury: Economy["treasury"] = {
    account: genAccount(),
    initialBalance: conf.treasuryInitBalance,
  };
  const economy: Economy = { treasury, validators };
  const filePath = mkEconomyPath(dir);
  writeYamlFile(filePath, economy);
}

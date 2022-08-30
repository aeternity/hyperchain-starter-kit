import z from "zod";
import { AccountWithSecrets, genAccount } from "./basicTypes";
import { genValidators, Validator } from "./validators";
import { loadInitConf } from "./init";
import path from "path";
import { writeYamlFile } from "./yamlExtend";

export const Economy = z.object({
  treasury: z.object({
    account: AccountWithSecrets,
    initialBalance: z.bigint(),
  }),
  validators: z.array(Validator),
});

export type Economy = z.infer<typeof Economy>;

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
  const filePath = path.join(dir, "economy-unencrypted.yaml");
  writeYamlFile(filePath, economy);
}

import z from "zod";
import { AccountPubKey, AccountWithSecrets, genAccount } from "./basicTypes.js";
import { genValidators, Validator } from "./validators.js";
import { InitConfig, loadInitConf } from "./init.js";
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
  pinners: z.array(
    z.object({
      account: AccountWithSecrets,
      owner: z.string(),
    })
  ),
  faucet: z.object({
    account: AccountWithSecrets,
    initialBalance: z.bigint(),
  }),
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

  const pinners = Array.from({ length: Number(conf.validators.count) }).map((x, n) => {
    return { account: genAccount(), owner: validators[n].account.addr };
  });

  const treasury: Economy["treasury"] = {
    account: genAccount(),
    initialBalance: conf.treasuryInitBalance,
  };

  const faucet: Economy["faucet"] = {
    account: genAccount(),
    initialBalance: conf.faucetInitBalance,
  };

  const economy: Economy = {
    treasury,
    validators,
    pinners,
    faucet,
  };

  const filePath = mkEconomyPath(dir);
  writeYamlFile(filePath, economy);
}

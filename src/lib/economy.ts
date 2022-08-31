import z from "zod";
import { AccountPubKey, AccountWithSecrets, genAccount } from "./basicTypes.js";
import { genValidators, Validator } from "./validators.js";
import { InitConfig, loadInitConf } from "./init.js";
import path from "path";
import { writeYamlFile } from "./yamlExtend.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";

export const AeBriAccount = z.object({
  pubKey: AccountPubKey,
  name: z.literal("Aeternity BRI Account"),
  avatar_url: z.union([z.string(), z.null()]),
  initialBalance: z.bigint(),
});
export type AeBriAccount = z.infer<typeof AeBriAccount>;

export const Economy = z.object({
  treasury: z.object({
    account: AccountWithSecrets,
    initialBalance: z.bigint(),
  }),
  aeBRIAccount: z.optional(AeBriAccount),
  validators: z.array(Validator),
});
export type Economy = z.infer<typeof Economy>;

export const mkDefaultBri = (conf: InitConfig): Economy["aeBRIAccount"] => ({
  pubKey: conf.aeBRIAccount,
  name: "Aeternity BRI Account",
  avatar_url: "https://avatars.githubusercontent.com/u/21989234?s=200&v=4",
  initialBalance: conf.validators.balance,
});

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
  const economy: Economy = {
    treasury,
    validators,
    aeBRIAccount: mkDefaultBri(conf),
  };
  const filePath = mkEconomyPath(dir);
  writeYamlFile(filePath, economy);
}

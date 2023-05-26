import z from "zod";
import {getHdWalletAccountFromSeed} from "@aeternity/aepp-sdk";
import {generateMnemonic, mnemonicToSeedSync} from "@scure/bip39"
import { wordlist } from "@scure/bip39/wordlists/english.js";

export const ContractDataEnc = z.custom<`cb_${string}`>(
  (v) => typeof v === "string" && v.startsWith("cb_")
);
export type ContractDataEnc = z.infer<typeof ContractDataEnc>;

export const AccountPubKey = z.custom<`ak_${string}`>(
  (v) => typeof v === "string" && v.startsWith("ak_")
);
export type AccountPubKey = z.infer<typeof AccountPubKey>;

export const ContractAddr = z.custom<`ct_${string}`>(
  (v) => typeof v === "string" && v.startsWith("ct_")
);
export type ContractAddr = z.infer<typeof ContractAddr>;

export const AccountWithSecrets = z.object({
  mnemonic: z.string(),
  privKey: z.string(),
  addr: AccountPubKey,
});
export type AccountWithSecrets = z.infer<typeof AccountWithSecrets>;

export function genAccount(): AccountWithSecrets {
  const mnemonic = generateMnemonic(wordlist);
  const secretKey = mnemonicToSeedSync(mnemonic);
  const acc = getHdWalletAccountFromSeed(secretKey, 0);
  return {
    mnemonic,
    privKey: acc.secretKey,
    addr: AccountPubKey.parse(acc.publicKey),
  };
}

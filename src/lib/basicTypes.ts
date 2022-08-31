import z from "zod";
import bip39 from "bip39";
import aesdk from "@aeternity/aepp-sdk";

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
  const mnemonic = bip39.generateMnemonic();
  const secret = bip39.mnemonicToSeedSync(mnemonic);
  const acc = aesdk.getHdWalletAccountFromSeed(secret, 0);
  return {
    mnemonic,
    privKey: acc.secretKey,
    addr: AccountPubKey.parse(acc.publicKey),
  };
}

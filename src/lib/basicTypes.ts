import z from "zod";
import nacl from 'tweetnacl';
import tweetnaclAuth from 'tweetnacl-auth';
import { generateMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";
import { FateApiEncoder } from "@aeternity/aepp-calldata";

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
  index: z.number(),
  privKey: z.string(),
  addr: AccountPubKey,
});

export type AccountWithSecrets = z.infer<typeof AccountWithSecrets>;

const ED25519_CURVE = Buffer.from("ed25519 seed");
const HARDENED_OFFSET = 0x80000000;

interface KeyTreeNode {
  secretKey: Uint8Array;
  chainCode: Uint8Array;
}

const isWebpack4Buffer = (() => {
  try {
    Buffer.concat([Uint8Array.from([])]);
    return false;
  } catch (error) {
    return true;
  }
})();

const concatBuffers = isWebpack4Buffer
  ? (list: readonly Uint8Array[], totalLength?: number): Buffer =>
      Buffer.concat(
        list.map((el) => Buffer.from(el)),
        totalLength
      )
  : Buffer.concat;

function deriveKey(message: Uint8Array, key: Uint8Array): KeyTreeNode {
  const I = tweetnaclAuth.full(message, key);
  const IL = I.slice(0, 32);
  const IR = I.slice(32);
  return {
    secretKey: IL,
    chainCode: IR,
  };
}

function derivePathFromKey(key: KeyTreeNode, segments: readonly number[]): KeyTreeNode {
  return segments.reduce(({ secretKey, chainCode }, segment) => {
    const indexBuffer = Buffer.allocUnsafe(4);
    indexBuffer.writeUInt32BE(segment + HARDENED_OFFSET, 0);
    const data = concatBuffers([Buffer.alloc(1, 0), secretKey, indexBuffer]);
    return deriveKey(data, chainCode);
  }, key);
}

export function genAccount(): AccountWithSecrets {
  const mnemonic = generateMnemonic(wordlist, 256);

  return getAccount(mnemonic);
}

export function getAccount(mnemonic: string, accountIndex: number = 0): AccountWithSecrets {
  const seed = mnemonicToSeedSync(mnemonic);
  const masterKey = deriveKey(seed, ED25519_CURVE);
  const walletKey = derivePathFromKey(masterKey, [44, 457]);
  const account = derivePathFromKey(walletKey, [accountIndex, 0, 0]);
  const keyPair = nacl.sign.keyPair.fromSeed(account.secretKey);
  const encoder = new FateApiEncoder();

  // console.log(account, keyPair);

  return {
    mnemonic,
    index: accountIndex,
    privKey: Buffer.from(keyPair.secretKey).toString("hex"),
    addr: encoder.encode("account_pubkey", keyPair.publicKey),
  };
}

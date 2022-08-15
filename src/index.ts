#!/usr/bin/env node

import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
// @ts-ignore
import bip39 from "bip39";
import aesdk from "@aeternity/aepp-sdk";
const { getHdWalletAccountFromSeed } = aesdk;

const genValidatorName = ({ seed }: { seed?: number | string }) =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    length: 3,
    separator: " ",
    style: "capital",
    seed,
  });

interface Validator {
  name: string;
  mnemonic: string;
  privKey: string;
  addr: string;
}

const genValidator = ({
  nameSeed,
}: {
  nameSeed?: number | string;
}): Validator => {
  const name = genValidatorName({ seed: nameSeed });
  const mnemonic = bip39.generateMnemonic();
  const secret = bip39.mnemonicToSeedSync(mnemonic);
  const acc = getHdWalletAccountFromSeed(secret, 0);
  return {
    name,
    mnemonic,
    privKey: acc.secretKey,
    addr: acc.publicKey,
  };
};

const genValidators = (count: number) =>
  Array.from({ length: count }).map((x, n) => genValidator({ nameSeed: n }));

const validators = genValidators(3);
console.log("validators", validators);

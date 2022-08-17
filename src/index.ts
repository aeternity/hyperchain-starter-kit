#!/usr/bin/env node

import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import aesdk from "@aeternity/aepp-sdk";
import axios from "axios";
// import * as compilerApi from "./lib/compilerAPI.js";
// import { Api, HttpClient } from "./lib/compilerAPI.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";
import { AccountWithSecrets, genAccount } from "./lib/basicTypes.js";
import { genContractDef, OWNER_ADDR } from "./lib/contracts.js";

const STAKING_VALIDATOR_SOURCE_URL =
  "https://raw.githubusercontent.com/aeternity/aeternity/master/test/contracts/StakingValidator.aes";
const MAIN_STAKING_SOURCE_URL =
  "https://raw.githubusercontent.com/aeternity/aeternity/master/test/contracts/MainStaking.aes";

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
  account: AccountWithSecrets;
}

function genValidator({ nameSeed }: { nameSeed?: number | string }): Validator {
  return {
    name: genValidatorName({ seed: nameSeed }),
    account: genAccount(),
  };
}

const genValidators = (count: number) =>
  Array.from({ length: count }).map((x, n) =>
    genValidator({ nameSeed: n + 1 })
  );

async function fetchContractSource(url: string): Promise<string> {
  return (await axios.get(url)).data.trim().toString();
}

async function main() {
  const validators = genValidators(3);
  console.log("validators", validators);

  const stakingValidatorContrAddr = aesdk.encodeContractAddress(OWNER_ADDR, 1);
  console.log("stakingValidatorContrAddr", stakingValidatorContrAddr);
  const svContract = await genContractDef("master", "StakingValidator", 1, [
    OWNER_ADDR,
  ]);
  console.log(svContract);

  const mainStakingContrAddr = aesdk.encodeContractAddress(OWNER_ADDR, 2);
  console.log("mainStakingContrAddr", mainStakingContrAddr);
  const msContract = await genContractDef("master", "MainStaking", 2, [
    stakingValidatorContrAddr,
    "entropy_string",
    0,
    0,
    0,
    0,
  ]);
  console.log(msContract);
}

main().then(() => {
  // console.log("finished");
});

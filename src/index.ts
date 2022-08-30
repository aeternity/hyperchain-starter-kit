#!/usr/bin/env node

import axios from "axios";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";
import { program } from "commander";
import { initDir } from "./lib/init.js";
import { retrieveContracts } from "./lib/contracts.js";
import { genEconomy } from "./lib/economy.js";

const STAKING_VALIDATOR_SOURCE_URL =
  "https://raw.githubusercontent.com/aeternity/aeternity/master/test/contracts/StakingValidator.aes";
const MAIN_STAKING_SOURCE_URL =
  "https://raw.githubusercontent.com/aeternity/aeternity/master/test/contracts/MainStaking.aes";

async function fetchContractSource(url: string): Promise<string> {
  return (await axios.get(url)).data.trim().toString();
}

async function main() {
  const prg = program.name("hyperchain-starter-kit");
  prg
    .command("init <directory>")
    .description("Initialize a directory as a hyperchain config")
    .action(initDir);
  prg.command("retrieve-contracts <directory>").action(retrieveContracts);
  prg.command("gen-economy <directory>").action(genEconomy);
  prg.parse(process.argv);
  // console.log("prg", prg);
}

main().then(() => {
  // console.log("finished");
});

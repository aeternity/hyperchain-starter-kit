#!/usr/bin/env node

import axios from "axios";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";
import { program } from "commander";
import { initDir } from "./lib/init.js";
import { retrieveContracts } from "./lib/contracts.js";
import { genEconomy } from "./lib/economy.js";
import { genNodeConfig } from "./lib/nodeConf.js";
import { parseAeternityConf } from "./lib/aeternityConfig.js";

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
  prg.command("gen-node-conf <directory>").action(genNodeConfig);
  prg.command("parse-aeternity-conf <file>").action(parseAeternityConf);
  prg.parse(process.argv);
  // console.log("prg", prg);
}

main().then(() => {
  // console.log("finished");
});

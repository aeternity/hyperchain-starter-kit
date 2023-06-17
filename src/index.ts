#!/usr/bin/env node

import axios from "axios";
import { program } from "commander";
import { initDir } from "./lib/init.js";
import { retrieveContracts } from "./lib/contracts.js";
import { genEconomy } from "./lib/economy.js";
import { genNodeConfig, updateParentHeight } from "./lib/nodeConf.js";
import { parseAeternityConf } from "./lib/aeternityConfig.js";
import { getHdWalletAccountFromSeed } from "@aeternity/aepp-sdk";
import { mnemonicToSeedSync } from "@scure/bip39";

async function fetchContractSource(url: string): Promise<string> {
  return (await axios.get(url)).data.trim().toString();
}

function mnemonicToPrivKey(mnemonic: string) {
  const secretKey = mnemonicToSeedSync(mnemonic);
  const acc = getHdWalletAccountFromSeed(secretKey, 0);
  console.log("privkey: ", acc.secretKey);
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
  prg.command("update-parent-height <directory>").action(updateParentHeight);
  prg.command("parse-aeternity-conf <file>").action(parseAeternityConf);
  prg.command("mnemonic-to-privkey <mnemonic>").action(mnemonicToPrivKey);
  prg.parse(process.argv);
  // console.log("prg", prg);
}

main().then(() => {
  // console.log("finished");
});

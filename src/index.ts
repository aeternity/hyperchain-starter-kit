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

function mnemonicToAccount(mnemonic: string, index = "0") {
  const secretKey = mnemonicToSeedSync(mnemonic);
  const idx = parseInt(index, 10);
  const acc = getHdWalletAccountFromSeed(secretKey, idx);
  console.log("account: ", acc);
}

async function main() {
  const prg = program.name("hyperchain-starter-kit");
  prg
    .command("init <directory>")
    .description("Initialize a directory as a hyperchain config")
    .action(initDir);
  prg
    .command("retrieve-contracts <directory>")
    .action(retrieveContracts)
    .description("Download and compile staking/validator/election contracts");
  prg
    .command("gen-economy <directory>")
    .action(genEconomy)
    .description(
      "Generate a list of treasury and validator accounts priv/pub keys in economy-unencrypted.yaml"
    );
  prg
    .command("gen-node-conf <directory>")
    .action(genNodeConfig)
    .description("Generate aeternity.yaml.");
  prg
    .command("update-parent-height <directory>")
    .action(updateParentHeight)
    .description(
      "Update parent_chain.start_height in aeternity.yaml so that it's 2 blocks in the future of the current parent block height."
    );
  prg.command("parse-aeternity-conf <file>").action(parseAeternityConf);
  prg.command("mnemonic-to-privkey <mnemonic>").action(mnemonicToPrivKey);
  prg
    .command("mnemonic-to-account")
    .argument("<mnemonic>")
    .argument("[index]", "account index", parseInt, 0)
    .action(mnemonicToAccount);
  prg.parse(process.argv);
  // console.log("prg", prg);
}

main().then(() => {
  // console.log("finished");
});

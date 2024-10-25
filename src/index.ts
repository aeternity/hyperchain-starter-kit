#!/usr/bin/env node

import { program } from "commander";
import { initDir } from "./lib/init.js";
import { retrieveContracts } from "./lib/contracts.js";
import { genEconomy } from "./lib/economy.js";
import { genNodeConfig, updateParentHeight } from "./lib/nodeConf.js";
import { parseAeternityConf } from "./lib/aeternityConfig.js";
import { getAccount, genAccount } from "./lib/basicTypes.js";

function mnemonicToAccount(mnemonic: string, accountIndex: number = 0) {
  const acc = getAccount(mnemonic, accountIndex);
  console.log("account: ", acc);
}

function generateAccount() {
  const acc = genAccount();
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
  prg
    .command("gen-account")
    .action(generateAccount)
    .description("Generate random account.");
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

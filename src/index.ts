#!/usr/bin/env node

import { program } from "commander";
import { initDir } from "./lib/init.js";
import { retrieveContracts } from "./lib/contracts.js";
import { genEconomy } from "./lib/economy.js";
import { genNodeConfig, updateParentHeight } from "./lib/nodeConf.js";
import { generate } from "./lib/generate.js";
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
    .description("1. Initialize a directory as a hyperchain config")
    .action(initDir);
  prg
    .command("retrieve-contracts <directory>")
    .action(retrieveContracts)
    .description(
      "2. Download and compile staking/validator/election contracts"
    );
  prg
    .command("gen-economy <directory>")
    .action(genEconomy)
    .description(
      "3. Generate a list of treasury and validator accounts priv/pub keys in economy-unencrypted.yaml"
    );
  prg
    .command("gen-node-conf <directory>")
    .action(genNodeConfig)
    .description(
      "4. Generate aeternity.yaml, accounts.json and contracts.json"
    );
  prg
    .command("generate <directory>")
    .action(generate)
    .description("All of the above at once in order");
  prg
    .command("update-parent-height <directory>")
    .action(updateParentHeight)
    .description(
      "Update parent_chain.start_height in aeternity.yaml to be 10 blocks ahead of current height."
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

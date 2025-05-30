import { InitConfig, loadInitConf } from "./init.js";
import { loadYamlFile, writeYamlFile } from "./yamlExtend.js";
import { ContractCall, ContractsFile, loadContract } from "./contracts.js";
import { mkValidatorCalls } from "./validators.js";
import { Economy, mkEconomyPath } from "./economy.js";
import aecalldata from "@aeternity/aepp-calldata";
import path from "path";
import fs from "fs";
import { ensureDir, toJSON } from "./utils.js";
import { getParentHeight } from "./aeParent.js";
import { aeternityConfigSchemaSchema } from "./configSchema/aeternity_config_schema.js";
import {
  AeternityConfigSchemaZ,
  calcStartHeight,
  genAeternityConf,
} from "./aeternityConfig.js";

const mkNodeConfDirPath = (dir: string) => path.join(dir, "nodeConfig");

const mkAccountsJsonPath = (dir: string, conf: InitConfig) =>
  path.join(mkNodeConfDirPath(dir), `${conf.networkId}_accounts.json`);

const mkContractsJsonPath = (dir: string, conf: InitConfig) =>
  path.join(mkNodeConfDirPath(dir), `${conf.networkId}_contracts.json`);

const mkAeternityConfPath = (dir: string) =>
  path.join(mkNodeConfDirPath(dir), `aeternity.yaml`);

const writeAccountsJson = (dir: string, economy: Economy, conf: InitConfig) => {
  const accounts: Record<string, bigint> = {};
  accounts[economy.treasury.account.addr] = economy.treasury.initialBalance;
  accounts[economy.faucet.account.addr] = economy.faucet.initialBalance;
  economy.validators.forEach(
    (v) => (accounts[v.account.addr] = v.initialBalance)
  );
  fs.writeFileSync(mkAccountsJsonPath(dir, conf), toJSON(accounts));
};

export async function genNodeConfig(dir: string) {
  ensureDir(mkNodeConfDirPath(dir));
  const conf = loadInitConf(dir);
  const economy = Economy.parse(loadYamlFile(mkEconomyPath(dir)));
  writeAccountsJson(dir, economy, conf);
  const mainStaking = loadContract(dir, "MainStaking");
  const hcElection = loadContract(dir, "HCElection");
  const encoder = new aecalldata.AciContractCallEncoder(mainStaking.aci);
  let calls: ContractCall[] = [];
  economy.validators.forEach((v) => {
    calls = [...calls, ...mkValidatorCalls(v, mainStaking, encoder, conf)];
  });
  const contractsFile: ContractsFile = {
    contracts: [mainStaking.init, hcElection.init],
    calls,
  };
  fs.writeFileSync(mkContractsJsonPath(dir, conf), toJSON(contractsFile));
  const height = await getParentHeight(conf.parentChain.networkId);
  const aeConfig = genAeternityConf(
    conf,
    economy,
    hcElection,
    mainStaking,
    height
  );
  writeYamlFile(mkAeternityConfPath(dir), aeConfig);
}

export function loadAeConf(dir: string): AeternityConfigSchemaZ {
  const confFile = mkAeternityConfPath(dir);
  return aeternityConfigSchemaSchema.parse(loadYamlFile(confFile, false));
}
export async function updateParentHeight(dir: string) {
  ensureDir(mkNodeConfDirPath(dir));

  const conf = loadInitConf(dir);
  const aeConf = loadAeConf(dir);
  const currHeight = await getParentHeight(conf.parentChain.networkId);
  const startHeight = calcStartHeight(currHeight);

  if (
    aeConf?.chain?.consensus &&
    aeConf?.chain?.consensus[0].config?.parent_chain?.start_height
  ) {
    aeConf.chain.consensus[0].config.parent_chain.start_height = startHeight;
  }

  writeYamlFile(mkAeternityConfPath(dir), aeConf);
  console.log(`File updated successfully with height ${startHeight}.`);
}

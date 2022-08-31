import { InitConfig, loadInitConf } from "./init.js";
import { loadYamlFile } from "./yamlExtend.js";
import {
  ContractCall,
  ContractFile,
  ContractsFile,
  loadContract,
} from "./contracts.js";
import { mkValidatorCalls } from "./validators.js";
import { Economy, mkEconomyPath } from "./economy.js";
// @ts-ignore
import aecalldata from "@aeternity/aepp-calldata";
import path from "path";
import fs from "fs";
import { ensureDir, toJSON } from "./utils.js";

const mkNodeConfDirPath = (dir: string) => path.join(dir, "nodeConfig");

const mkAccountsJsonPath = (dir: string, conf: InitConfig) =>
  path.join(mkNodeConfDirPath(dir), `${conf.networkId}_accounts.json`);

const mkContractsJsonPath = (dir: string, conf: InitConfig) =>
  path.join(mkNodeConfDirPath(dir), `${conf.networkId}_contracts.json`);

const writeAccountsJson = (dir: string, economy: Economy, conf: InitConfig) => {
  const accounts: Record<string, bigint> = {};
  accounts[economy.treasury.account.addr] = economy.treasury.initialBalance;
  economy.validators.forEach(
    (v) => (accounts[v.account.addr] = v.initialBalance)
  );
  fs.writeFileSync(mkAccountsJsonPath(dir, conf), toJSON(accounts));
};

export function genNodeConfig(dir: string) {
  ensureDir(mkNodeConfDirPath(dir));
  const conf = loadInitConf(dir);
  const economy = Economy.parse(loadYamlFile(mkEconomyPath(dir)));
  writeAccountsJson(dir, economy, conf);
  const ms = loadContract(dir, "MainStaking");
  const sv = loadContract(dir, "StakingValidator");
  const encoder = new aecalldata.Encoder(ms.aci);
  let calls: ContractCall[] = [];
  economy.validators.forEach((v) => {
    calls = [...calls, ...mkValidatorCalls(v, ms, encoder, conf)];
  });
  const contractsFile: ContractsFile = { contracts: [sv.init, ms.init], calls };
  fs.writeFileSync(mkContractsJsonPath(dir, conf), toJSON(contractsFile));
}

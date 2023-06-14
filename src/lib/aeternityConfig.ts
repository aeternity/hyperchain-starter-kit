import z from "zod";
import { AccountPubKey, ContractAddr } from "./basicTypes.js";
import { loadJsonFile } from "./utils.js";
import { ContractDef, OWNER_ADDR } from "./contracts.js";
import { InitConfig } from "./init.js";
import { Economy } from "./economy.js";
import { aeternityConfigSchemaSchema } from "./configSchema/aeternity_config_schema";
import { AeternityConfigSchema } from "./configSchema/aeternity_config_schema-gen";

const Consensus = z
  .object({
    name: z.literal("hyper_chain"),
    config: z
      .object({
        contract_owner: z.literal(OWNER_ADDR),
        election_contract: ContractAddr,
        expected_key_block_rate: z.literal(2000n),
        rewards_contract: ContractAddr,
        stakers: z.array(
          z.object({ priv: z.string(), pub: AccountPubKey }).strict()
        ),
        parent_chain: z
          .object({
            confirmations: z.literal(101n),
            fetch_interval: z.literal(1000n),
            type: z.literal("AE"),
            start_height: z.bigint(),
            nodes: z.array(
              z
                .object({
                  host: z.literal("mainnet.aeternity.io"),
                  password: z.literal("Pass"),
                  port: z.bigint(),
                  user: z.literal("test"),
                })
                .strict()
            ),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

const AeternityConfig = z
  .object({
    fork_management: z.object({ network_id: z.string() }),
    include_default_peers: z.literal(false),
    peers: z.array(z.never()),
    mining: z.object({
      autostart: z.literal(true),
      beneficiary: AccountPubKey,
    }),
    chain: z.object({
      persist: z.literal(true),
      db_direct_access: z.literal(true),
      hard_forks: z.object({ "6": z.literal(0n) }),
      consensus: z
        .object({
          "0": Consensus,
        })
        .strict(),
    }),
  })
  .strict();
type AeternityConfig = z.infer<typeof AeternityConfig>;
type AeternityConfigSchemaZ = z.infer<typeof aeternityConfigSchemaSchema>;

export function parseAeternityConf(path: string) {
  console.log("blah");
  const js = loadJsonFile(path);
  const ac = AeternityConfig.parse(js, {});
  console.log("aeternity config", ac);
  console.log("consensus config", ac.chain.consensus["0"]);
  console.log(
    "parent chain nodes",
    ac.chain.consensus["0"].config.parent_chain.nodes
  );
  console.log("stakers", ac.chain.consensus["0"].config.stakers);
}

export function genAeternityConf(
  conf: InitConfig,
  economy: Economy,
  hcElection: ContractDef,
  mainStaking: ContractDef,
  startHeight: number
): AeternityConfigSchemaZ {
  return {
    fork_management: { network_id: conf.networkId },
    mining: { beneficiary: economy.treasury.account.addr, autostart: true },
    peers: [],
    include_default_peers: false,
    chain: {
      persist: true,
      db_direct_access: true,
      hard_forks: { 6: 0 },
      consensus: {
        0: {
          type: "hyper_chain",
          config: {
            contract_owner: OWNER_ADDR,
            election_contract: hcElection.init.pubkey,
            rewards_contract: mainStaking.init.pubkey,
            expected_key_block_rate: 2000,
            parent_chain: {
              confirmations: 6,
              start_height: startHeight - 101,
              consensus: {
                network_id: "ae_mainnet",
                spend_address: "",
                type: "AE2AE",
              },
              polling: {
                fetch_interval: 500,
                nodes: [
                  {
                    host: "localhost",
                    port: 3013,
                    user: "",
                    password: "",
                  },
                ],
              },
              stakers: [
                {
                  hyper_chain_account: economy.validators.map((v) => ({
                    pub: v.account.addr,
                    priv: v.account.privKey,
                  })),
                  parent_chain_account: {
                    pub: "",
                    priv: "",
                  },
                },
              ],
            },
          },
        },
      },
    },
  };
}

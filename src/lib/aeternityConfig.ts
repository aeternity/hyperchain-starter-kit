import z from "zod";
import { AccountPubKey, ContractAddr } from "./basicTypes.js";
import { loadJsonFile } from "./utils.js";
import { ContractDef, OWNER_ADDR } from "./contracts.js";
import { AE_BRI_ACCOUNT, InitConfig } from "./init.js";
import { Economy } from "./economy.js";
import { aeternityConfigSchemaSchema } from "./configSchema/aeternity_config_schema";

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
            confirmations: z.literal(0n),
            start_height: z.bigint(),
            producing_commitments: z.literal(true),
            consensus: z.object({
              fee: z.bigint(),
              amount: z.bigint(),
              network_id: z.string(),
              spend_address: z.string(),
              type: z.literal("AE2AE"),
            }),
            polling: z.object({
              fetch_interval: z.bigint(),
              nodes: z.array(
                z
                  .object({
                    host: z.literal("mainnet.aeternity.io"),
                    port: z.bigint(),
                    user: z.literal("not used"),
                    password: z.literal("not used"),
                  })
                  .strict()
              ),
            }),
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
      hard_forks: z.object({ "5": z.literal(0n) }),
      consensus: z
        .object({
          "0": Consensus,
        })
        .strict(),
    }),
  })
  .strict();
type AeternityConfig = z.infer<typeof AeternityConfig>;
export type AeternityConfigSchemaZ = z.infer<
  typeof aeternityConfigSchemaSchema
>;

const staker = z.object({
  hyper_chain_account: z.object({
    pub: z.string().optional(),
    priv: z.string().optional(),
  }),
  parent_chain_account: z.object({
    pub: z.string().optional(),
    priv: z.string().optional(),
  }),
});
type TStaker = z.infer<typeof staker>;

export function parseAeternityConf(path: string) {
  console.log("blah");
  const js = loadJsonFile(path);
  const ac = AeternityConfig.parse(js, {});
  console.log("aeternity config", ac);
  console.log("consensus config", ac.chain.consensus["0"]);
  console.log(
    "parent chain nodes",
    ac.chain.consensus["0"].config.parent_chain.polling.nodes
  );
  console.log("stakers", ac.chain.consensus["0"].config.stakers);
}

export const calcStartHeight = (startHeight: number): number => startHeight + 10;

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
      hard_forks: { 5: 0 },
      consensus: {
        "0": {
          type: "hyper_chain",
          config: {
            contract_owner: OWNER_ADDR,
            election_contract: hcElection.init.pubkey,
            rewards_contract: mainStaking.init.pubkey,
            expected_key_block_rate: 2000,
            lazy_leader_trigger_time: 5000,
            parent_chain: {
              confirmations: 0,
              start_height: calcStartHeight(startHeight),
              producing_commitments: true,
              consensus: {
                fee: 100000000000000,
                amount: 1,
                network_id: conf.parentChain.networkId,
                spend_address: AE_BRI_ACCOUNT,
                type: conf.parentChain.type,
              },
              polling: {
                fetch_interval: 500,
                nodes: [
                  {
                    host: "localhost",
                    port: 3013,
                    user: "not used",
                    password: "not used",
                  },
                ],
              },
            },
            stakers: economy.validators.map(
              (v): TStaker => ({
                hyper_chain_account: {
                  pub: v.account.addr,
                  priv: v.account.privKey,
                },
                parent_chain_account: {
                  pub: economy.parentChainAccount.addr,
                  priv: economy.parentChainAccount.privKey,
                },
              })
            ),
          },
        },
      },
    },
    http: {
      endpoints: {
        "dry-run": true,
      },
    },
  };
}

import z from "zod";
import { AccountPubKey, ContractAddr } from "./basicTypes.js";
import { loadJsonFile } from "./utils.js";
import { ContractDef, OWNER_ADDR } from "./contracts.js";
import { InitConfig } from "./init.js";
import { Economy } from "./economy.js";
import { aeternityConfigSchemaSchema } from "./configSchema/aeternity_config_schema";

const Consensus = z
  .object({
    name: z.literal("hyperchain"),
    config: z
      .object({
        child_block_time: z.bigint(),
        child_epoch_length: z.bigint(),
        contract_owner: z.literal(OWNER_ADDR),
        staking_contract: ContractAddr,
        election_contract: ContractAddr,
        rewards_contract: ContractAddr,
        pinning_reward_value: z.bigint(),
        fixed_coinbase: z.bigint(),
        default_pinning_behavior: z.boolean(),
        stakers: z.array(
          z.object({ priv: z.string(), pub: AccountPubKey }).strict()
        ),
        parent_chain: z
          .object({
            parent_epoch_length: z.bigint(),
            start_height: z.bigint(),
            consensus: z.object({
              network_id: z.string(),
              type: z.literal("AE2AE"),
            }),
            polling: z.object({
              fetch_interval: z.bigint(),
              nodes: z.array(z.string()),
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
    mining: z.object({
      autostart: z.literal(true),
    }),
    chain: z.object({
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
    mining: { autostart: true },
    chain: {
      hard_forks: { 6: 0 },
      consensus: {
        "0": {
          type: "hyperchain",
          config: {
            contract_owner: OWNER_ADDR,
            staking_contract: mainStaking.init.pubkey,
            election_contract: hcElection.init.pubkey,
            rewards_contract: mainStaking.init.pubkey,
            child_block_time: conf.childBlockTime,
            child_epoch_length: conf.childEpochLength,
            pinning_reward_value: conf.pinningReward,
            fixed_coinbase: conf.fixedCoinbase,
            default_pinning_behavior: conf.enablePinning,
            parent_chain: {
              parent_epoch_length: conf.parentChain.epochLength,
              start_height: calcStartHeight(startHeight),
              consensus: {
                network_id: conf.parentChain.networkId,
                type: conf.parentChain.type,
              },
              polling: {
                fetch_interval: 500,
                nodes: [conf.parentChain.nodeURL],
              },
            },
            stakers: economy.validators.map(
              (v): TStaker => ({
                hyper_chain_account: {
                  pub: v.account.addr,
                  priv: v.account.privKey,
                },
              })
            ),
            pinners: economy.pinners.map(
              (p): TStaker => ({
                parent_chain_account: {
                  pub: p.account.addr,
                  priv: p.account.privKey,
                  owner: p.owner,
                },
              })
            ),
          },
        },
      },
    },
  };
}

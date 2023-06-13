// This file was generated. Do not edit it manually.
// Schema copied from https://raw.githubusercontent.com/aeternity/aeternity/master/apps/aeutils/priv/aeternity_config_schema.json

import { z } from "zod";

export const schema = z
  .object({
    system: z
      .object({
        maintenance_mode: z
          .boolean()
          .describe(
            "When true, the node disables sync, mining, http endpoints etc"
          )
          .default(false),
        offline_mode: z
          .boolean()
          .describe(
            "When true, the node disables sync, mining, but keeps http endpoints open"
          )
          .default(false),
        dev_mode: z
          .boolean()
          .describe(
            "When true, the node sets up for development (default netw id: ae_dev, default consensus: on_demand)"
          )
          .default(false),
        plugin_path: z
          .string()
          .describe("Directory containing Aeternity node plugins")
          .default("plugins"),
        plugins: z
          .array(
            z
              .object({
                name: z.string().describe("Erlang application name of plugin"),
                config: z
                  .record(z.any())
                  .and(z.object({}))
                  .describe("Configuration for the given plugin")
                  .optional(),
              })
              .describe("Plugin name and properties")
          )
          .describe("List of application names of plugins to load")
          .default([]),
        custom_prefunded_accs_file: z
          .string()
          .describe(
            "Overrides the automatically derived file name for prefunded accounts. No default value"
          )
          .optional(),
      })
      .strict()
      .optional(),
    peers: z
      .array(
        z
          .string()
          .regex(
            new RegExp(
              "^aenode://pp_[a-zA-Z0-9]+@[^:\\.\"!#$%^&*()',/]+(\\.[^:\\.\"!#$%^&*()',/]+)*:[0-9]+/*$"
            )
          )
          .describe("Aeternity Node address")
      )
      .describe(
        "Pre-configured addresses of nodes to contact. If not set testnet or mainnet seed peers will be used based on network_id configuration value."
      )
      .default([]),
    include_default_peers: z
      .boolean()
      .describe(
        "If the default peers shall be added as trusted peers. Note: setting this to false means that the default seed nodes would not be used and a proper set of peers had been added instead."
      )
      .default(true),
    blocked_peers: z
      .array(
        z
          .string()
          .regex(
            new RegExp(
              "^aenode://pp_[a-zA-Z0-9]+@[^:\\.\"!#$%^&*()',/]+(\\.[^:\\.\"!#$%^&*()',/]+)*:[0-9]+/*$"
            )
          )
          .describe("Aeternity Node address")
      )
      .describe("Pre-configured addresses of nodes NOT to contact")
      .default([]),
    mempool: z
      .object({
        tx_ttl: z
          .number()
          .int()
          .describe(
            "Number of blocks before inactive TXs are garbage collected. Default: `(60 div 3) * 24 * 2 * 7`"
          )
          .default(6720),
        invalid_tx_ttl: z
          .number()
          .int()
          .describe(
            "Number of blocks before invalid (TTL or low nonce) TXs are garbage collected"
          )
          .default(5),
        sync_interval: z
          .number()
          .int()
          .describe(
            "Interval between mempool (re-)synchronization (in ms) Default: `30 * 60 * 1000`"
          )
          .default(1800000),
        nonce_offset: z
          .number()
          .int()
          .describe("Maximum nonce offset accepted")
          .default(5),
        nonce_baseline: z
          .number()
          .int()
          .describe(
            "Maximum nonce accepted when pubkey is not present in state"
          )
          .default(1),
        cache_size: z
          .number()
          .int()
          .describe("Maximum number of recently received cached transactions")
          .default(200),
        allow_reentry_of_txs: z
          .boolean()
          .describe(
            "Allow already deleted transactions to reenter the tx-pool."
          )
          .default(false),
        tx_failures: z
          .object({
            enabled: z
              .boolean()
              .describe(
                "If true, the following error codes will have specific failures."
              )
              .default(true),
            common: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                crash: z
                  .number()
                  .int()
                  .describe("Something went really wrong, clean up.")
                  .default(1),
                not_a_generalized_account: z
                  .number()
                  .int()
                  .describe(
                    "If the transaction is being authenticated as a GA but the account is still basic. We provide a grace period in a number of generations for the account to be upgraded."
                  )
                  .default(15),
                tx_nonce_already_used_for_account: z
                  .number()
                  .int()
                  .describe(
                    "If the transaction nonce is already used, the transaction can not be applied. Clean it up."
                  )
                  .default(1),
                tx_nonce_too_high_for_account: z
                  .number()
                  .int()
                  .describe(
                    "If the transaction nonce is set somewhere in the future it can get included once the transaction with the missing nonce is being included. Provide a grace period in a number of generations."
                  )
                  .default(30),
              })
              .catchall(z.any())
              .optional(),
            spend_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
              })
              .catchall(z.any())
              .optional(),
            name_preclaim_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
              })
              .catchall(z.any())
              .optional(),
            name_claim_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                bad_transaction: z
                  .number()
                  .int()
                  .describe(
                    "If there is something unexpected about the transaciton. Clean up."
                  )
                  .default(1),
                name_not_preclaimed: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have ownership to the commitment. Legacy. Clean up."
                  )
                  .default(1),
                commitment_not_owned: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have ownership to the commitment. Clean up."
                  )
                  .default(1),
                commitment_delta_too_small: z
                  .number()
                  .int()
                  .describe(
                    "If the commitment had not yet matured, provide a grace period for it."
                  )
                  .default(50),
                name_already_taken: z
                  .number()
                  .int()
                  .describe("If the name is already registered. Clean up.")
                  .default(1),
                invalid_registrar: z
                  .number()
                  .int()
                  .describe(
                    "If the registrar is not available, if there is an upcoming fork to allow new registrars - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                invalid_name_fee: z
                  .number()
                  .int()
                  .describe(
                    "If the fee is insufficient for the name. If there is an upcoming fork that changes pricing - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            name_revoke_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                name_not_owned: z
                  .number()
                  .int()
                  .describe(
                    "If the name is not owned by the origin of the transaction. Clean up."
                  )
                  .default(1),
                name_revoked: z
                  .number()
                  .int()
                  .describe("If the the name is already revoked. Clean up")
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            name_transfer_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                name_not_owned: z
                  .number()
                  .int()
                  .describe(
                    "If the name is not owned by the origin of the transaction. Clean up."
                  )
                  .default(1),
                name_revoked: z
                  .number()
                  .int()
                  .describe("If the the name is already revoked. Clean up")
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            name_update_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                ttl_too_high: z
                  .number()
                  .int()
                  .describe(
                    "If the provided TTL is too far away in the future. If there is an upcoming fork that changes pricing - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                ttl_too_low: z
                  .number()
                  .int()
                  .describe(
                    "If the provided TTL is too soon. If there is an upcoming fork that changes pricing - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                ttl_invalid: z
                  .number()
                  .int()
                  .describe(
                    "If the provided TTL is using unknown format. If there is an upcoming fork that changes pricing - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                name_not_owned: z
                  .number()
                  .int()
                  .describe(
                    "If the name is not owned by the origin of the transaction. Clean up."
                  )
                  .default(1),
                name_revoked: z
                  .number()
                  .int()
                  .describe("If the name is already revoked. Clean up")
                  .default(1),
                invalid_pointers: z
                  .number()
                  .int()
                  .describe(
                    "If the provided pointers fail the required checks. If there is an upcoming fork that changes pricing - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            channel_create_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
              })
              .catchall(z.any())
              .optional(),
            channel_close_mutual_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                channel_does_not_exist: z
                  .number()
                  .int()
                  .describe(
                    "If the channel to be closed is not present. We provide a grace period in a number of generations."
                  )
                  .default(5),
                account_not_peer: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not a channel peer. Clean up."
                  )
                  .default(1),
                channel_not_active: z
                  .number()
                  .int()
                  .describe("If the channel is already closing. Clean up.")
                  .default(1),
                wrong_amounts: z
                  .number()
                  .int()
                  .describe(
                    "If the channel closing amounts exceed the channel balance. There could be a hanging channel_deposit_tx, provide a grace period."
                  )
                  .default(20),
              })
              .catchall(z.any())
              .optional(),
            channel_deposit_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                channel_does_not_exist: z
                  .number()
                  .int()
                  .describe(
                    "If the channel to be deposited is not present. We provide a grace period in a number of generations."
                  )
                  .default(5),
                channel_not_active: z
                  .number()
                  .int()
                  .describe("If the channel is already closing. Clean up.")
                  .default(1),
                old_round: z
                  .number()
                  .int()
                  .describe(
                    "If the channel deposit is based on a round older than the on-chain stored one. Clean up."
                  )
                  .default(1),
                same_round: z
                  .number()
                  .int()
                  .describe(
                    "If the channel deposit is trying to replace current state hash. Clean up."
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            channel_withdraw_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                channel_does_not_exist: z
                  .number()
                  .int()
                  .describe(
                    "If the channel to be withdrawn from is not present. We provide a grace period in a number of generations."
                  )
                  .default(5),
                channel_not_active: z
                  .number()
                  .int()
                  .describe("If the channel is already closing. Clean up.")
                  .default(1),
                old_round: z
                  .number()
                  .int()
                  .describe(
                    "If the channel withdrawal is based on a round older than the on-chain stored one. Clean up."
                  )
                  .default(1),
                same_round: z
                  .number()
                  .int()
                  .describe(
                    "If the channel withdrawal is trying to replace current state hash. Clean up."
                  )
                  .default(1),
                not_enough_channel_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the channel withdrawal is trying to withdraw more tokens than the current channels balance allows it to.  There could be a hanging channel_deposit_tx, provide a grace period."
                  )
                  .default(20),
              })
              .catchall(z.any())
              .optional(),
            channel_settle_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                channel_does_not_exist: z
                  .number()
                  .int()
                  .describe(
                    "If the channel to be settled is not present. We provide a grace period in a number of generations."
                  )
                  .default(5),
                account_not_peer: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not a channel peer. Clean up."
                  )
                  .default(1),
                channel_not_closed: z
                  .number()
                  .int()
                  .describe(
                    "If the channel dispute time interval is still active. Provide a grace period."
                  )
                  .default(20),
                wrong_amt: z
                  .number()
                  .int()
                  .describe(
                    "If the channel final amounts do not match the closing amounts. There could be a hanging channel_slash_tx, provide a grace period."
                  )
                  .default(20),
                insufficient_channel_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the channel final amounts exceedthe channel balance. Clean up."
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            channel_close_solo_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                channel_does_not_exist: z
                  .number()
                  .int()
                  .describe(
                    "If the channel to be closed is not present. We provide a grace period in a number of generations."
                  )
                  .default(5),
                account_not_peer: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not a channel peer. Clean up."
                  )
                  .default(1),
                channel_not_active: z
                  .number()
                  .int()
                  .describe("If the channel is already closing. Clean up.")
                  .default(1),
                payload_deserialization_failed: z
                  .number()
                  .int()
                  .describe(
                    "If the payload is from an unknown format, if there is an upcoming fork to allow new serializations - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                bad_offchain_state_type: z
                  .number()
                  .int()
                  .describe(
                    "If the offhchain state is from an unknown off-chain transaction type, if there is an upcoming fork to allow new off-chain transaction types - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                account_not_found: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not in the state tree. Clean up."
                  )
                  .default(1),
                invalid_poi_hash_in_channel: z
                  .number()
                  .int()
                  .describe(
                    "If the root of the proof of inclusion for the off-chain state does not match the provided hash. Clean up."
                  )
                  .default(1),
                bad_state_channel_pubkey: z
                  .number()
                  .int()
                  .describe(
                    "If the channel id of the payload off-chain transaction does not match the transaction channel id. Clean up."
                  )
                  .default(1),
                old_round: z
                  .number()
                  .int()
                  .describe(
                    "If the transaction is based on a round older than the on-chain stored one. Clean up."
                  )
                  .default(1),
                same_round: z
                  .number()
                  .int()
                  .describe(
                    "If the transaction is trying to replace current state hash. Clean up."
                  )
                  .default(1),
                signature_check_failed: z
                  .number()
                  .int()
                  .describe("If the payload authentication failed. Clean up.")
                  .default(1),
                wrong_channel_peers: z
                  .number()
                  .int()
                  .describe(
                    "If the accounts provided in the PoI are not of the channel participants. Clean up."
                  )
                  .default(1),
                poi_amounts_change_channel_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the amounts of accounts provided in the PoI exceed the total channel balance. Clean up."
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            channel_slash_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                channel_does_not_exist: z
                  .number()
                  .int()
                  .describe(
                    "If the channel to be slashed is not present. We provide a grace period in a number of generations."
                  )
                  .default(5),
                account_not_peer: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not a channel peer. Clean up."
                  )
                  .default(1),
                channel_not_closing: z
                  .number()
                  .int()
                  .describe(
                    "If the channel is not yet closing. There might be a close solo hanging in the pool, provide a grace period."
                  )
                  .default(20),
                payload_deserialization_failed: z
                  .number()
                  .int()
                  .describe(
                    "If the payload is from an unknown format, if there is an upcoming fork to allow new serializations - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                bad_offchain_state_type: z
                  .number()
                  .int()
                  .describe(
                    "If the offhchain state is from an unknown off-chain transaction type, if there is an upcoming fork to allow new off-chain transaction types - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                account_not_found: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not in the state tree. Clean up."
                  )
                  .default(1),
                invalid_poi_hash_in_channel: z
                  .number()
                  .int()
                  .describe(
                    "If the root of the proof of inclusion for the off-chain state does not match the provided hash. Clean up."
                  )
                  .default(1),
                bad_state_channel_pubkey: z
                  .number()
                  .int()
                  .describe(
                    "If the channel id of the payload off-chain transaction does not match the transaction channel id. Clean up."
                  )
                  .default(1),
                old_round: z
                  .number()
                  .int()
                  .describe(
                    "If the transaction is based on a round older than the on-chain stored one. Clean up."
                  )
                  .default(1),
                same_round: z
                  .number()
                  .int()
                  .describe(
                    "If the transaction is trying to replace current state hash. Clean up."
                  )
                  .default(1),
                signature_check_failed: z
                  .number()
                  .int()
                  .describe("If the payload authentication failed. Clean up.")
                  .default(1),
                wrong_channel_peers: z
                  .number()
                  .int()
                  .describe(
                    "If the accounts provided in the PoI are not of the channel participants. Clean up."
                  )
                  .default(1),
                poi_amounts_change_channel_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the amounts of accounts provided in the PoI exceed the total channel balance. Clean up."
                  )
                  .default(1),
                slash_must_have_payload: z
                  .number()
                  .int()
                  .describe(
                    "If the slash transaction comes with an empty payload. Clean up."
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            channel_snapshot_solo_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                payload_deserialization_failed: z
                  .number()
                  .int()
                  .describe(
                    "If the payload is from an unknown format, if there is an upcoming fork to allow new serializations - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                snapshot_must_have_payload: z
                  .number()
                  .int()
                  .describe(
                    "If the snapshot transaction comes with an empty payload. Clean up."
                  )
                  .default(1),
                bad_offchain_state_type: z
                  .number()
                  .int()
                  .describe(
                    "If the offhchain state is from an unknown off-chain transaction type, if there is an upcoming fork to allow new off-chain transaction types - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                channel_does_not_exist: z
                  .number()
                  .int()
                  .describe(
                    "If the channel to be snapshot is not present. We provide a grace period in a number of generations."
                  )
                  .default(5),
                account_not_found: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not in the state tree. Clean up."
                  )
                  .default(1),
                account_not_peer: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not a channel peer. Clean up."
                  )
                  .default(1),
                channel_not_active: z
                  .number()
                  .int()
                  .describe("If the channel is already closing. Clean up.")
                  .default(1),
                old_round: z
                  .number()
                  .int()
                  .describe(
                    "If the channel deposit is based on a round older than the on-chain stored one. Clean up."
                  )
                  .default(1),
                same_round: z
                  .number()
                  .int()
                  .describe(
                    "If the channel deposit is trying to replace current state hash. Clean up."
                  )
                  .default(1),
                signature_check_failed: z
                  .number()
                  .int()
                  .describe("If the payload authentication failed. Clean up.")
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            channel_set_delegates_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                channel_does_not_exist: z
                  .number()
                  .int()
                  .describe(
                    "If the channel to be set is not present. We provide a grace period in a number of generations."
                  )
                  .default(5),
                bad_offchain_state_type: z
                  .number()
                  .int()
                  .describe(
                    "If the offhchain state is from an unknown off-chain transaction type, if there is an upcoming fork to allow new off-chain transaction types - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                payload_deserialization_failed: z
                  .number()
                  .int()
                  .describe(
                    "If the payload is from an unknown format, if there is an upcoming fork to allow new serializations - provide a grace period for it, otherwise clean up."
                  )
                  .default(1),
                account_not_found: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not in the state tree. Clean up."
                  )
                  .default(1),
                account_not_peer: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction is not a channel peer. Clean up."
                  )
                  .default(1),
                channel_not_active: z
                  .number()
                  .int()
                  .describe("If the channel is already closing. Clean up.")
                  .default(1),
                unexpected_state_hash: z
                  .number()
                  .int()
                  .describe(
                    "If the set delegates is based on the latest state hash which is different. We provide a grace period in a number of generations."
                  )
                  .default(5),
                unexpected_round: z
                  .number()
                  .int()
                  .describe(
                    "If the set delegates is based on the latest round which is different. We provide a grace period in a number of generations."
                  )
                  .default(5),
              })
              .catchall(z.any())
              .optional(),
            contract_create_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                illegal_vm_version: z
                  .number()
                  .int()
                  .describe(
                    "If the VM version is not supported. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
                illegal_contract_compiler_version: z
                  .number()
                  .int()
                  .describe(
                    "If the compiler version is not supported. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
                bad_sophia_code: z
                  .number()
                  .int()
                  .describe(
                    "If the sophia code does not parse. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
                bad_init_function: z
                  .number()
                  .int()
                  .describe(
                    "If the init function fails. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            contract_call_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                illegal_vm_version: z
                  .number()
                  .int()
                  .describe(
                    "If the VM version is not supported. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            ga_attach_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                illegal_vm_version: z
                  .number()
                  .int()
                  .describe(
                    "If the VM version is not supported. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            oracle_register_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                account_is_already_an_oracle: z
                  .number()
                  .int()
                  .describe("If account is already an oracle. Clean up")
                  .default(1),
                bad_abi_version: z
                  .number()
                  .int()
                  .describe(
                    "If the ABI version is not supported. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
                bad_query_format: z
                  .number()
                  .int()
                  .describe(
                    "If the query format is not supported. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
                bad_response_format: z
                  .number()
                  .int()
                  .describe(
                    "If the response format is not supported. If there is an upcoming hard fork - provide a grace period, otherwise - clean up"
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            oracle_extend_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                account_is_not_an_active_oracle: z
                  .number()
                  .int()
                  .describe("If account is not an oracle. Clean up")
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            oracle_query_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                oracle_does_not_exist: z
                  .number()
                  .int()
                  .describe("If oracle does not exist. Clean up")
                  .default(1),
                bad_format: z
                  .number()
                  .int()
                  .describe("If the query format does not match up. Clean up")
                  .default(1),
                query_fee_too_low: z
                  .number()
                  .int()
                  .describe(
                    "If the fee provided does not match expectations. Clean up"
                  )
                  .default(1),
                too_long_ttl: z
                  .number()
                  .int()
                  .describe(
                    "If the ttl provided does not match expectations. Clean up"
                  )
                  .default(1),
              })
              .catchall(z.any())
              .optional(),
            oracle_response_tx: z
              .object({
                fallback: z
                  .number()
                  .int()
                  .describe("Default value if the failed reason is not set.")
                  .default(5),
                insufficient_funds: z
                  .number()
                  .int()
                  .describe(
                    "If the origin of the transaction does not have enough tokens to spend. We provide a grace period in a number of generations."
                  )
                  .default(20),
                oracle_does_not_exist: z
                  .number()
                  .int()
                  .describe("If oracle does not exist. Clean up")
                  .default(1),
                bad_format: z
                  .number()
                  .int()
                  .describe("If the query format does not match up. Clean up")
                  .default(1),
                no_matching_oracle_query: z
                  .number()
                  .int()
                  .describe(
                    "If there is no matching query id. Provide a grace period"
                  )
                  .default(20),
              })
              .catchall(z.any())
              .optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    sync: z
      .object({
        upnp_enabled: z
          .boolean()
          .describe(
            "If true, UPnP & NAT-PMP discovery will be enabled and port mapping will be established."
          )
          .default(false),
        listen_address: z
          .string()
          .describe(
            "Listen address for external interface. This should be publicly accessible"
          )
          .default("0.0.0.0"),
        port: z
          .number()
          .int()
          .describe(
            "Local port used for incoming sync connections. If behind NAT this may differ from the 'external_port' value."
          )
          .default(3015),
        ping_interval: z
          .number()
          .int()
          .describe("Interval between pings (in ms)")
          .default(120000),
        external_port: z
          .number()
          .int()
          .describe(
            "Listen port for external sync connections. This must be the WAN-facing port number (depending on NAT configuration this may be different from 'port' value above)."
          )
          .default(3015),
        acceptors: z
          .number()
          .int()
          .describe("Number of acceptors in listening pool")
          .default(10),
        connect_timeout: z
          .number()
          .int()
          .describe("Connection timeout in milliseconds")
          .default(1000),
        first_ping_timeout: z
          .number()
          .int()
          .describe("Maximum time for receiving a ping in milliseconds")
          .default(30000),
        noise_hs_timeout: z
          .number()
          .int()
          .describe("Maximum time for noise handshake in milliseconds")
          .default(5000),
        close_timeout: z
          .number()
          .int()
          .describe("Maximum time for the peer to close a connection cleanly")
          .default(3000),
        max_inbound: z
          .number()
          .int()
          .describe(
            "Maximum number of inbound connections after which inbound connections are temporary (only used for a single ping)"
          )
          .default(100),
        max_inbound_hard: z
          .number()
          .int()
          .describe("Maximum number of inbound connections")
          .default(1000),
        max_outbound: z
          .number()
          .int()
          .describe("Maximum number of outbound connections")
          .default(10),
        max_gossip: z
          .number()
          .int()
          .gte(0)
          .describe(
            "Maximum number of peers to gossip blocks and transactions to"
          )
          .default(10),
        single_outbound_per_group: z
          .boolean()
          .describe(
            "If the extra outbound connections should be to nodes from different address groups (IP netmask /16)"
          )
          .default(true),
        gossiped_peers_count: z
          .number()
          .int()
          .gte(1)
          .lte(32)
          .describe("The number of peers sent in ping message")
          .default(32),
        resolver_max_retries: z
          .number()
          .int()
          .gte(0)
          .describe(
            "Maximum number of retries at resolving the host name of untrusted peers."
          )
          .default(7),
        resolver_backoff_times: z
          .array(z.number().int().gte(1))
          .min(1)
          .describe(
            "Waiting time intervals (milliseconds) before each retry at resolving the host name of peers (both trusted and untrusted). Retries further to the length of the array reuse the last item of the array."
          )
          .default([5000, 15000, 30000, 60000, 120000, 300000, 600000]),
        gossip_allowed_height_from_top: z
          .number()
          .int()
          .describe(
            "Allowed height difference from current top for incoming blocks (via gossip)"
          )
          .default(5),
        sync_allowed_height_from_top: z
          .number()
          .int()
          .describe(
            "Once own node is synced, reject sync blocks at least this far from the current top; 0 means disabled"
          )
          .default(100),
        resist_forks_from_start: z
          .boolean()
          .describe(
            "If sync_allowed_height_from_top > 0, this is applied at startup"
          )
          .default(false),
        whitelist_file: z
          .string()
          .describe("The name of a block hash whitelist file (JSON format)")
          .default(".block_whitelist.json"),
        log_peer_connection_count_interval: z
          .number()
          .int()
          .describe(
            "Time (milliseconds) between logging info about connected peers"
          )
          .default(300000),
        peer_pool: z
          .object({
            select_verified_peer_probability: z
              .number()
              .gte(0)
              .lte(1)
              .describe(
                "Probability of selecting a peer from the verified pool."
              )
              .default(1),
            max_update_lapse: z
              .number()
              .int()
              .gte(60000)
              .describe(
                "Time (milliseconds) without a peer being updated after which it gets removed."
              )
              .default(10800000),
            standby_times: z
              .array(z.number().int().gte(1))
              .min(1)
              .describe(
                "Waiting time intervals (milliseconds) before each retry to connect to a peer. If there are more 'max_rejections' than elements in this list, the last retry time is used more than once."
              )
              .default([5000, 15000, 30000, 60000, 120000, 300000, 600000]),
            max_rejections: z
              .number()
              .int()
              .gte(1)
              .describe(
                "The default maximum number of times a peer can get rejected. When reached, the peer is downgraded or removed (if not trusted)."
              )
              .default(7),
          })
          .optional(),
        provide_node_info: z
          .boolean()
          .describe("Provide node version to peers")
          .default(true),
        peer_analytics: z
          .boolean()
          .describe(
            "If enabled aggregates info about remote peers and exposes them via HTTP. Overrides max_inbound and max_outbound"
          )
          .default(false),
      })
      .strict()
      .optional(),
    http: z
      .object({
        cors: z
          .object({
            allow_domains: z
              .array(z.string())
              .min(1)
              .describe(
                "List of domains that can access resources. Use '*' to allow all domains."
              )
              .default(["*"]),
            allow_headers: z
              .array(z.string())
              .min(1)
              .describe(
                "List of allowed headers to be used with requests (to be set in access-control-request-headers header in the response). Use '*' or do not set at all to allow all headers."
              )
              .default(["*"]),
            allow_methods: z
              .array(z.string())
              .min(1)
              .describe(
                "List of allowed methods allowed to be used when accessing resources (to be set in access-control-allow-methods header in the response)."
              )
              .default([
                "DELETE",
                "GET",
                "HEAD",
                "OPTIONS",
                "PATCH",
                "POST",
                "PUT",
              ]),
            max_age: z
              .number()
              .int()
              .describe(
                "Indicates for how many seconds the results of a preflight request can be cached (to be set in access-control-max-age header in the response)."
              )
              .default(1800),
          })
          .strict()
          .describe("Section for CORS headers configuration.")
          .optional(),
        protocol_options: z
          .object({
            max_skip_body_length: z
              .number()
              .int()
              .describe("Cowboy limit to request body size")
              .default(1000000),
          })
          .strict()
          .optional(),
        external: z
          .object({
            listen_address: z
              .string()
              .describe(
                "Listen address for external interface. This should be publicly accessible"
              )
              .default("0.0.0.0"),
            port: z
              .number()
              .int()
              .describe("Listen port for external HTTP interface.")
              .default(3013),
            request_timeout: z
              .number()
              .int()
              .describe("HTTP Request timeout.")
              .default(30000),
            connect_timeout: z
              .number()
              .int()
              .describe("HTTP Request connect timeout.")
              .default(1000),
            acceptors: z
              .number()
              .int()
              .describe("Number of acceptors in external pool")
              .default(10),
            gas_limit: z
              .number()
              .int()
              .describe(
                "Maximum gas allowed to be available to a single dry-run call."
              )
              .default(6000000),
          })
          .strict()
          .optional(),
        internal: z
          .object({
            listen_address: z
              .string()
              .describe(
                "Listen address for internal interface. This should not be publicly accessible"
              )
              .default("127.0.0.1"),
            port: z
              .number()
              .int()
              .describe("Listen port for internal HTTP interface.")
              .default(3113),
            acceptors: z
              .number()
              .int()
              .describe("Number of acceptors in internal pool")
              .default(10),
            debug_endpoints: z
              .boolean()
              .describe(
                "Enable (true) debug api. Disabled (false) by default. Debug endpoints are defined by a tag in the Swagger API schema"
              )
              .default(false),
          })
          .strict()
          .optional(),
        rosetta: z
          .object({
            listen_address: z
              .string()
              .describe(
                "Listen address for rosetta interface. This can be publicly accessible, but defaults to private"
              )
              .default("127.0.0.1"),
            port: z
              .number()
              .int()
              .describe("Listen port for rosetta online HTTP interface.")
              .default(3213),
            acceptors: z
              .number()
              .int()
              .describe("Number of acceptors in rosetta pool")
              .default(10),
          })
          .strict()
          .optional(),
        rosetta_offline: z
          .object({
            listen_address: z
              .string()
              .describe(
                "Listen address for the offline rosetta interface. This can be publicly accessible, but defaults to private"
              )
              .default("127.0.0.1"),
            port: z
              .number()
              .int()
              .describe("Listen port for the rosetta offline HTTP interface.")
              .default(3413),
            acceptors: z
              .number()
              .int()
              .describe("Number of acceptors in rosetta offline HTTP pool")
              .default(10),
          })
          .strict()
          .optional(),
        endpoints: z
          .object({
            gossip: z.boolean().describe("Gossip protocol API").optional(),
            name_service: z
              .boolean()
              .describe("Name resolution API")
              .optional(),
            chain: z
              .boolean()
              .describe("Chain state inspection endpoints")
              .optional(),
            transactions: z
              .boolean()
              .describe("Transactions insection endpoints")
              .optional(),
            "node-operator": z
              .boolean()
              .describe("Node operator endpoints")
              .default(false),
            dev: z
              .boolean()
              .describe(
                "Development only API - for validation of client implementations. Should not be used in real life scenarios"
              )
              .optional(),
            debug: z
              .boolean()
              .describe(
                "Deprecated. See also 'http > internal > debug_endpoints'"
              )
              .optional(),
            obsolete: z
              .boolean()
              .describe("Old endpoints that will be removed")
              .optional(),
            "dry-run": z
              .boolean()
              .describe("External protected dry run endpoint")
              .optional(),
          })
          .strict()
          .optional(),
        debug: z
          .boolean()
          .describe(
            "Deprecated. See also 'http > internal > debug_endpoints' KILLME FIXME"
          )
          .default(false),
        cache: z
          .object({
            enabled: z
              .boolean()
              .describe("Enable HTTP cache headers (ETag and Expire)")
              .default(false),
            aged_blocks_time: z
              .number()
              .int()
              .describe(
                "Time (in seconds) after a block is considered aged. That is an Expire header is generated for such blocks API endpoints."
              )
              .default(86400),
            aged_blocks_cache_time: z
              .number()
              .int()
              .describe(
                "Time (in seconds) to cache aged blocks, the Expire header time relative to block creation time."
              )
              .default(86400),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    channels: z
      .object({
        max_count: z
          .number()
          .int()
          .describe(
            "Max number of active state channel clients allowed on node"
          )
          .default(1000),
        ad_hoc_listen_ports: z
          .boolean()
          .describe(
            "Whether to allow responders to listen on any ports other than preconfigured ones"
          )
          .default(true),
        listeners: z
          .array(
            z
              .object({
                port: z.number().int().describe("Listen port number"),
                acceptors: z
                  .number()
                  .int()
                  .describe(
                    "Number of concurrent acceptors on port (default: 1)"
                  )
                  .default(1),
              })
              .strict()
          )
          .describe("Pre-configured responder listen ports")
          .optional(),
      })
      .strict()
      .optional(),
    websocket: z
      .object({
        channel: z
          .object({
            listen_address: z
              .string()
              .describe("Listen address for channels websocket interface.")
              .default("127.0.0.1"),
            port: z
              .number()
              .int()
              .describe("Listen port for channels websocket interface.")
              .default(3014),
            acceptors: z
              .number()
              .int()
              .describe("Number of acceptors in pool")
              .default(10),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    keys: z
      .object({
        dir: z
          .string()
          .describe("Location (directory) of the public/private key pair(s)")
          .optional(),
        peer_password: z
          .string()
          .describe("Password used to encrypt the peer key-pair files")
          .optional(),
      })
      .strict()
      .optional(),
    chain: z
      .object({
        persist: z
          .boolean()
          .describe("If true, all changes to the chain are written to disk.")
          .default(true),
        db_backend: z
          .string()
          .regex(
            new RegExp(
              "^([a-z]+|([a-z0-9\\*]+:[a-z]+)|([a-z0-9\\*]+:[a-z]+(\\h*\\|\\h*[a-z0-9\\*]+:[a-z]+))+)$"
            )
          )
          .describe("Choice of database backend.")
          .default("unix:rocksdb|*:mnesia"),
        db_path: z
          .string()
          .describe("The directory where the chain is persisted to disk.")
          .default("data"),
        db_direct_access: z
          .boolean()
          .describe("Use Db backend API rather than the Mnesia API")
          .default(false),
        db_commit_bypass: z
          .boolean()
          .describe(
            "Use Rocksdb tricks to bypass Mnesia's default update logic at tx commit"
          )
          .default(true),
        db_write_max_retries: z
          .number()
          .int()
          .describe(
            "OBSOLETE/ignored: Maximum number of retries for failing database write operations."
          )
          .default(3),
        hard_forks: z
          .object({})
          .strict()
          .describe(
            "The consensus protocol versions with respective effective heights. Ignored if 'fork_management > network_id' has value 'ae_mainnet' or 'ae_uat'."
          )
          .optional(),
        consensus: z
          .record(z.any())
          .describe(
            "The consensus algorithms used for validating blocks. Ignored if 'fork_management > network_id' has value 'ae_mainnet' or 'ae_uat'."
          )
          .optional(),
        protocol_beneficiaries_enabled: z
          .boolean()
          .describe(
            "If true, the node will split rewards and send part to protocol_beneficiaries"
          )
          .default(true),
        protocol_beneficiaries: z
          .array(
            z
              .any()
              .describe(
                "Public keys belonging to protocol maintainers with reward shares (100 is 10%). If not set testnet or mainnet beneficiaries and shares will be used based on network_id configuration value. IMPORTANT: The value of this setting is under governance, thus it should not be changed without previous agreement within the configured network on doing so."
              )
          )
          .min(1)
          .default([
            "ak_2KAcA2Pp1nrR8Wkt3FtCkReGzAi8vJ9Snxa4PcmrthVx8AhPe8:109",
          ]),
        garbage_collection: z
          .object({
            enabled: z
              .boolean()
              .describe(
                "If true, node will perform garbage collection of state trees, removing unreachable merkle patricia nodes and free some disk space"
              )
              .default(false),
            during_sync: z
              .boolean()
              .describe(
                "If true, node will start garbage-collecting immediately, without waiting for sync to complete"
              )
              .default(false),
            minimum_height: z
              .number()
              .int()
              .gte(0)
              .describe("Minimum height at which to trigger garbage collection")
              .default(0),
            interval: z
              .number()
              .int()
              .gte(3)
              .describe(
                "DEPRECATED. How often (every `interval` block) should garbage collection run"
              )
              .default(50000),
            history: z
              .number()
              .int()
              .gte(50)
              .describe(
                "How many generations (at least) should pass between garbage collections"
              )
              .default(15000),
            trees: z
              .array(
                z
                  .enum([
                    "accounts",
                    "calls",
                    "channels",
                    "contracts",
                    "ns",
                    "oracles",
                  ])
                  .describe("Tree name")
              )
              .min(1)
              .describe("Which state trees to scan. Default: all of them")
              .default([
                "accounts",
                "calls",
                "channels",
                "contracts",
                "ns",
                "oracles",
              ]),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    mining: z
      .object({
        autostart: z
          .boolean()
          .describe("If true, the node will start mining automatically.")
          .default(false),
        attempt_timeout: z
          .number()
          .int()
          .describe(
            "Maximum time (milliseconds) for each attempt to mine a block with a specific nonce."
          )
          .default(3600000),
        beneficiary: z
          .string()
          .regex(new RegExp("^ak_[1-9A-HJ-NP-Za-km-z]*$"))
          .describe(
            "Public key of beneficiary account that will receive fees from mining on a node. Required when 'mining.autostart' is set to 'true'."
          )
          .optional(),
        expected_mine_rate: z
          .number()
          .int()
          .gte(1)
          .describe(
            "Expected mine rate (milliseconds) between blocks. Used in governance."
          )
          .default(180000),
        micro_block_cycle: z
          .number()
          .int()
          .gte(1)
          .describe(
            "Expected rate (milliseconds) between micro-blocks. Used in governance."
          )
          .default(3000),
        min_miner_gas_price: z
          .number()
          .int()
          .gte(1)
          .describe("Minimum gas price accepted by the miner")
          .default(1000000000),
        max_auth_fun_gas: z
          .number()
          .int()
          .gte(1)
          .describe("Maximum gas allowed for GAMetaTx authentication function")
          .default(50000),
        beneficiary_reward_delay: z
          .number()
          .int()
          .gte(2)
          .describe(
            "Delay (in key blocks / generations) for getting mining rewards. Used in governance."
          )
          .default(180),
        name_claim_bid_timeout: z
          .number()
          .int()
          .gte(0)
          .describe("Blocks to wait until auction closes. Used in governance.")
          .default(480),
        strictly_follow_top: z
          .boolean()
          .describe(
            "If true, removes the risk of a race condition with eventual forking in fast mining context"
          )
          .default(false),
        cuckoo: z
          .object({
            edge_bits: z
              .number()
              .int()
              .describe(
                "Number of bits used for representing an edge in the Cuckoo Cycle problem. It affects both PoW generation (mining) and verification. WARNING: Changing this makes the node incompatible with the chain of other nodes in the network, do not change from the default unless you know what you are doing."
              )
              .default(29),
            miners: z
              .array(
                z
                  .object({
                    executable: z
                      .string()
                      .describe(
                        'Executable binary of the miner. Options are: "mean29-generic" (memory-intensive), "mean29-avx2" (memory-intensive, benefits from faster CPU supporting AVX2 instructions), "lean29-generic" (CPU-intensive, useful if memory-constrained), "lean29-avx2" (CPU-intensive, useful if memory-constrained, benefits from faster CPU supporting AVX2 instructions).'
                      )
                      .default("mean29-generic"),
                    executable_group: z
                      .enum(["aecuckoo", "aecuckooprebuilt"])
                      .describe("Group of executable binaries of the miner.")
                      .default("aecuckoo"),
                    extra_args: z
                      .string()
                      .describe(
                        "Extra arguments to pass to the miner executable binary. The safest choice is specifying no arguments i.e. empty string."
                      )
                      .default(""),
                    hex_encoded_header: z
                      .boolean()
                      .describe(
                        "Hexadecimal encode the header argument that is send to the miner executable. CUDA executables expect hex encoded header."
                      )
                      .default(false),
                    nice: z
                      .number()
                      .int()
                      .describe(
                        "DEPRECATED: Miner process priority (niceness) in a UNIX fashion. Higher `nice` means lower priority. Keep it unset to inherit parent process priority."
                      )
                      .optional(),
                    repeats: z
                      .number()
                      .int()
                      .describe(
                        "Number of tries to do in each miner context - WARNING: it should be set so the miner process runs for 3-5s or else the node risk missing out on new micro blocks."
                      )
                      .default(1),
                    addressed_instances: z
                      .array(z.number().int())
                      .min(1)
                      .describe(
                        "Instances used by the miner in case of Multi-GPU mining. Numbers on the configuration list represent GPU devices that are to addressed by the miner."
                      )
                      .optional(),
                  })
                  .strict()
              )
              .describe(
                "Definitions of miners' configurations. If no miners are configured one miner is used as default, i.e. 'mean29-generic' executable without any extra args."
              )
              .optional(),
            miner: z
              .object({
                executable_group: z
                  .enum(["aecuckoo", "aecuckooprebuilt"])
                  .describe("Group of executable binaries of the miner.")
                  .default("aecuckoo"),
                executable: z
                  .string()
                  .describe(
                    'Executable binary of the miner. If the executable group is \'aecuckoo\', the options are: "mean29-generic" (memory-intensive), "mean29-avx2" (memory-intensive, benefits from faster CPU supporting AVX2 instructions), "lean29-generic" (CPU-intensive, useful if memory-constrained), "lean29-avx2" (CPU-intensive, useful if memory-constrained, benefits from faster CPU supporting AVX2 instructions). For the other executable groups, please refer to the user documentation.'
                  )
                  .default("mean29-generic"),
                extra_args: z
                  .string()
                  .describe(
                    "Extra arguments to pass to the miner executable binary. The safest choice is specifying no arguments i.e. empty string."
                  )
                  .default(""),
                edge_bits: z
                  .number()
                  .int()
                  .describe(
                    "Number of bits used for representing an edge in the Cuckoo Cycle problem. It affects both PoW generation (mining) and verification. WARNING: Changing this makes the node incompatible with the chain of other nodes in the network, do not change from the default unless you know what you are doing."
                  )
                  .default(29),
                hex_encoded_header: z
                  .boolean()
                  .describe(
                    "Hexadecimal encode the header argument that is send to the miner executable. CUDA executables expect hex encoded header."
                  )
                  .default(false),
                nice: z
                  .number()
                  .int()
                  .describe(
                    "DEPRECATED: Miner process priority (niceness) in a UNIX fashion. Higher `nice` means lower priority. Keep it unset to inherit parent process priority."
                  )
                  .optional(),
                repeats: z
                  .number()
                  .int()
                  .describe(
                    "Number of tries to do in each miner context - WARNING: it should be set so the miner process runs for 3-5s or else the node risk missing out on new micro blocks."
                  )
                  .default(1),
                instances: z
                  .number()
                  .int()
                  .describe(
                    "Number of miner instances in case of Multi-GPU mining."
                  )
                  .default(1),
              })
              .strict()
              .describe(
                "Deprecated way of configuring single miner. Please use 'mining > cuckoo > miners' and 'mining > cuckoo > edge_bits' instead. Note that this section CAN NOT be configured when either 'mining > cuckoo > miners' or 'mining > cuckoo > edge_bits' is set."
              )
              .optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    logging: z
      .object({
        hwm: z
          .number()
          .int()
          .gte(50)
          .describe("Controls the overload protection in the logs. Default=50.")
          .default(50),
        level: z
          .enum(["debug", "info", "warning", "error", "none"])
          .describe(
            "Sets the level of logging in the default, mining, cuckoo and sync logs."
          )
          .default("debug"),
      })
      .strict()
      .optional(),
    metrics: z
      .object({
        host: z
          .string()
          .describe("Hostname to use when reporting to the statsd daemon")
          .optional(),
        port: z
          .number()
          .int()
          .gte(0)
          .describe("Port number of the (typically) statsd daemon.")
          .optional(),
        reconnect_interval: z
          .number()
          .int()
          .gte(0)
          .describe("How often (in ms) to try reconnecting to the daemon")
          .optional(),
        rules: z
          .array(
            z
              .object({
                name: z
                  .string()
                  .regex(
                    new RegExp(
                      "^([a-zA-Z0-9\\-_]+|\\*{1,2})(\\.([a-zA-Z0-9\\-_]+|\\*{1,2}))*$"
                    )
                  )
                  .describe("Name pattern for metric (incl wildcards)")
                  .optional(),
                type: z
                  .string()
                  .regex(new RegExp("^(\\*|[a-zA-Z]*)$"))
                  .describe("type of metric")
                  .optional(),
                datapoints: z
                  .string()
                  .regex(new RegExp("^[a-zA-Z0-9]+(\\,[a-zA-Z0-9]+)*$"))
                  .describe(
                    "Specific datapoints: 'default', or names, comma-separated"
                  )
                  .optional(),
                actions: z
                  .string()
                  .regex(
                    new RegExp(
                      "^((none)|(((log)|(send))(\\,((log)|(send))){0,1}))$"
                    )
                  )
                  .describe("What to do with matching metrics.")
                  .optional(),
              })
              .strict()
          )
          .describe(
            "Filter rules guiding logging/sending of metrics. The provided search patterns are applied to existing metrics, and the related 'actions' control whether to 'log' the metric data to disk, 'send' it to the cloud, or neither. The default is to do both, i.e. 'log,send' for all 'ae.epoch.**' metrics."
          )
          .optional(),
      })
      .strict()
      .optional(),
    monitoring: z
      .object({
        active: z
          .boolean()
          .describe("If true, the monitoring will start.")
          .default(false),
        publisher: z
          .object({
            autostart: z
              .boolean()
              .describe(
                "If true, the monitoring will start posting transactions."
              )
              .default(false),
            amount: z
              .number()
              .int()
              .gte(0)
              .describe("Amount to set up in monitoring spend transaction.")
              .optional(),
            interval: z
              .number()
              .int()
              .gte(0)
              .describe("How often (in ms) to try post monitoring transaction.")
              .optional(),
            ttl: z
              .number()
              .int()
              .gte(0)
              .describe("Number of blocks before tx is garbage collected.")
              .optional(),
            pubkey: z
              .string()
              .regex(new RegExp("^ak_[1-9A-HJ-NP-Za-km-z]*$"))
              .describe("Public key of transaction publisher.")
              .optional(),
            privkey: z
              .string()
              .describe(
                "Private key of transaction publisher serialized as signature."
              )
              .optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    load_levels: z
      .object({
        mempool: z
          .object({
            size: z
              .string()
              .describe("Number of transactions in the mempool")
              .default("1000:1,2000:2,3000:3,4000:4"),
          })
          .strict()
          .optional(),
      })
      .strict()
      .describe(
        "Overload sampler configurations. These monitor potential pain points in the system for indications of overload."
      )
      .optional(),
    regulators: z
      .object({
        sync_ping: z
          .object({
            counter: z.number().int().default(3),
            rate: z.number().int().default(0),
            max_size: z.number().int().default(0),
            max_time: z.number().int().default(0),
          })
          .strict()
          .describe("sync node pinger worker pool.")
          .optional(),
        sync_tasks: z
          .object({
            counter: z.number().int().default(10),
            rate: z.number().int().default(0),
            max_size: z.number().int().default(0),
            max_time: z.number().int().default(0),
          })
          .strict()
          .optional(),
        sync_gossip: z
          .object({
            counter: z.number().int().default(5),
            rate: z.number().int().default(0),
            max_size: z.number().int().default(0),
            max_time: z.number().int().default(0),
          })
          .strict()
          .optional(),
        tx_pool_push: z
          .object({
            counter: z.number().int().default(5),
            rate: z.number().int().default(0),
            max_size: z.number().int().default(5000),
            max_time: z.number().int().default(0),
            rate_modifiers: z.string().default("mempool.size: 10"),
            counter_modifiers: z.string().default("mempool.size: 15"),
          })
          .strict()
          .describe("mempool updates.")
          .optional(),
        sc_ws_handlers: z
          .object({
            counter: z.number().int().default(10),
            rate: z.number().int().default(0),
            max_size: z.number().int().default(5),
            max_time: z.number().int().default(0),
          })
          .strict()
          .describe("State channel websocket handlers.")
          .optional(),
        http_update: z
          .object({
            counter: z.number().int().default(5),
            rate: z.number().int().default(0),
            max_size: z.number().int().default(50),
            max_time: z.number().int().default(0),
          })
          .strict()
          .describe("HTTP update requests.")
          .optional(),
        http_read: z
          .object({
            counter: z.number().int().default(5),
            rate: z.number().int().default(0),
            max_size: z.number().int().default(100),
            max_time: z.number().int().default(0),
          })
          .strict()
          .describe("HTTP read requests.")
          .optional(),
        gc_scan: z
          .object({
            counter: z.number().int().default(1),
            rate: z.number().int().default(50),
          })
          .strict()
          .describe("DB Garbage collection scan chunks")
          .optional(),
      })
      .strict()
      .describe(
        "Queues regulating the load in a node. Each queue may have a combination of 'rate', 'counter', 'max_size' and 'max_time' parameters. Set a parameter to 0 if you want it to have no effect."
      )
      .optional(),
    fork_management: z
      .object({
        network_id: z
          .string()
          .describe("Identification of the network in case of hard forks.")
          .default("ae_mainnet"),
        fork: z
          .object({
            enabled: z
              .boolean()
              .describe(
                "Indicates whether the node should follow the signalling result or stay with the current protocol."
              )
              .default(true),
            signalling_start_height: z
              .number()
              .int()
              .gte(0)
              .describe("Height at which signalling period starts.")
              .optional(),
            signalling_end_height: z
              .number()
              .int()
              .gte(0)
              .describe("Height at which signalling period ends.")
              .optional(),
            signalling_block_count: z
              .number()
              .int()
              .gte(1)
              .describe(
                "Count of the key blocks in signalling period necessary for the fork to take effect."
              )
              .optional(),
            info_field: z
              .number()
              .int()
              .gte(0)
              .lte(4294967295)
              .describe(
                "Pseudorandom number (part of key block) used by the miners indicating which fork they support."
              )
              .optional(),
            version: z
              .number()
              .int()
              .gte(0)
              .describe("Version of the chain in case of a successful fork.")
              .optional(),
          })
          .optional(),
      })
      .strict()
      .optional(),
    stratum: z
      .object({
        enabled: z.boolean().default(false),
        connection: z
          .object({
            host: z.string().default("localhost"),
            port: z
              .number()
              .int()
              .gte(0)
              .lte(65535)
              .describe("Port number of Stratum server.")
              .default(9999),
            max_connections: z.number().int().default(1024),
            num_acceptors: z.number().int().default(100),
            transport: z.enum(["tcp", "ssl"]).default("tcp"),
          })
          .strict()
          .optional(),
        session: z
          .object({
            extra_nonce_bytes: z.number().int().default(4),
            skip_num_blocks: z.number().int().default(10),
            initial_share_target: z
              .number()
              .int()
              .default(1.1579032239025142e77),
            max_share_target: z
              .number()
              .int()
              .gte(1)
              .lte(1.1579032239025142e77)
              .default(1.1579032239025142e77),
            desired_solve_time: z.number().int().gte(1).lte(180).default(30),
            max_solve_time: z.number().int().gte(1).lte(360).default(60),
            share_target_diff_threshold: z.number().default(5),
            edge_bits: z.number().default(29),
            max_jobs: z.number().int().default(20),
            max_workers: z.number().int().default(20),
            msg_timeout: z.number().int().default(15),
          })
          .strict()
          .optional(),
        reward: z
          .object({
            reward_last_rounds: z.number().int().default(2),
            beneficiaries: z
              .array(
                z
                  .any()
                  .describe(
                    "Public key receiving pool reward to percent share map."
                  )
              )
              .optional(),
            keys: z
              .object({
                dir: z
                  .string()
                  .describe(
                    "Directory of the public/private key pair used for signing of the payout contract call (either relative to aestratum priv directory or absolute). This account holds mining rewards which are scheduled for redistribution to miners. It is unexpected that this account should hold any substantial amount of tokens (in fiat value) - it would mean redistributions aren't working. The pool operator should ensure the node operates in trusted environment."
                  )
                  .optional(),
              })
              .strict()
              .optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
    dev_mode: z
      .object({
        keyblock_interval: z
          .number()
          .int()
          .describe(
            "Interval, in seconds, between keyblocks. If 0, keyblocks are only produced on-demand"
          )
          .default(0),
        microblock_interval: z
          .number()
          .int()
          .describe(
            "Interval, in seconds, between microblocks. If 0, microblocks are only produced on-demand"
          )
          .default(0),
        auto_emit_microblocks: z
          .boolean()
          .describe(
            "Emit microblocks as soon as transactions have been pushed to the mempool"
          )
          .default(false),
      })
      .strict()
      .describe("Settings for when dev mode consensus is activated")
      .optional(),
  })
  .strict();

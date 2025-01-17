The goal of this project is to ease the process of bootstrapping an Aeternity hyperchain.

<details>
  <summary>Table of Contents</summary>

- [Introduction](#introduction)
- [Structure](#structure)
- [Usage](#usage)
- [Example Configuration](#example-configuration)
- [Prerequisites/Assumptions](#prerequisitesassumptions)
- [Concepts and Terminology](#concepts-and-terminology)
- [Troubleshooting](#troubleshooting)
- [Project Scope](#project-scope)
- [Useful Links](#useful-links)

</details>

## Introduction
The Hyperchains Starter Kit simplifies the process of bootstrapping an Aeternity Hyperchain node for the 0.9 beta release. While Hyperchains are designed to be lightweight and resource-efficient, the setup process involves multiple components and careful configuration. This tool automates key setup tasks including economy generation, contract deployment, and node configuration.

Note: This tool is currently in beta development alongside Hyperchains 0.9. While functional, you may encounter warnings or minor issues as we continue improving stability and user experience.

## Structure
The toolkit provides automated workflows for:
1. Generating and configuring the Hyperchain economy (initial accounts, balances, and contracts)
2. Setting up node configuration files
3. Deploying and initializing required smart contracts
4. Managing validator and pinner account setup

Each component is configured through YAML files and automated scripts to minimize manual intervention while maintaining flexibility.

## Usage
### Quick Start
1. Clone and install the starter kit:

   ```shell
   git clone https://github.com/aeternity/hyperchain-starter-kit
   cd hyperchain-starter-kit
   npm install
   npm run dev
   ```

2. Initialize your Hyperchain configuration:

   ```shell
   npm run dev init your_chain_name
   ```

3. Set up contracts:

   ```shell
   npm run dev retrieve-contracts your_chain_name
   ```

4. Generate the economy:

   ```shell
   npm run dev gen-economy your_chain_name
   ```

5. Generate node configuration:

   ```shell
   npm run dev gen-node-conf your_chain_name
   ```

See the [Aeternity Node Documentation](https://github.com/aeternity/aeternity/tree/master/docs) for detailed setup instructions.

**Important Notes:**
- Back up all generated keys and configuration files
- Fund all pinner accounts on the parent chain before starting your node
- When using a public parent chain, the start height is set to current block + 10

## Example Configuration
The tool generates a default configuration in `init.yaml`:

```yaml
childBlockTime: 3000
childEpochLength: 600
enablePinning: true
networkId: 'hc_test'
parentChain:
  epochLength: 10
  networkId: 'ae_uat'
  nodeURL: 'https://testnet.aeternity.io'
  type: 'AE2AE'
pinningReward: 1000000000000000000000
validators:
  count: 3
  validatorMinStake: 1000000000000000000000000
```

This configuration can be customized based on your requirements. See the [Hyperchains documentation](https://github.com/aeternity/aeternity/tree/master/docs) for more detailed parameter explanations.

## Non-goals
### Project Scope
While this starter kit aims to simplify Hyperchain deployment, it is not:
- A comprehensive tutorial on blockchain concepts
- A complete guide to Aeternity node operation
- A production-ready deployment solution
- A replacement for understanding basic blockchain operations

For learning these concepts, we recommend:
- [Aeternity Documentation](https://github.com/aeternity/aeternity/tree/master/docs) for blockchain fundamentals
- [Hyperchains Whitepaper](https://github.com/aeternity/hyperchains-whitepaper) for deep technical understanding
- [Aeternity Forum](https://forum.aeternity.com/) for community learning resources

## Prerequisites/assumptions
- You have a somewhat solid understanding of how blockchains work and [æternity](https://github.com/aeternity/aeternity) in particular.
- A running Aeternity node (v6.7.0 or later)
- Experience managing blockchain nodes
- Access to sufficient funds for pinning operations
- Understanding of node validator operations
- Comfortable with command-line operations and YAML configuration
- [Node.js](https://nodejs.org/en/download) installed
- [Git](https://git-scm.com/downloads) installed

## Technical Requirements:
- Minimum 4GB RAM dedicated to Hyperchain operations
- 100GB available storage space
- Stable internet connection (minimum 10Mbps upload/download)

## Concepts and terminology
- **Hyperchain**: A blockchain that runs on [æternity](https://github.com/aeternity/aeternity) software. It is a separate blockchain with its own economy distinct from the main æternity blockchains. The tokens in this network are not AE tokens, and the operator can decide how to name them.
- **Hyperchain node**: The instance of the æternity software running the hyperchain with special configuration. While you can start with a single node, a production network should have multiple nodes for decentralization and resilience.
- **Parent chain** and **Parent chain node**: Can be the main æternity blockchain, Bitcoin, or Dogecoin. This is the network where our hyperchain posts commitments for security purposes, preventing retroactive history changes.
- **Child Chain**: Another term for Hyperchain, emphasizing its relationship with the parent chain.
- **Commitment**: A hash of the current top block that is posted to the parent chain as proof of the hyperchain's state.
- **Pinning**: The process of anchoring the hyperchain's state to the parent chain by posting cryptographic commitments. This creates an immutable record of the hyperchain's history and prevents long-range attacks.
- **Validator**: An account on our hyperchain authorized to sign blocks according to consensus rules. A node can operate multiple validators if it has their private keys.
- **Pinner**: A validator responsible for executing pinning operations to anchor the Hyperchain state to the parent chain.
- **Staker** or **Delegator**: An account that stakes tokens with a validator to increase their voting power. Validators typically share block rewards with their stakers.
- **Genesis block**: The first block of the blockchain, containing initial accounts and token balances.
- **Faucet**: An account and [faucet service](https://github.com/aeternity/aepp-faucet-nodejs) that distributes tokens to users, typically for free on testnets. Example: [æternity testnet faucet](https://faucet.aepps.com/).
- **[Staking UI](https://github.com/aeternity/aepp-hc-ui)**: A web application that allows users to stake their tokens with validators and manage their staking positions.
- **Wallet**: A web application for managing accounts, tokens, and transactions on the hyperchain network. Popular options include [Superhero](https://wallet.superhero.com/) and [Base æpp](https://base.aepps.com/).
- **Explorer**: A web application for viewing blockchain state and transactions. Example: [æScan](https://aescan.io/).
- **[Middleware](https://github.com/aeternity/ae_mdw)** or **MDW**: An indexing service that enables wallets to retrieve transaction history and serves as the backend for Explorers and some wallet features.

## Troubleshooting
**Common issues you might encounter**:

1. Node Not Starting
- Verify all configuration files are in correct locations
- Check node logs for specific errors
- Ensure parent chain connection is configured correctly

2. Pinning Issues
- Confirm pinner accounts are funded on parent chain
- Verify pinning configuration is enabled
- Check parent chain connection status

3. Validator Setup
- Ensure validator keys are properly configured
- Verify minimum stake requirements are met
- Check staking contract deployment status

For additional support, please [open an issue](https://github.com/aeternity/hyperchain-starter-kit/issues) or join the [Aeternity Forum](https://forum.aeternity.com/).

## Useful Links
- [current Hyperchains Documentation](https://github.com/aeternity/aeternity/blob/master/docs/hyperchains.md)
- [Hyperchains Whitepaper](https://github.com/aeternity/hyperchains-whitepaper)
- [Aeternity Node Documentation](https://github.com/aeternity/aeternity/tree/master/docs)
- [Hyperchains FAQ](https://forum.aeternity.com/t/hyperchains-faq/7629)
- [Hyperchains whitepaper](https://forum.aeternity.com/t/hyperchains-whitepaper-is-released/7812)
- [Hyperchains FAQ](https://forum.aeternity.com/t/hyperchains-faq/7629)

The goal of this project is to ease the process of bootstrapping an Aeternity hyperchain.

<details>
  <summary>Table of Contents</summary>

- [Introduction](#introduction)
- [Structure](#structure)
- [Non-goals](#non-goals)
- [Prerequisites/assumptions](#prerequisitesassumptions)
- [Concepts and terminology](#concepts-and-terminology)
- [Useful Links](#useful-links)

</details>

## Introduction
There are many moving parts to operating a whole blockchain network.
Hyperchains aim at being "lightweight" and "easy" to run. This is certainly true in the sense that
creating one will not require a lot of (computing) resources.
However, this is not necessarily the case when it comes to the amount of work and knowledge required to set up one.
This project aims at automating what is possible/easy to automate and documenting the rest of the process.

## Structure
The documentation (and the project) consists of two parts:
1. Generating and configuring the economy of the hyperchain. This means the initial accounts with their initial balances. 
If you do that, you will be able to run (manually) the hyperchain on your local machine or even on a server.

## Non-goals
- We do not aim to teach you all the concepts behind hyperchains, aeternity or blockhains in general. Please read the
relevant documentation if you want to learn more about those.

## Prerequisites/assumptions
- You have a somewhat solid understanding of how blockchains work and [æternity](https://github.com/aeternity/aeternity) in particular.
- You are comfortable with the command line, you are a semi-competent unix administrator.

## Concepts and terminology
- **Hyperchain**: A blockchain that is running on [æternity](https://github.com/aeternity/aeternity) software. It is a separate blockchain that has a different
economy than the main æternity blockchains. The tokens in this network are not AE tokens, and the operator can decide
how to call them. 
- **Hyperchain node**: Or just "node" for short. This is the instance of the [æternity](https://github.com/aeternity/aeternity) erlang software that is running
the hyperchain with special configuration. Initially we need to configure only one node to represent the whole blockchain network, but more realistically
you will want to have several. Ideally many nodes (even third-party) can join your network for decentralization 
and resilience.
- **Parent chain** and **Parent chain node**: Can be the main [æternity](https://github.com/aeternity/aeternity) blockchain, Bitcoin or Dogecoin.
This is the network where our hyperchain posts the so-called "commitments".
This is how we secure the hyperchain.
When we post commitments to the parent chain,
this is proof that we can not change the history of our hyperchain retroactively.
- **Commitment**: A commitment is a hash of the current top block, that is posted to the parent chain.
- **Validator**: An account on our hyperchain that is allowed to sign blocks according to the consensus rules.
This is a special account that is run by the node. Sometimes it's hard to distinguish between the node and
the validator as they are often used (in speech) interchangeably. A node can operate one or several validators if it
has their private keys. A node can also not run validators, and then it's a non-mining node.
- **Staker** or **Delegator**: An account on our hyperchain that stakes tokens with a validator to increase their
voting power (and thus their chance of being selected to sign a block). It is expected that the validator rewards its 
stakers by sharing the block rewards with them.
- **Genesis block**: The first block of the blockchain, containing the initial accounts and tokens (as their balances).
We will be configuring this in order to bootstrap our hyperchain, and this is the main focus of part 1 of this guide.
- **Faucet**: An account and [faucet service](https://github.com/aeternity/aepp-faucet-nodejs) that is used to distribute tokens to users. This is usually done for free and is
  popular on testnets. Example: [æternity testnet faucet](https://faucet.aepps.com/).
- **[Staking UI](https://github.com/aeternity/aepp-hc-ui)**: A web application that allows users to stake their tokens with validators.
- **Wallet**: A web application that allows users to manage their accounts and tokens, sign and send transactions to the
hyperchain network (the nodes). Popular choices are [Superhero](https://wallet.superhero.com/) and [Base æpp](https://base.aepps.com/).
- **Explorer**: A web application that allows users to view the blockchain state and transactions. Example: [æScan](https://aescan.io/)
- **[Middleware](https://github.com/aeternity/ae_mdw)** or MDW: An indexing service that allows the wallet to retrieve past transactions and also acts as
the backend to the Explorer and some wallets.

## Useful Links
- [Hyperchains whitepaper](https://forum.aeternity.com/t/hyperchains-whitepaper-is-released/7812)
- [Hyperchains FAQ](https://forum.aeternity.com/t/hyperchains-faq/7629)

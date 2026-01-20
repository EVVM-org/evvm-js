# EVVM JS

[![npm version](https://badge.fury.io/js/%40evvm%2Fevvm-js.svg)](https://www.npmjs.com/package/@evvm/evvm-js)
[![npm downloads](https://img.shields.io/npm/dm/@evvm/evvm-js.svg)](https://www.npmjs.com/package/@evvm/evvm-js)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: EVVM-NONCOMMERCIAL-1.0](https://img.shields.io/badge/Licence-EVVM--NONCOMMERCIAL--1.0-blue.svg)](https://evvm.org/licenses/EVVM-NONCOMMERCIAL-1.0)
[![GitHub Stars](https://img.shields.io/github/stars/EVVM-org/evvm-js)](https://github.com/EVVM-org/evvm-js)

EVVM JS is a powerful JavaScript/TypeScript library for seamless interaction with the EVVM. It simplifies common tasks such as payments, identity management, staking, and peer-to-peer swaps. Built with first-class TypeScript support, it offers a streamlined developer experience with robust type safety.

## Table of contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Installation

You can install EVVM JS using your favorite package manager:

```bash
bun add @evvm/evvm-js
# or
npm install @evvm/evvm-js
# or
yarn add @evvm/evvm-js
```

## Quick Start

Here's a quick example of how to use EVVM JS to sign a payment action:

**With Ethers.js**

```typescript
import { EVVM, execute } from "@evvm/evvm-js";
import { createSignerWithEthers } from "@evvm/evvm-js/signers";
import { ethers } from "ethers";

// 1. Create a signer
const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
const privateKey = "YOUR_PRIVATE_KEY";
const wallet = new ethers.Wallet(privateKey, provider);
const signer = await createSignerWithEthers(wallet);

// 2. Instantiate the EVVM service
const evvm = new EVVM(signer, "EVVM_CONTRACT_ADDRESS");

// 3. Call a method to create a signed action
const signedAction = await evvm.pay({
  to: "RECIPIENT_ADDRESS",
  tokenAddress: "TOKEN_ADDRESS",
  amount: 100n, // Use BigInt for amounts
  priorityFee: 0n,
  nonce: 1n,
  priorityFlag: false,
});

// 4. Execute the signed action
const result = await execute(signer, signedAction);
console.log(result);
```

**With Viem**

```typescript
import { EVVM } from "@evvm/evvm-js";
import { createSignerWithViem } from "@evvm/evvm-js/signers";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

// 1. Create a signer
const account = privateKeyToAccount("YOUR_PRIVATE_KEY");
const client = createWalletClient({
  account,
  chain: mainnet,
  transport: http("YOUR_RPC_URL"),
});
const signer = await createSignerWithViem(client);

// 2. Instantiate the EVVM service
const evvm = new EVVM(signer, "EVVM_CONTRACT_ADDRESS");

// Continue with steps 3 and 4 exactly as shown in the ethers.js example
```

## API Reference

### Services

- `EVVM`: Core EVVM service for creating signed actions (payments, identity, staking, swaps).
- `NameService`: Manage identities.
- `Staking`: Handle staking operations.
- `P2PSwap`: Perform peer-to-peer swaps.

Each service is instantiated with a signer and a contract address.

### Signers

EVVM JS provides helpers to create signers from `ethers.js` and `viem`:

- `createSignerWithEthers`: Creates a signer from an `ethers.js` wallet.
- `createSignerWithViem`: Creates a signer from a `viem` wallet client.

## Development

This project uses `bun` for package management and scripting.

### Setup

```bash
bun install
```

### Testing

```bash
bun test
```

### Building

```bash
bun run build
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on our [GitHub repository](https://github.com/EVVM-org/evvm-js).


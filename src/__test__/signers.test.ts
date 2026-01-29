import type { Signer } from "ethers";
import type { WalletClient } from "viem";
import { describe, test, expect, mock } from "bun:test";
import { createSignerWithEthers } from "@/signers/createSignerWithEthers";
import { createSignerWithViem } from "@/signers/createSignerWithViem";
import type { HexString } from "@/types";

mock.module("ethers", () => ({
  __esModule: true,
  Contract: class {
    // @ts-ignore
    constructor(address, abi, signer) {}

    static [Symbol.hasInstance](instance: any) {
      return instance.constructor.name === "Contract";
    }

    myFunction = mock(async () => ({
      wait: async () => {},
      hash: "0xTransactionHash",
    }));

    myReadOnlyFunction = mock(async () => "my-result");
  },
}));

mock.module("viem/actions", () => ({
  __esModule: true,
  readContract: mock(async () => "my-viem-result"),
}));

const mockEthersSigner = {
  getAddress: async () =>
    "0x1234567890123456789012345678901234567890" as HexString,
  provider: {
    getNetwork: async () => ({ chainId: 1 }),
  },
  signMessage: async (message: string) => `signed:${message}`,
} as unknown as Signer;

const mockViemWalletClient = {
  account: {
    address: "0x1234567890123456789012345678901234567890" as HexString,
  },
  getChainId: async () => 1,
  signMessage: async ({ message }: { message: string }) => `signed:${message}`,
  writeContract: async (payload: any) => "0xTransactionHash",
} as unknown as WalletClient;

describe("Signers", () => {
  describe("createSignerWithEthers", () => {
    test("should create a signer and expose address and chainId", async () => {
      const signer = await createSignerWithEthers(mockEthersSigner);
      expect(signer.address).toBe("0x1234567890123456789012345678901234567890");
      expect(await signer.getChainId()).toBe(1);
    });

    test("should sign a message", async () => {
      const signer = await createSignerWithEthers(mockEthersSigner);
      const signature = await signer.signMessage("hello world");
      expect(signature).toBe("signed:hello world");
    });

    test("should sign a generic evvm message", async () => {
      const signer = await createSignerWithEthers(mockEthersSigner);
      const signature = await signer.signGenericEvvmMessage(
        10n,
        "functionName",
        "args",
      );
      expect(signature).toBe("signed:10,functionName,args");
    });

    test("should call writeContract", async () => {
      const signer = await createSignerWithEthers(mockEthersSigner);
      const hash = await signer.writeContract({
        contractAddress: "0xContractAddress",
        contractAbi: [],
        functionName: "myFunction",
        args: [],
      });
      expect(hash).toBe("0xTransactionHash");
    });

    test("should call readContract", async () => {
      const signer = await createSignerWithEthers(mockEthersSigner);
      const res = await signer.readContract({
        contractAddress: "0xContractAddress",
        contractAbi: [],
        functionName: "myReadOnlyFunction",
        args: [],
      });
      expect(res).toBe("my-result");
    });
  });

  describe("createSignerWithViem", () => {
    test("should create a signer and expose address and chainId", async () => {
      const signer = await createSignerWithViem(mockViemWalletClient);
      expect(signer.address).toBe("0x1234567890123456789012345678901234567890");
      expect(await signer.getChainId()).toBe(1);
    });

    test("should sign a message", async () => {
      const signer = await createSignerWithViem(mockViemWalletClient);
      const signature = await signer.signMessage("hello world");
      expect(signature).toBe("signed:hello world");
    });

    test("should sign a generic evvm message", async () => {
      const signer = await createSignerWithViem(mockViemWalletClient);
      const signature = await signer.signGenericEvvmMessage(
        10n,
        "functionName",
        "args",
      );
      expect(signature).toBe("signed:10,functionName,args");
    });

    test("should call writeContract", async () => {
      const signer = await createSignerWithViem(mockViemWalletClient);
      const hash = await signer.writeContract({
        contractAddress: "0xContractAddress",
        contractAbi: [],
        functionName: "myFunction",
        args: [],
      });
      expect(hash).toBe("0xTransactionHash");
    });

    test("should call readContract", async () => {
      const signer = await createSignerWithViem(mockViemWalletClient);
      const res = await signer.readContract({
        contractAddress: "0xContractAddress",
        contractAbi: [],
        functionName: "myReadOnlyFunction",
        args: [],
      });
      expect(res).toBe("my-viem-result");
    });
  });
});

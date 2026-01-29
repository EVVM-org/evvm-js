import { describe, it, expect } from "bun:test";
import { execute } from "@/utils/execute";
import { SignedAction } from "@/services/lib/signed-action";
import type { HexString, ISigner, IAbi } from "@/types";
import { BaseService } from "@/services/lib/base-service";

let writeContractSpy: any;

//@ts-ignore
class FakeSigner implements ISigner {
  address = "0x2222222222222222222222222222222222222222" as HexString;
  _chainId = 1;

  getChainId(): Promise<number> {
    return Promise.resolve(this._chainId);
  }

  switchChain(chainId: number): Promise<void> {
    this._chainId = chainId;
    return Promise.resolve();
  }

  async signMessage(message: string): Promise<string> {
    return `signed(${message})`;
  }

  async signGenericEvvmMessage(
    evvmId: bigint,
    functionName: string,
    inputs: string,
  ): Promise<string> {
    return `signed(${evvmId},${functionName},${inputs})`;
  }

  async readContract(args: any): Promise<any> {
    return null;
  }

  writeContract = (writeContractSpy = (args: any): Promise<HexString> => {
    return Promise.resolve("0xdeadbeef" as HexString);
  });
}

const functionAbi = {
  inputs: [
    {
      internalType: "address",
      name: "to",
      type: "address",
    },
    {
      internalType: "uint256",
      name: "amount",
      type: "uint256",
    },
  ],
  name: "transfer",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

import type { IBaseServiceProps } from "@/types/services";

class MockService extends BaseService {
  constructor(props: IBaseServiceProps) {
    super(props);
  }
}

describe("execute", () => {
  it("should call signer.writeContract with correct parameters", async () => {
    const signer = new FakeSigner();
    const spy = await import("bun:test").then((mod) =>
      mod.spyOn(signer, "writeContract"),
    );

    const service = new MockService({
      signer,
      address: "0x1111111111111111111111111111111111111111",
      abi: [functionAbi] as any,
      chainId: 1,
    });

    const signedAction = new SignedAction(service, 1n, "transfer", {
      to: "0x2222222222222222222222222222222222222222",
      amount: 100n,
    });

    await execute(signer, signedAction, {});

    expect(spy).toHaveBeenCalledWith({
      contractAbi: [functionAbi],
      contractAddress: "0x1111111111111111111111111111111111111111",
      args: ["0x2222222222222222222222222222222222222222", "100"],
      functionName: "transfer",
    });
  });

  it("should work with serialized signed action", async () => {
    const signer = new FakeSigner();
    const spy = await import("bun:test").then((mod) =>
      mod.spyOn(signer, "writeContract"),
    );

    const service = new MockService({
      signer,
      address: "0x1111111111111111111111111111111111111111",
      abi: [functionAbi] as any,
      chainId: 1,
    });

    const signedAction = new SignedAction(service, 1n, "transfer", {
      to: "0x2222222222222222222222222222222222222222",
      amount: 100n,
    });

    const serializedAction = signedAction.toJSON();
    await execute(signer, serializedAction, {});

    expect(spy).toHaveBeenCalledWith({
      contractAbi: [functionAbi],
      contractAddress: "0x1111111111111111111111111111111111111111",
      args: ["0x2222222222222222222222222222222222222222", "100"],
      functionName: "transfer",
    });
  });

  it("should switch chain if signer is on a different chain", async () => {
    const signer = new FakeSigner();
    const spy = await import("bun:test").then((mod) =>
      mod.spyOn(signer, "switchChain"),
    );

    const service = new MockService({
      signer,
      address: "0x1111111111111111111111111111111111111111",
      abi: [functionAbi] as any,
      chainId: 2,
    });

    const signedAction = new SignedAction(service, 1n, "transfer", {
      to: "0x2222222222222222222222222222222222222222",
      amount: 100n,
    });

    await execute(signer, signedAction, {});

    expect(spy).toHaveBeenCalledWith(2);
    expect(signer._chainId).toBe(2);
  });
});


import { describe, it, expect } from "bun:test";
import type { HexString, ISigner } from "@/types";
import { EVVM } from "@/services";

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

  async signMessage(message: string) {
    return `signed(${message})`;
  }

  async readContract({
    abi,
    address,
    functionName,
  }: any): Promise<any> {
    if (functionName === "getEvvmID") return 777n;
    return null;
  }

  writeContract(args: any): Promise<HexString> {
    return Promise.resolve("0xdeadbeef" as HexString);
  }

  signGenericEvvmMessage(
    evvmId: bigint,
    functionName: string,
    inputs: string,
  ): Promise<string> {
    return Promise.resolve(`signed(${evvmId},${functionName},${inputs})`);
  }
}

describe("EVVM service", () => {
  it("pay builds SignedAction for address recipient", async () => {
    const signer = new FakeSigner();
    const evvm = new EVVM({
      signer: signer as any,
      address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      chainId: 1,
    });

    const sa = await evvm.pay({
      to: "0x1111111111111111111111111111111111111111",
      tokenAddress: "0x2222222222222222222222222222222222222222",
      amount: 100n,
      priorityFee: 0n,
      nonce: 1n,
      priorityFlag: false,
    });

    expect(sa.functionName).toBe("pay");
    expect(sa.data.from).toBe(signer.address);
    expect(sa.data.token).toBe("0x2222222222222222222222222222222222222222");
    expect(typeof sa.data.signature).toBe("string");
    expect(sa.data.to_address).toBe(
      "0x1111111111111111111111111111111111111111",
    );
    expect(sa.data.to_identity).toBeUndefined();
  });

  it("pay builds SignedAction for identity recipient", async () => {
    const signer = new FakeSigner();
    const evvm = new EVVM({
      signer: signer as any,
      address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      chainId: 1,
    });

    const sa = await evvm.pay({
      to: "alice",
      tokenAddress: "0x2222222222222222222222222222222222222222",
      amount: 50n,
      priorityFee: 1n,
      nonce: 2n,
      priorityFlag: true,
    });

    expect(sa.functionName).toBe("pay");
    expect(sa.data.to_identity).toBe("alice");
    expect(sa.data.to_address).toBeUndefined();
    expect(typeof sa.data.signature).toBe("string");
  });

  it("dispersePay builds SignedAction with hashed toData mapping", async () => {
    const signer = new FakeSigner();
    const evvm = new EVVM({
      signer: signer as any,
      address: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      chainId: 1,
    });

    const toData = [
      {
        amount: 1n,
        toAddress: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        toIdentity: undefined,
      },
      {
        amount: 2n,
        toAddress: undefined,
        toIdentity: "id2",
      },
    ];

    const sa = await evvm.dispersePay({
      toData: toData as any,
      tokenAddress: "0x2222222222222222222222222222222222222222",
      amount: 3n,
      priorityFee: 0n,
      nonce: 5n,
      priorityFlag: false,
      executor: "0x3333333333333333333333333333333333333333",
    });

    expect(sa.functionName).toBe("dispersePay");
    expect(Array.isArray(sa.data.toData)).toBe(true);
    expect(sa.data.toData.length).toBe(2);
    expect(sa.data.token).toBe("0x2222222222222222222222222222222222222222");
    expect(typeof sa.data.signature).toBe("string");
  });
});

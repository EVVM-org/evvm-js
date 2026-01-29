import { describe, it, expect, beforeEach } from "bun:test";
import { Staking } from "@/services";
import type { HexString, ISigner } from "@/types";

class FakeSigner implements ISigner {
  address = "0x3333333333333333333333333333333333333333" as HexString;
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

let signer: any;
let svc: Staking;

beforeEach(() => {
  signer = new FakeSigner();
  svc = new Staking({
    signer,
    address: "0xSTAKINGADDRESS000000000000000000000000",
    chainId: 1,
  });
});

describe("Staking service", () => {
  it("presaleStaking returns SignedAction", async () => {
    const r = await svc.presaleStaking({
      user: signer.address,
      isStaking: true,
      amountOfStaking: 100n,
      nonce: 1n,
    } as any);
    expect(r.functionName).toBe("presaleStaking");
    expect(r.data.user).toBe(signer.address);
  });

  it("publicStaking returns SignedAction", async () => {
    const r = await svc.publicStaking({
      user: signer.address,
      isStaking: true,
      amountOfStaking: 50n,
      nonce: 2n,
    } as any);
    expect(r.functionName).toBe("publicStaking");
    expect(r.data.amountOfStaking).toBe(50n);
  });

  it("goldenStaking includes evvm signature when provided", async () => {
    const evvmSignedAction = { data: { signature: "esig" } } as any;
    const r = await svc.goldenStaking({
      isStaking: true,
      amountOfStaking: 1n,
      evvmSignedAction,
    } as any);
    expect(r.functionName).toBe("goldenStaking");
    expect(typeof r.data.signature_EVVM).toBe("string");
  });
});

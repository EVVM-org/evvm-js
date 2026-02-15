import { describe, it, expect, beforeEach } from "bun:test";
import { Staking } from "@/services";
import { getFakeSigner } from "./fixtures/fakeSigner";

let signer: any;
let svc: Staking;

beforeEach(() => {
  signer = getFakeSigner();
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
    expect(typeof r.data.signaturePay).toBe("string");
  });
});

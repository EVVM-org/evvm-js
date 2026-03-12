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
      isStaking: true,
      nonce: 1n,
    } as any);
    expect(r.functionName).toBe("presaleStaking");
    expect(r.data.user).toBe(signer.address);
    expect(r.data.isStaking).toBe(true);
    expect(r.data.senderExecutor).toBe("0x0000000000000000000000000000000000000000");
    expect(r.data.originExecutor).toBe("0x0000000000000000000000000000000000000000");
    expect(r.data.nonce).toBe(1n);
    expect(typeof r.data.signature).toBe("string");
  });

  it("publicStaking returns SignedAction", async () => {
    const r = await svc.publicStaking({
      isStaking: true,
      amountOfStaking: 50n,
      nonce: 2n,
    } as any);
    expect(r.functionName).toBe("publicStaking");
    expect(r.data.user).toBe(signer.address);
    expect(r.data.amountOfStaking).toBe(50n);
    expect(r.data.isStaking).toBe(true);
    expect(r.data.senderExecutor).toBe("0x0000000000000000000000000000000000000000");
    expect(r.data.originExecutor).toBe("0x0000000000000000000000000000000000000000");
    expect(typeof r.data.signature).toBe("string");
  });

  it("goldenStaking includes evvm signature when provided", async () => {
    const evvmSignedAction = { data: { signature: "esig" } } as any;
    const r = await svc.goldenStaking({
      isStaking: true,
      amountOfStaking: 1n,
      evvmSignedAction,
    } as any);
    expect(r.functionName).toBe("goldenStaking");
    expect(r.data.isStaking).toBe(true);
    expect(r.data.amountOfStaking).toBe(1n);
    expect(r.data.signaturePay).toBe("esig");
  });

  it("goldenStaking works without evvmSignedAction", async () => {
    const r = await svc.goldenStaking({
      isStaking: false,
      amountOfStaking: 10n,
    } as any);
    expect(r.functionName).toBe("goldenStaking");
    expect(r.data.isStaking).toBe(false);
    expect(r.data.amountOfStaking).toBe(10n);
    expect(r.data.signaturePay).toBeUndefined();
  });
});

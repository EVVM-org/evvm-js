import { describe, it, expect, beforeEach } from "bun:test";
import { P2PSwap } from "../services";
import { getFakeSigner } from "./fixtures/fakeSigner";

let signer: any;
let svc: P2PSwap;

beforeEach(() => {
  signer = getFakeSigner();
  svc = new P2PSwap({
    signer,
    address: "0xP2PSWAPADDRESS000000000000000000000000",
    chainId: 1,
  });
});

describe("P2PSwap service", () => {
  it("makeOrder returns SignedAction with expected data", async () => {
    const evvmSignedAction = {
      data: {
        priorityFee: 0n,
        nonce: 1n,
        priorityFlag: false,
        signature: "esig",
      },
    } as any;
    const r = await svc.makeOrder({
      nonce: 1n,
      tokenA: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      tokenB: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      amountA: 100n,
      amountB: 90n,
      evvmSignedAction,
    } as any);

    expect(r.functionName).toBe("makeOrder");
    expect(r.data.user).toBe(signer.address);
    expect(r.data.nonce).toBe(1n);
    expect(typeof r.data.signaturePay).toBe("string");
  });

  it("cancelOrder returns SignedAction with expected fields", async () => {
    const r = await svc.cancelOrder({
      nonce: 2n,
      tokenA: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      tokenB: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      orderId: 1n,
    } as any);
    expect(r.functionName).toBe("cancelOrder");
    expect(r.data.user).toBe(signer.address);
  });

  it("dispatchOrder includes metadata and evvm signature", async () => {
    const evvmSignedAction = {
      data: {
        priorityFee: 0n,
        nonce: 2n,
        priorityFlag: true,
        signature: "esig2",
      },
    } as any;
    const r = await svc.dispatchOrder({
      nonce: 3n,
      tokenA: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      tokenB: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      orderId: 1n,
      amountOut: 50n,
      amountInMax: 55n,
      evvmSignedAction,
    } as any);

    expect(r.functionName).toBe("dispatchOrder");
    expect(r.data.user).toBe(signer.address);
    expect(r.data.amountOut).toBe(50n);
    expect(r.data.amountInMax).toBe(55n);
    expect(typeof r.data.signaturePay).toBe("string");
  });
});

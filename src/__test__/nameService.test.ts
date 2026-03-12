import { NameService } from "@/services";
import { describe, it, expect, beforeEach } from "bun:test";
import { getFakeSigner } from "./fixtures/fakeSigner";

let signer: any;
let svc: NameService;

beforeEach(() => {
  signer = getFakeSigner();
  svc = new NameService({
    signer,
    address: "0xNAMESERVICEADDRESS0000000000000000000",
    chainId: 1,
  });
});

describe("NameService service", () => {
  it("makeOffer builds SignedAction correctly", async () => {
    const r = await svc.makeOffer({
      username: "alice",
      expirationDate: 1710000000n,
      amount: 100n,
      nonce: 1n,
    } as any);

    expect(r.functionName).toBe("makeOffer");
    expect(r.data.user).toBe(signer.address);
    expect(r.data.username).toBe("alice");
    expect(r.data.amount).toBe(100n);
    expect(r.data.expirationDate).toBe(1710000000n);
    expect(r.data.senderExecutor).toBe("0x0000000000000000000000000000000000000000");
    expect(r.data.originExecutor).toBe("0x0000000000000000000000000000000000000000");
    expect(r.data.nonce).toBe(1n);
    expect(typeof r.data.signature).toBe("string");
  });

  it("makeOffer with evvmSignedAction includes payment data", async () => {
    const evvmSignedAction = {
      data: {
        priorityFee: 1n,
        nonce: 10n,
        signature: "paysig",
      },
    } as any;
    const r = await svc.makeOffer({
      username: "alice",
      expirationDate: 1710000000n,
      amount: 100n,
      nonce: 1n,
      evvmSignedAction,
    } as any);

    expect(r.data.priorityFeePay).toBe(1n);
    expect(r.data.noncePay).toBe(10n);
    expect(r.data.signaturePay).toBe("paysig");
  });

  it("withdrawOffer builds SignedAction", async () => {
    const r = await svc.withdrawOffer({
      username: "alice",
      offerID: 1n,
      nonce: 2n,
    } as any);
    expect(r.functionName).toBe("withdrawOffer");
    expect(r.data.user).toBe(signer.address);
    expect(r.data.username).toBe("alice");
    expect(r.data.offerID).toBe(1n);
  });

  it("registrationUsername & preRegistrationUsername produce SignedAction", async () => {
    const pre = await svc.preRegistrationUsername({
      hashPreRegisteredUsername:
        "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
      nonce: 3n,
    } as any);
    expect(pre.functionName).toBe("preRegistrationUsername");
    expect(pre.data.hashPreRegisteredUsername).toBe("0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef");

    const r = await svc.registrationUsername({
      username: "alice",
      lockNumber: 1n,
      nonce: 4n,
    } as any);
    expect(r.functionName).toBe("registrationUsername");
    expect(r.data.username).toBe("alice");
    expect(r.data.lockNumber).toBe(1n);
  });

  it("custom metadata operations return SignedAction", async () => {
    const add = await svc.addCustomMetadata({
      identity: "bob",
      value: "x",
      nonce: 5n,
    } as any);
    expect(add.functionName).toBe("addCustomMetadata");
    expect(add.data.identity).toBe("bob");
    expect(add.data.value).toBe("x");

    const remove = await svc.removeCustomMetadata({
      identity: "bob",
      key: 0n,
      nonce: 6n,
    } as any);
    expect(remove.functionName).toBe("removeCustomMetadata");
    expect(remove.data.identity).toBe("bob");
    expect(remove.data.key).toBe(0n);

    const flush = await svc.flushCustomMetadata({
      identity: "bob",
      nonce: 7n,
    } as any);
    expect(flush.functionName).toBe("flushCustomMetadata");
    expect(flush.data.identity).toBe("bob");
  });

  it("flushUsername builds SignedAction", async () => {
    const r = await svc.flushUsername({
      username: "alice",
      nonce: 8n,
    } as any);
    expect(r.functionName).toBe("flushUsername");
    expect(r.data.user).toBe(signer.address);
    expect(r.data.username).toBe("alice");
    expect(r.data.nonce).toBe(8n);
  });

  it("renewUsername builds SignedAction", async () => {
    const r = await svc.renewUsername({
      username: "alice",
      nonce: 9n,
    } as any);
    expect(r.functionName).toBe("renewUsername");
    expect(r.data.user).toBe(signer.address);
    expect(r.data.username).toBe("alice");
    expect(r.data.nonce).toBe(9n);
  });
});

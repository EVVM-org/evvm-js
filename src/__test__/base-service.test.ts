import { describe, expect, mock, test } from "bun:test";
import { encodeAbiParameters, keccak256 } from "viem";
import type { IAbi } from "../types";
import { BaseService } from "../services/lib/base-service";

class TestService extends BaseService {
  async viewPublic<T = any>(functionName: string, args?: any[]): Promise<T> {
    return this.view<T>(functionName, args);
  }
}

const baseAbi: IAbi = [
  {
    type: "function",
    name: "myFunction",
    inputs: [
      { name: "a", type: "uint256" },
      { name: "b", type: "address" },
    ],
    outputs: [],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "dispatchOrderWithSig",
    inputs: [{ name: "orderId", type: "uint256" }],
    outputs: [],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getEvvmID",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getNextCurrentSyncNonce",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getIfUsedAsyncNonce",
    inputs: [
      { name: "user", type: "address" },
      { name: "nonce", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
];

const makeSigner = (chainId: number) => ({
  address: "0x1234567890123456789012345678901234567890",
  getChainId: mock(async () => chainId),
  switchChain: mock(async (_next: number) => {}),
  signMessage: mock(async (_message: string) => "signature"),
  signGenericEvvmMessage: mock(async () => "signature"),
  writeContract: mock(async () => "0xhash"),
  readContract: mock(async (_params: any) => "result"),
});

describe("BaseService", () => {
  test("view switches chain when mismatch", async () => {
    const signer = makeSigner(1);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 2,
    });

    await service.viewPublic("myFunction");

    expect(signer.switchChain).toHaveBeenCalledWith(2);
    expect(signer.readContract).toHaveBeenCalledWith({
      functionName: "myFunction",
      contractAddress: "0xabc0000000000000000000000000000000000000",
      contractAbi: baseAbi,
      args: [],
    });
  });

  test("view does not switch chain when match", async () => {
    const signer = makeSigner(2);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 2,
    });

    await service.viewPublic("myFunction", [1n]);

    expect(signer.switchChain).not.toHaveBeenCalled();
    expect(signer.readContract).toHaveBeenCalledWith({
      functionName: "myFunction",
      contractAddress: "0xabc0000000000000000000000000000000000000",
      contractAbi: baseAbi,
      args: [1n],
    });
  });

  test("getFunctionAbi throws when missing", () => {
    const signer = makeSigner(1);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 1,
    });

    expect(() => service.getFunctionAbi("nope")).toThrow(
      "No function signature with name nope",
    );
  });

  test("buildHashPayload orders and hashes args", () => {
    const signer = makeSigner(1);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 1,
    });

    const args = {
      b: "0x1111111111111111111111111111111111111111",
      a: 10n,
    };

    const inputsAbi = [
      { type: "string" },
      { name: "a", type: "uint256" },
      { name: "b", type: "address" },
    ];
    const values = ["myFunction", args.a, args.b];
    const expected = keccak256(encodeAbiParameters(inputsAbi, values));

    expect(service.buildHashPayload("myFunction", args)).toBe(expected);
  });

  test("buildHashPayload supports custom abi params", () => {
    const signer = makeSigner(1);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 1,
    });

    const args = {
      a: 1n,
      custom: 2n,
      b: "0x1111111111111111111111111111111111111111",
    };

    const inputsAbi = [
      { type: "string" },
      { name: "a", type: "uint256" },
      { name: "custom", type: "uint256" },
      { name: "b", type: "address" },
    ];
    const values = ["myFunction", args.a, args.custom, args.b];
    const expected = keccak256(encodeAbiParameters(inputsAbi, values));

    expect(
      service.buildHashPayload("myFunction", args, {
        customAbiParams: [
          { name: "custom", type: "uint256", insertAfter: "a" },
        ],
      }),
    ).toBe(expected);
  });

  test("buildHashPayload uses dispatchOrder for hash payload", () => {
    const signer = makeSigner(1);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 1,
    });

    const args = { orderId: 42n };

    const inputsAbi = [
      { type: "string" },
      { name: "orderId", type: "uint256" },
    ];
    const values = ["dispatchOrder", args.orderId];
    const expected = keccak256(encodeAbiParameters(inputsAbi, values));

    expect(service.buildHashPayload("dispatchOrderWithSig", args)).toBe(
      expected,
    );
  });

  test("buildHashPayload warns when insertAfter not found", () => {
    const signer = makeSigner(1);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 1,
    });

    const warn = console.warn;
    const warnMock = mock((_message: string) => {});
    console.warn = warnMock;

    service.buildHashPayload(
      "myFunction",
      { a: 1n, b: "0x1111111111111111111111111111111111111111" },
      {
        customAbiParams: [
          { name: "custom", type: "uint256", insertAfter: "missing" },
        ],
      },
    );

    expect(warnMock).toHaveBeenCalled();
    console.warn = warn;
  });

  test("buildMessageToSign formats payload", () => {
    const signer = makeSigner(1);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 1,
    });

    expect(service.buildMessageToSign(5n, "0xdeadbeef", "0x0000000000000000000000000000000000000000", 9n, true)).toBe(
      "5,0xabc0000000000000000000000000000000000000,0xdeadbeef,0x0000000000000000000000000000000000000000,9,true",
    );
  });

  test("getEvvmID returns cached evvmId", async () => {
    const signer = makeSigner(1);
    const service = new TestService({
      signer,
      address: "0xabc0000000000000000000000000000000000000",
      abi: baseAbi,
      chainId: 1,
      evvmId: 7n,
    });

    await expect(service.getEvvmID()).resolves.toBe(7n);
    expect(signer.readContract).not.toHaveBeenCalled();
  });

});

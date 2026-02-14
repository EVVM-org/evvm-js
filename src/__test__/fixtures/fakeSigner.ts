import type { HexString, ISigner } from "../../types";

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

  async readContract({ functionName }: any): Promise<any> {
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

const getFakeSigner = () => new FakeSigner();

export { getFakeSigner };

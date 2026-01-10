import { readContract } from "viem/actions";
import type { WalletClient } from "viem";
import type { IAbi, IAbiFunction, IAbiParameter, ISigner } from "@/types";

export const createSignerWithViem = async (
  walletClient: WalletClient,
): Promise<ISigner> => {
  const address = walletClient.account?.address;
  if (!address) throw new Error("No address connected");

  const chainId = await walletClient.getChainId();

  return {
    address,
    chainId,
    async signMessage(message) {
      return walletClient.signMessage({
        account: address,
        message,
      });
    },
    async writeContract({ contractAbi, contractAddress, args, functionName }) {
      return walletClient.writeContract({
        abi: contractAbi,
        address: contractAddress,
        chain: walletClient.chain,
        account: address,
        functionName,
        args: formatArgs(args, contractAbi, functionName),
      });
    },
    async readContract({ contractAbi, contractAddress, args, functionName }) {
      const res = await readContract(walletClient, {
        abi: contractAbi,
        address: contractAddress,
        functionName,
        args: formatArgs(args, contractAbi, functionName),
      });
      return res as any;
    },
  };
};

function formatArgs(args: any[], abi: IAbi, functionName: string): any[] {
  if (args.length === 0) return args;

  const functionAbi = abi.find(
    (item) => item.type === "function" && item.name === functionName,
  ) as IAbiFunction | undefined;

  if (!functionAbi) {
    throw new Error(
      `No function with name ${functionName} found in contract ABI`,
    );
  }

  return args.map((arg, index) => {
    const input = functionAbi.inputs[index];
    if (!input) return arg;
    return castRecursive(arg, input);
  });
}

function castRecursive(value: any, input: IAbiParameter): any {
  if (value === null || value === undefined) return value;
  const { type, components } = input;

  // 1. Handle Arrays (e.g., uint256[] or tuple[])
  if (Array.isArray(value) && type.endsWith("[]")) {
    const baseType = type.slice(0, -2);
    return value.map((v) => castRecursive(v, { ...input, type: baseType }));
  }

  // 2. Handle Tuples / Structs
  if (components && components.length > 0) {
    // Case A: Positional Tuple (Array)
    if (Array.isArray(value)) {
      return value.map((v, i) => castRecursive(v, components[i]));
    }
    // Case B: Named Tuple (Object)
    if (typeof value === "object") {
      const formattedStruct: Record<string, any> = {};
      for (const comp of components) {
        formattedStruct[comp.name] = castRecursive(value[comp.name], comp);
      }
      return formattedStruct;
    }
  }

  // 3. Handle Numeric Casting
  const isNumericType = type.startsWith("uint") || type.startsWith("int");
  if (isNumericType && typeof value === "string") {
    // Regex allows standard integers and 0x hex strings
    if (/^-?\d+$/.test(value) || /^0x[0-9a-fA-F]+$/.test(value)) {
      try {
        return BigInt(value);
      } catch {
        return value;
      }
    }
  }

  return value;
}

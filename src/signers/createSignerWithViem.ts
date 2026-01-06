import type { WalletClient } from "viem";
import type { ISigner } from "@/types/signer.type";
import { readContract } from "viem/actions";

/**
 * Creates an evvm signer using viem's WalletClient
 * @param walletclient A viem walletClient object, fully instantiated
 * @returns a signer
 */
export const createSignerWithViem = async (
  walletClient: WalletClient,
): Promise<ISigner> => {
  const address = walletClient.account?.address;

  if (!address) throw new Error("No address connected");

  return {
    address,
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
        args: [...args],
      });
    },
    async readContract({ contractAbi, contractAddress, args, functionName }) {
      const res = await readContract(walletClient, {
        abi: contractAbi,
        address: contractAddress,
        account: address,
        functionName,
        args: [...args],
      });

      return res as any;
    },
  };
};

import type { WalletClient } from "viem";
import type { ISigner } from "@/types/signer.type";

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
    async sendTransaction({
      contractAbi,
      contractAddress,
      args,
      functionName,
    }) {
      return walletClient.writeContract({
        abi: contractAbi,
        address: contractAddress,
        chain: walletClient.chain,
        account: address,
        functionName,
        args: [...args],
      });
    },
  };
};

import { Contract, type Signer } from "ethers";
import type { HexString, ISigner } from "@/types";
import { JsonRpcProvider } from "ethers";

/**
 * Creates an evvm signer using ethersjs v6
 * @param signer An ethersjs Signer object
 * @returns a signer
 */
export const createSignerWithEthers = async (
  signer: Signer,
): Promise<ISigner> => {
  const address = (await signer.getAddress()) as HexString;

  return {
    address,
    async getChainId() {
      const network = await signer.provider?.getNetwork();
      if (!network) throw new Error("No network returned from provider");
      return Number(network.chainId);
    },
    async switchChain(chainId) {
      const provider = signer.provider;
      if (!provider) throw new Error("No provider");

      if (!signer.provider || !(signer.provider instanceof JsonRpcProvider)) {
        throw new Error("Provider does not support RPC send commands");
      }

      const hexChainId = `0x${chainId.toString(16)}`;

      try {
        return await signer.provider.send("wallet_switchEthereumChain", [
          { chainId: hexChainId },
        ]);
      } catch (error: any) {
        // chain has not been added to the wallet
        if (error.code === 4902) {
          console.error(
            `The network ${chainId} is not available in your wallet. Use wallet_addEthereumChain.`,
          );
        }
        throw error;
      }
    },
    async signMessage(message) {
      return signer.signMessage(message);
    },
    async signGenericEvvmMessage(evvmId, functionName, inputs) {
      return signer.signMessage(`${evvmId},${functionName},${inputs}`);
    },
    async writeContract({
      contractAbi,
      contractAddress,
      args,
      functionName,
      gas,
    }) {
      const contract = new Contract(contractAddress, contractAbi, signer);

      if (!contract[functionName]) {
        throw new Error(
          `Trying to call a function not present in contract ABI\n functionName: ${functionName}`,
        );
      }

      const txOverrides = gas ? { gasLimit: gas } : {};

      const tx = await contract[functionName](...args, txOverrides);
      await tx.wait();

      return tx.hash;
    },
    async readContract({ contractAddress, contractAbi, args, functionName }) {
      const contract = new Contract(contractAddress, contractAbi, signer);

      if (!contract[functionName]) {
        throw new Error(
          `Trying to call a function not present in contract ABI\n functionName: ${functionName}`,
        );
      }

      return await contract[functionName](...args);
    },
  };
};

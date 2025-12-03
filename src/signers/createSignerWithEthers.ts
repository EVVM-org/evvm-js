import { Contract, type Signer } from "ethers";
import type { ISigner } from "@/types/signer.type";
import type { HexString } from "@/types/hexstring.type";

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
    async signMessage(message) {
      return signer.signMessage(message);
    },
    async sendTransaction({
      contractAbi,
      contractAddress,
      args,
      functionName,
    }) {
      const contract = new Contract(contractAddress, contractAbi, signer);

      if (!contract[functionName]) {
        throw new Error(
          `Trying to call a function not present in contract ABI\n functionName: ${functionName}`,
        );
      }

      const tx = await contract[functionName](...args);
      await tx.wait();

      return tx.hash;
    },
  };
};

// EVVM Smart Contract ABIs
import type { IAbi } from "@/types";
import EstimatorABIFile from "./Estimator.json";
import CoreABIFile from "./Core.json";
import NameServiceABIFile from "./NameService.json";
import P2PSwapABIFile from "./P2PSwap.json";
import StakingABIFile from "./Staking.json";

// Extract ABIs from JSON files
const EstimatorABI = EstimatorABIFile.abi as IAbi;
const CoreABI = CoreABIFile.abi as IAbi;
const NameServiceABI = NameServiceABIFile.abi as IAbi;
const P2PSwapABI = P2PSwapABIFile.abi as IAbi;
const StakingABI = StakingABIFile.abi as IAbi;

// Export the ABIs
export { EstimatorABI, CoreABI, NameServiceABI, P2PSwapABI, StakingABI };

// Default export with all ABIs
export default {
  Estimator: EstimatorABI,
  Core: CoreABI,
  NameService: NameServiceABI,
  P2PSwap: P2PSwapABI,
  Staking: StakingABI,
};

// Individual ABI exports for convenience
export const EVVM_ABIS = {
  ESTIMATOR: EstimatorABI,
  Core: CoreABI,
  NAME_SERVICE: NameServiceABI,
  P2P_SWAP: P2PSwapABI,
  STAKING: StakingABI,
} as const;

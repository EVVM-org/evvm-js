export type IAbiStateMutability = "pure" | "view" | "nonpayable" | "payable";

export interface IAbiParameter {
  name: string;
  type: string;
  internalType?: string;
  components?: IAbiParameter[];
  indexed?: boolean;
}

export interface IAbiFunction {
  type: "function";
  name: string;
  inputs: IAbiParameter[];
  outputs: IAbiParameter[];
  stateMutability: IAbiStateMutability;
}

export interface IAbiEvent {
  type: "event";
  name: string;
  inputs: IAbiParameter[];
  anonymous?: boolean;
}

export interface IAbiError {
  type: "error";
  name: string;
  inputs: IAbiParameter[];
}

export interface IAbiConstructor {
  type: "constructor";
  inputs: IAbiParameter[];
  stateMutability: IAbiStateMutability;
}

export type IAbiItem = IAbiFunction | IAbiEvent | IAbiError | IAbiConstructor;

export type IAbi = IAbiItem[];

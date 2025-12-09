import type { HexString } from "./hexstring.type";

export interface ISignedAction {
  signature: HexString;
  args: any[];
}

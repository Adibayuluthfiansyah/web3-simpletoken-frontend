import simpleTokenABI from "../abi/SimpleToken.json";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
export const CONTRACT_ABI = simpleTokenABI.abi;
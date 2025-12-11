import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constant";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const [balance, setBalance] = useState("0");
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("0");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed");
        return;
      }
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const userAddress = accounts[0];
      setAccount(userAddress);

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      const networkName =
        chainId === "0x7a69"
          ? "Localhost 8545"
          : `Unknown Network (${chainId})`;

      setNetwork(networkName);
      await loadTokenData(userAddress);
      setIsConnected(true);
      toast.success("Wallet connected");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center ">
      <h1 className="text-4xl font-bold">SimpleToken ERC20</h1>
    </div>
  );
}

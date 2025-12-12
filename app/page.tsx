"use client";

import { ethers, type Eip1193Provider } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./constant";
import { useState } from "react";
import { toast } from "sonner";
import { Wallet, Copy, Coins, Box, Activity, ArrowRight } from "lucide-react";
import { TransferAction } from "@/components/ui/transfer/TransferAction";

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
      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const loadTokenData = async (userAddress: string) => {
    try {
      const provider = new ethers.BrowserProvider(
        window.ethereum as Eip1193Provider
      );
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      const [name, symbol, supply, decimal, userbalance] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.totalSupply(),
        contract.decimals(),
        contract.balanceOf(userAddress),
      ]);
      setTokenName(name);
      setTokenSymbol(symbol);
      setTotalSupply(ethers.formatUnits(supply, Number(decimal)));
      setBalance(ethers.formatUnits(userbalance, Number(decimal)));
    } catch (err) {
      console.error("Error loading token data:", err);
      toast.error("Failed to load token data");
    }
  };

  const formatAddress = (addr: string) => {
    return addr
      ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
      : "";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden selection:bg-primary/20">
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size:14px_24px"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Header Section */}
        <header className="mb-16 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/50 border border-border text-xs font-mono text-muted-foreground mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              ERC-20 Protocol
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Simple<span className="text-primary">Token</span>
            </h1>
            <p className="mt-2 text-muted-foreground text-lg max-w-md">
              Manage and view your custom blockchain assets
            </p>
          </div>

          {/* Connect Button  */}
          {!isConnected && (
            <button
              onClick={connectWallet}
              className="group relative inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
              <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </button>
          )}
        </header>

        {/* Dashboard Content */}
        {isConnected ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Wallet Card */}
            <div className="md:col-span-5 space-y-6">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    My Wallet
                  </h3>
                  <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-xs font-medium border border-green-500/20 flex items-center gap-1.5">
                    <Activity className="w-3 h-3" />
                    {network}
                  </span>
                </div>

                <div className="mb-6">
                  <p className="text-4xl font-bold text-foreground tracking-tight">
                    {parseFloat(balance).toLocaleString()}
                    <span className="text-xl ml-2 text-muted-foreground font-normal">
                      {tokenSymbol}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Available Balance
                  </p>
                </div>

                <div className="p-3 bg-muted/50 rounded-xl border border-border/50 group hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-gray-600 flex items-center justify-center text-white font-bold text-xs">
                        {account.substring(2, 4).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          Account
                        </span>
                        <span className="font-mono text-sm text-foreground">
                          {formatAddress(account)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account)}
                      className="p-2 rounded-lg hover:bg-background text-muted-foreground hover:text-primary transition-colors"
                      title="Copy Address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Stats*/}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Token Name */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                  <Box className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Token Name
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {tokenName}
                </p>
              </div>

              {/* Symbol */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                  <Coins className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Symbol
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {tokenSymbol}
                </p>
              </div>

              {/* Total Supply  */}
              <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute right-0 top-0 p-3 opacity-5">
                  <Coins className="w-32 h-32 transform rotate-12" />
                </div>
                <div className="relative z-10">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Supply
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2 tracking-tight">
                    {parseFloat(totalSupply).toLocaleString()}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {formatAddress(CONTRACT_ADDRESS)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(CONTRACT_ADDRESS)}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      Copy Contract
                    </button>
                  </div>
                </div>
              </div>
              {/* Transfers Component Here*/}
              <div className="sm:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
                <TransferAction
                  balance={balance}
                  tokenSymbol={tokenSymbol}
                  onTransferSuccess={loadTokenData.bind(null, account)}
                />
              </div>
            </div>
          </div>
        ) : (
          /* wallet not connected */
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Wallet Not Connected
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Please connect your MetaMask wallet to view your token balance and
              statistics.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

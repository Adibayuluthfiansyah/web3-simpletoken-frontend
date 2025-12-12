"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constant";
import { toast } from "sonner";
import { parse } from "path";
import { Eip1193Provider } from "ethers";
import { ArrowRight } from "lucide-react";

interface TransactionError extends Error {
  code?: number | string;
  reason?: string;
  shortMessage?: string;
  info?: {
    error?: {
      message?: string;
    };
  };
}

export function TransferAction({
  balance,
  tokenSymbol,
  onTransferSuccess,
}: {
  balance: string;
  tokenSymbol: string;
  onTransferSuccess: () => void;
}) {
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState<boolean>(false);

  const handleTransfer = async () => {
    // === VALIDATION ===
    if (!recipient.trim()) {
      toast.error("Please enter a recipient address.");
      return;
    }
    if (!recipient.startsWith("0x") || recipient.length !== 42) {
      toast.error("Please enter a valid address.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (parseFloat(amount) > parseFloat(balance)) {
      toast.error("Insufficient balance.");
      return;
    }
    try {
      setIsTransferring(true);

      const provider = new ethers.BrowserProvider(
        window.ethereum as Eip1193Provider
      );
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const decimals = await contract.decimals();
      const amountInWei = ethers.parseUnits(amount, decimals);
      const tx = await contract.transfer(recipient, amountInWei);
      toast.info("Transaction submitted. Waiting for confirmation...");
      const receipt = await tx.wait();
      toast.success("Transfer successful!");
      setRecipient("");
      setAmount("");
      onTransferSuccess();
    } catch (err: unknown) {
      console.error("Transfer failed:", err);
      const error = err as TransactionError;
      if (error.code === "ACTION_REJECTED") {
        toast.error("Transaction rejected by the user.");
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds to complete the transaction.");
      } else {
        const errorMessage =
          error.reason ||
          error.shortMessage ||
          error.info?.error?.message ||
          "An unknown error occurred.";
        toast.error(errorMessage);
      }
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center space-x-4">
        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
          <ArrowRight className="inline-block mr-2 size-5 " />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Transfer Tokens
        </h3>
      </div>
      <p>Send {tokenSymbol} to another address</p>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Recipient Address
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x...."
          disabled={isTransferring}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Amount
        </label>
        <button
          className="text-xs text-primary hover:underline disabled:opacity-50"
          onClick={() => setAmount(balance)}
          disabled={isTransferring}
        >
          Max:{parseFloat(balance).toLocaleString()} {tokenSymbol}
        </button>
      </div>
      <div className="relative">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          disabled={isTransferring}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
          {tokenSymbol}
        </span>
      </div>
      <button
        onClick={handleTransfer}
        disabled={isTransferring || !recipient || !amount}
        className="w-full mt-4 px-4 py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isTransferring ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin">
              Processing ...
            </div>
          </>
        ) : (
          <>
            <ArrowRight className="inline-block mr-2 size-5 " />
            Transfer
          </>
        )}
      </button>
    </div>
  );
}

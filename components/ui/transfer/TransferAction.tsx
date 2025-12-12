"use client";

import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/app/constant";
import { toast } from "sonner";
import { parse } from "path";
import { Eip1193Provider } from "ethers";

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
    <div className="flex flex-col gap-4">
      <h1>test</h1>
    </div>
  );
}

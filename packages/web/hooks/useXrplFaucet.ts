// hooks/useXrplFaucet.ts
import { useState } from "react";
import { Client } from "xrpl";

interface FaucetResponse {
  account: {
    xAddress: string;
    classicAddress: string;
    secret: string;
  };
  amount: number;
  balance: number;
}

interface UseFaucetResult {
  requestFunds: (address: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  lastTransaction: FaucetResponse | null;
}

export const useXrplFaucet = (): UseFaucetResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTransaction, setLastTransaction] = useState<FaucetResponse | null>(
    null
  );

  const requestFunds = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      // Create client
      const client = new Client("wss://s.altnet.rippletest.net:51233");
      await client.connect();

      // Request funds from faucet
      const response = await fetch(
        "https://faucet.altnet.rippletest.net/accounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            destination: address,
            xrpAmount: "1000", // Request 1000 test XRP
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to request funds from faucet");
      }

      const data: FaucetResponse = await response.json();
      setLastTransaction(data);

      // Wait for transaction to be processed
      await client.request({
        command: "subscribe",
        accounts: [address],
      });

      // Disconnect client
      await client.disconnect();
    } catch (err: any) {
      setError(err.message || "Failed to request funds");
    } finally {
      setLoading(false);
    }
  };

  return {
    requestFunds,
    loading,
    error,
    lastTransaction,
  };
};

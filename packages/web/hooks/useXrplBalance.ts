import { useState, useEffect } from "react";
import { Client } from "xrpl";

interface BalanceData {
  xrp: string;
  loading: boolean;
  error: string | null;
}

// Define supported networks
type NetworkType = "mainnet" | "testnet" | "devnet";

const NETWORK_URLS = {
  mainnet: "wss://xrplcluster.com",
  testnet: "wss://s.altnet.rippletest.net:51233",
  devnet: "wss://s.devnet.rippletest.net:51233",
};

export const useXrplBalance = (
  address: string,
  network: NetworkType = "mainnet"
) => {
  const [balanceData, setBalanceData] = useState<BalanceData>({
    xrp: "0",
    loading: true,
    error: null,
  });
  const [client, setClient] = useState<Client | null>(null);

  // Initialize client
  useEffect(() => {
    const initClient = async () => {
      try {
        const newClient = new Client(NETWORK_URLS[network]);
        await newClient.connect();
        setClient(newClient);
      } catch (error) {
        setBalanceData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to connect to XRPL",
        }));
      }
    };

    initClient();

    // Cleanup
    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [network]);

  // Fetch balance
  const fetchBalance = async () => {
    if (!client || !address) return;

    try {
      setBalanceData((prev) => ({ ...prev, loading: true, error: null }));

      const response = await client.request({
        command: "account_info",
        account: address,
        ledger_index: "validated",
      });

      // Convert drops to XRP (1 XRP = 1,000,000 drops)
      const xrpBalance = (
        parseInt(response.result.account_data.Balance) / 1_000_000
      ).toFixed(6);

      setBalanceData({
        xrp: xrpBalance,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setBalanceData({
        xrp: "0",
        loading: false,
        error: error.message || "Failed to fetch balance",
      });
    }
  };

  // Fetch initial balance and set up subscription
  useEffect(() => {
    if (!client || !address) return;

    fetchBalance();

    // Subscribe to account
    const subscribeToAccount = async () => {
      try {
        await client.request({
          command: "subscribe",
          accounts: [address],
        });

        // Listen for updates
        client.on("transaction", (tx: any) => {
          console.log(tx);
          if (
            tx.transaction.Account === address ||
            tx.transaction.Destination === address
          ) {
            fetchBalance();
          }
        });
      } catch (error) {
        console.error("Subscription error:", error);
      }
    };

    subscribeToAccount();

    // Cleanup subscription
    return () => {
      if (client) {
        client
          .request({
            command: "unsubscribe",
            accounts: [address],
          })
          .catch(console.error);
      }
    };
  }, [client, address]);

  // Handle refresh
  const refreshBalance = () => {
    fetchBalance();
  };

  return {
    ...balanceData,
    refreshBalance,
  };
};

// Format balance with currency symbol
export const formatXrpBalance = (
  balance: string,
  decimals: number = 2
): string => {
  const num = parseFloat(balance);
  return `${Number(num.toFixed(decimals)).toLocaleString()} XRP`;
};

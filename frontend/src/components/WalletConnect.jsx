import { useState } from "react";

export default function WalletConnect({ setAccount }) {
  const [localAccount, setLocalAccount] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setLocalAccount(accounts[0]);
      setAccount(accounts[0]);
    } catch (error) {
      console.error(error);
      alert("Wallet connection failed");
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={connectWallet}>Connect Wallet</button>

      {localAccount && <p>Connected Wallet: {localAccount}</p>}
    </div>
  );
}
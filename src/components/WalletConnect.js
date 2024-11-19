import React from "react";

function WalletConnect({ onConnect }) {
  const connectWallet = async () => {
    if (!window.solana) {
      alert("Phantom Wallet not installed!");
      return;
    }
    try {
      await window.solana.connect();
      onConnect();
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert('Wallet connection Failed! Please Retry')
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Connect Phantom Wallet
    </button>
  );
}

export default WalletConnect;

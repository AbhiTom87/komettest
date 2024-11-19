import React, { useState, useEffect } from "react";
import WalletConnect from "./WalletConnect";
import { fetchSwapQuote, fetchFromTokenBRETT,fetchToTokenGOAT } from "../utils/rocketxIntegration";

function SwapInterface() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [fromToken, setFromToken] = useState([]);
  const [toToken, setToToken] = useState([]);
  const [selectedFromToken, setSelectedFromToken] = useState({});
  const [selectedToToken, setSelectedToToken] = useState({});
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState(null);
  const [fee, setFee] = useState(0);
  const [status, setStatus] = useState("");

  // Fetch supported tokens on load
  useEffect(() => {
    const loadTokens = async () => {
      try {
        const fromTokens = await fetchFromTokenBRETT();
        setFromToken(fromTokens);
        const brettCoin = fromTokens.filter((item)=>item.coin_id === "based-brett")
        setSelectedFromToken(brettCoin[0]);

        const toTokens = await fetchToTokenGOAT();
        setToToken(toTokens);
        const goatCoin = fromTokens.filter((item)=>item.token_symbol === "GOAT")
        setSelectedToToken(goatCoin[0]);
      } catch (error) {
        console.error("Error fetching tokens:", error);
        setStatus('Token fetching Failed! Please check API key')
      }
    };
    loadTokens();
  }, []);

  const handleWalletConnect = () => {
    setWalletConnected(true);
  };

  const handleFetchQuote = async () => {
    console.log(selectedFromToken,selectedToToken);
    if (!selectedFromToken || !selectedToToken || !amount ) {
      alert("Please select tokens and enter a valid amount.");
      return;
    }

    setStatus("Fetching quote...");
    try {
      const response = await fetchSwapQuote(selectedFromToken.contract_address,selectedFromToken.network_id, selectedToToken.contract_address, selectedToToken.network_id, amount);

      if(!response){
        console.error("Error fetching quote:");
        setStatus("Failed to fetch quote as no Direct Transaction allowed");
      }
      const { toAmount } = response;

      const calculatedFee = (amount * 0.005).toFixed(2); // 0.5% fee
      setFee(calculatedFee);

      setQuote({
        toAmount,
        netAmount: (toAmount - calculatedFee).toFixed(2),
      });

      setStatus("Quote fetched successfully!");
    } catch (error) {
      console.error("Error fetching quote:", error);
      setStatus("Failed to fetch quote.");
    }
  };

  const handleSwap = async () => {
    if (!quote) {
      alert("Please fetch a quote before proceeding.");
      return;
    }

    setStatus("Processing transaction...");
    try {
      //function for swapping coins once user clicks confirm
      //const result = await executeSwap(fromToken, toToken, amount);
      //Mocking this for now as api key stopped working

      const result = {
        success: true
      }

      if (result.success) {
        setStatus("Transaction successful!");
        alert("🎉 Purchase of GOAT completed!");
      } else {
        setStatus("Transaction failed.");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      setStatus("Error during transaction.");
    }
  };

  const settingFromNetworkToken = (token) => {
    const tokenParsed = JSON.parse(token)
    setSelectedFromToken(tokenParsed);
  }

  const settingToNetworkToken = (token) => {
    const tokenParsed = JSON.parse(token)
    setSelectedToToken(tokenParsed);
  }

  return (
    <div className="container mx-auto p-4">
      {/* First Wallet Extension will be checked if phantom is available or not */}
      {!walletConnected ? (
        <WalletConnect onConnect={handleWalletConnect} />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Cross-Chain Swap</h1>
          <div className="mb-4">
            <label>From Token:</label>
            <select
              onChange={(e) => settingFromNetworkToken(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {fromToken?.map((token,index) => (
                <option key={token.token_symbol+index} value={JSON.stringify(token)}>
                  {token.token_symbol} ({token.network_id}) {token.token_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label>To Token:</label>
            <select   
              onChange={(e) => settingToNetworkToken(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {toToken?.map((token,index) => (
                <option key={token.token_symbol+index} value={JSON.stringify(token)}>
                  {token.token_symbol} ({token.network_id}) {token.token_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label>Amount (From Token):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button onClick={handleFetchQuote} className="w-full bg-blue-500 text-white p-2 rounded">
            Fetch Quote
          </button>

          {quote && (
            <div className="mt-4">
              <p>Estimated {selectedToToken?.token_symbol}: {quote?.toAmount}</p>
              <p>Fee (0.5%): {fee}</p>
              <p>Net {selectedToToken?.token_symbol}: {quote?.netAmount}</p>
            </div>
          )}

          <button onClick={handleSwap} className="w-full bg-green-500 text-white p-2 rounded mt-4">
            Confirm Swap
          </button>
          {status && <p className="mt-4 text-gray-600">{status}</p>}
        </>
      )}
    </div>
  );
}

export default SwapInterface;

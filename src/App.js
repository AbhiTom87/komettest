import React from "react";
import SwapInterface from "./components/SwapInterface";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-6">Cross-Chain Token Swap</h1>
      <SwapInterface />
    </div>
  );
}

export default App;

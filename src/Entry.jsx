import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiConfig, createClient } from "wagmi";
import { getDefaultProvider, providers, ethers } from "ethers";
import App from "./App";
const Entry = (props) => {
  const url = ""; //RPC URL
  const provider = new ethers.providers.JsonRpcProvider(url);
  const client = createClient({
    autoConnect: true,
    provider: provider,
  });
  return (
    <WagmiConfig client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/invite/:referral" element={<App />} />
        </Routes>
      </BrowserRouter>
    </WagmiConfig>
  );
};

export default Entry;

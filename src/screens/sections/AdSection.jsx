import React, { useState, useEffect } from "react";
import { providers, ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import bsc from "../../contracts/bsc.json";
import tokenAbi from "../../contracts/tokenAbi.json";
import { useAccount } from "wagmi";
const AdSection = () => {
  const { address, isConnected } = useAccount();
  const [farming_bal, setFarming] = useState(0);
  const [balance, setBalance] = useState(0);
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getFarming();
    // getTokenBalance();
  }, [address, isConnected]);
  const getFarming = async () => {
    try {
      const res = await contract.getUserTotalDeposits(address);
      const farmingBal = await ethers.utils.formatUnits(res);
      setFarming(farmingBal);
    } catch (error) {
      console.log(error);
    }
  };
  //if tokens are issued to the user as airdrops calculate the balance
  const getTokenBalance = async () => {
    const token = "0x...."; //token address
    const contract1 = new ethers.Contract(token, tokenAbi, signer);
    try {
      const res = await contract1.balanceOf(address);
      const balance = await ethers.utils.formatUnits(res);
      setBalance(balance);
    } catch (error) {
      console.log(error);
    }
  };
  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }
  //if airdrops are to be claimed
  const claimAirdrop = async () => {
    setLoading(true);
    const bal = farming_bal - balance;
    console.log(bal);
    if (bal > 0) {
      //PRICEED
      const bal1 = bal;
      const x = bal1;
      const endBal = x;
      const tokenbal = Number(endBal * 10 ** 18).toFixed(0);
      const privateKey = ""; //creator address private key
      const providerWSS = "wss://...."; //wss rpc
      const provider = new ethers.providers.WebSocketProvider(providerWSS);
      const wallet = new ethers.Wallet(privateKey, provider);
      const account = wallet.connect(provider);
      console.log(account);
      const token = ""; //token address
      const contract = new ethers.Contract(token, tokenAbi, account);
      const res = await contract.transfer(address, tokenbal);
      toast.info("Please wait as we confirm the transaction", {
        theme: "dark",
      });
      await timeout(30000);
      toast.success("You have revceived your  Airdrop", {
        theme: "dark",
      });
      await setLoading(false);
      await getFarming();
      await getTokenBalance();
    } else {
      toast.error("You don't have any more airdrop to claim", {
        theme: "dark",
      });
    }
  };
  return (
    <div className="md:pl-40 md:pr-40 md:pt-0 md:pb-10">
      <ToastContainer />
      <h1
        className="text-center md:text-4xl text-2xl text-bold p-10"
        style={{ textTransform: "uppercase", padding: 10 }}
      >
        <span className="text-[#ffc800]">ABOUT DEXXAI</span>
      </h1>
      <p className="text-center">
        DexxAI uses AI-powered trading bots to execute trades on behalf of
        users, leveraging algorithms to capitalize on market opportunities and
        execute trades with high precision and speed. Artificial intelligence
        (AI) plays a significant role in the rapidly evolving field of
        decentralized finance (DeFi). DeFi refers to a blockchain-based
        financial system that aims to provide open, permissionless, and
        trustless financial services, such as trading, and yield farming,
        without relying on traditional intermediaries like banks.
      </p>
      <br />
    </div>
  );
};

export default AdSection;

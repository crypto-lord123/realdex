import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import bsc from "../../contracts/bsc.json";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
const FarmingStats = (props) => {
  const [bnbBalance, setbnbBalance] = useState(props.bnbBalance);
  const { address, isConnected } = useAccount();
  const [yield_bal, setYield] = useState(0.000000001);
  const [farming_bal, setFarming] = useState(0);
  const [daily, setDaily] = useState(0);
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
  useEffect(() => {
    getYield();
    getFarming();
    getUnilevelBonus();
    const intervalId = setInterval(() => {
      //run every 10 seconds
      getYield();
      getFarming();
      getUnilevelBonus();
    }, 10000);
    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [address, yield_bal, isConnected]);
  const getYield = async () => {
    try {
      const res = await contract.getUserAvailable(address.toString());
      const yieldBal = await ethers.utils.formatUnits(res);
      setYield(yieldBal);
    } catch (error) {
      toast.success(bsc.abi);
      console.log(error);
    }
  };
  const getFarming = async () => {
    try {
      const res = await contract.getUserTotalDeposits(address.toString());
      const farmingBal = await ethers.utils.formatUnits(res);
      setFarming(farmingBal);
    } catch (error) {
      console.log(error);
    }
  };

  const getUnilevelBonus = async () => {
    const res = await contract.dailyUnilevel(address);
    const unilevel = await ethers.utils.formatUnits(res);
    setDaily(unilevel);
  };
  return (
    <>
      <div style={{ width: "100%" }}>
        <div
          className="stats shadow  bg-base-300 md:p-4"
          style={{ width: "100%" }}
        >
          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar">
                <div className="md:w-8 w-6">
                  <img src="/business.png" />
                </div>
              </div>
            </div>
            <div className="stat-title text-sm">My funds</div>
            <div className="stat-desc text-info">
              {Number(farming_bal).toFixed(2)} BNB
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="avatar online">
                <div className="md:w-8 w-6">
                  <img src="/icon.png" />
                </div>
              </div>
            </div>
            <div className="stat-title  text-sm">Daily Profit</div>
            <div className="stat-desc text-accent">
              {Number(yield_bal).toFixed(7) - Number(daily).toFixed(7)} BNB
            </div>
          </div>
        </div>
        <div
          className="stats shadow  bg-base-300 md:p-4"
          style={{ width: "100%" }}
        >
          <div className="stat bg-info">
            <div className="stat-figure text-primary">
              <div className="avatar">
                <div className="md:w-8 w-6">
                  <img src="/stock.png" />
                </div>
              </div>
            </div>
            <div className="stat-title text-md">Realtime Unilevel Bonus</div>
            <div className=" text-black">{Number(daily).toFixed(8)} BNB</div>
          </div>
        </div>
        <div
          className="stats  stats-horizontal"
          style={{ width: "100%", marginTop: 10 }}
        >
          <div className="stat">
            <div className="stat-title"> BNB Balance</div>
            <div className="stat-value text-xl">
              {Number(bnbBalance).toFixed(4)}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Expected Return</div>
            <div className="stat-value text-xl">1.5% Daily</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmingStats;

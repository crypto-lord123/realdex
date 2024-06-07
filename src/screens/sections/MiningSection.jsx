import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import FarmingStats from "./FarmingStats";
import HarvestedBnb from "./HarvestedBnb";
import StartFarming from "./StartFarming";
const MiningSection = (props) => {
  const [bnbBalance, setbnbBalance] = useState(0);
  const { isConnected } = useAccount();

  return (
    <div className="md:pl-40 md:pr-40">
      <div
        class="grid md:grid-cols-2 grid-cols-1 gap-2 bg-base-300 md:p-4 p-2"
        style={{ borderRadius: 10 }}
      >
        <div className="card w-full bg-base-00 shadow-xl p-1">
          <div className="card-body md:p-4 p-1">
            <h2
              style={{ textAlign: "center", fontWeight: "900", fontSize: 25 }}
            >
              START AI AUTO TRADING WITH DEXXAI
            </h2>
            <p className="text-center">
              You can invest a minimum of 0.05 BNB with DexxAi auto trading bot
            </p>
            <FarmingStats
              setbnbBalance={setbnbBalance}
              bnbBalance={bnbBalance}
            />
            <StartFarming
              bnbBalance={bnbBalance}
              isConnected={isConnected}
              setbnbBalance={setbnbBalance}
            />
          </div>
        </div>
        <div id="howto" className="card w-full bg-base-300 shadow-xl">
          <div className="card-body md:p-4 p-1">
            <HarvestedBnb />
            <h2 className="card-title">HOW TO TRADE WITH DEXX AI</h2>
            <ul className="steps steps-vertical">
              <li
                className="step step-primary"
                style={{ textAlign: "left", fontSize: 13 }}
              >
                Connect wallet to BSC Network
              </li>
              <li
                className="step step-primary"
                style={{ textAlign: "left", fontSize: 13 }}
              >
                Choose the amount to start AI Auto Trading
              </li>
              <li
                className="step step-primary"
                style={{ textAlign: "left", fontSize: 13 }}
              >
                Earn 1.5% daily Auto Trading reward
              </li>
              <li
                className="step step-primary"
                style={{ textAlign: "left", fontSize: 13 }}
              >
                You can withdraw your BnB reward anytime
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiningSection;

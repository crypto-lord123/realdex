import React, { useState, useEffect } from "react";
import { providers, ethers } from "ethers";
import { toast } from "react-toastify";
import bsc from "../../contracts/bsc.json";
import Web3 from "web3";
import tokenAbi from "../../contracts/tokenAbi.json";
import { useBalance, useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import axios from "axios";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const StartFarming = (props) => {
  const bnbBalance = props.bnbBalance;
  const [started, setStarted] = useState(false);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [usdprice, setUsdPrice] = useState(0);
  const [isApproved, setApproved] = useState(true);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
  const [Bnbs, setBnbs] = useState(0);
  const approveBnb = async () => {
    setLoading(true);
    const amount = Bnbs * 10 ** 18;
    const token_address = "0x5aF4Ba19087c69FF2029f59342dE1602c3A2Fda1";
    const new_contract = new ethers.Contract(token_address, tokenAbi, signer);
    try {
      const res = await new_contract.approve(bsc.address, `${amount}`);
      setStarted(true);
      setCalled(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    getBnBPrice();
  }, []);

  const getBnBPrice = () => {
    axios
      .get(`https://api.coinbase.com/v2/exchange-rates?currency=BNB`)
      .then((res) => {
        const price = res.data.data.rates["USD"];
        setUsdPrice(price);
      });
  };
  useEffect(() => {
    if (started == true) {
      setTimeout(() => {
        setApproved(true);
        setLoading(false);
      }, 3000);
    }
  }, [called]);
  const investBnb = async () => {
    setLoading(true);

    const referrer = localStorage.getItem("referral");
    if (referrer == null) {
      toast.error("Please enter a referral address", {
        theme: "dark",
      });
      setLoading(false);
      return;
    } else if (referrer.length < 42) {
      toast.error("Please enter a valid referral address", {
        theme: "dark",
      });
      setLoading(false);
      return;
    } else if (referrer.toLocaleLowerCase() == address.toLocaleLowerCase()) {
      toast.error("You cannot refer yourself. Enter a valid referral link", {
        theme: "dark",
      });
      setLoading(false);
      return;
    } else {
      const amount = Number(Bnbs).toFixed(5) * 10 ** 18;
      console.log(amount);
      const amt = Number(Bnbs) * Number(usdprice);
      const usd_amt = `${amt.toFixed(0)}000000000000000000`;
      console.log(usd_amt);
      const val = 5 * 10 ** 18;
      try {
        const res = await contract.finance(
          referrer,
          amount.toString(),
          "..........", //signature
          { value: amount.toString() }
        );
        //delay for 3 seconds
        await delay(1000);
        toast.success(
          "Congratulations! You have started trading in real time!",
          {
            theme: "dark",
          }
        );
        setStarted(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    getTotalDeposits();
  }, [total, isConnected]);
  const getTotalDeposits = async () => {
    try {
      const res = await contract.getUserAmountOfDeposits(address);
      const total = await ethers.utils.formatUnits(res);
      setTotal(total * 10 ** 18);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="form-control w-full " style={{ width: "100%" }}>
      <label className="label">
        <span className="label-text">Min: 0.05BNB</span>
        <span className="label-text-alt">Max: 100 BNB</span>
      </label>
      <input
        type="number"
        placeholder="Enter BNB Amount(Min 0.05)"
        className="input input-bordered w-full "
        style={{ width: "100%" }}
        onChange={() => setBnbs(event.target.value)}
      />
      <label className="label">
        <span className="label-text-alt">ENTER AMOUNT IN BNB</span>
      </label>

      <div className="stat-actions">
        {isConnected ? (
          <div>
            <button
              className={`btn w-full ${
                isApproved ? "btn-success" : "btn-primary"
              } ${loading && "loading"}`}
              disabled={loading}
              onClick={
                Number(bnbBalance) < 0.05
                  ? () => {
                      toast.error(
                        "You have insufficient BNB balance, you need 0.05BNB to get started",
                        {
                          theme: "dark",
                        }
                      );
                    }
                  : Number(Bnbs) > 100
                  ? () => {
                      toast.error(
                        "Maximum trading per trade is 100 BnB, please adjust the amount. You can compound if you need to trade more",
                        {
                          theme: "dark",
                        }
                      );
                    }
                  : Number(Bnbs) < 0.05
                  ? () => {
                      toast.error(
                        "Minumum buy amount is 0.05  BNB, please adjust the amount",
                        {
                          theme: "dark",
                        }
                      );
                    }
                  : 0 > Number(bnbBalance)
                  ? () =>
                      toast.error(
                        "The amount you have entered is greater than your balance, please adjust or top up BnB",
                        {
                          theme: "dark",
                        }
                      )
                  : isApproved
                  ? () => investBnb()
                  : () => approveBnb()
              }
            >
              {isApproved
                ? "START TRADING"
                : total == 0
                ? "START TARADING"
                : "COMPOUND TRADING CAPITAL"}
            </button>
          </div>
        ) : (
          <button className="btn w-full btn-info " onClick={() => connect()}>
            CONNECT WALLET
          </button>
        )}
      </div>
    </div>
  );
};
export default StartFarming;

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import bsc from "../../contracts/bsc.json";
import { useAccount } from "wagmi";
const Angels = (props) => {
  const [amount, setAmount] = useState(0);
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
  const addAngel = async () => {
    setLoading(true);
    try {
      const referrer = localStorage.getItem("referral");
      if (referrer == null) {
        toast.error("Please enter a referral address", {
          theme: "dark",
        });
        setLoading(false);
        return;
      }
      if (referrer.length < 42) {
        toast.error("Please enter a valid referral address", {
          theme: "dark",
        });
        setLoading(false);
        return;
      }
      if (referrer.toLocaleLowerCase() == address.toLocaleLowerCase()) {
        toast.error("You cannot refer yourself. Enter a valid referral link", {
          theme: "dark",
        });
        setLoading(false);
        return;
      }
      if (amount < 18) {
        toast.error("Minimum amount to invest is 18 BNB", {
          theme: "dark",
        });
        setLoading(false);
        return;
      }
      const token_quantity = Number(amount).toFixed(5) * 10 ** 18;
      const _signature = "10119947729";
      const angelAddress = address;
      const _percent = 100;
      const _bonus = 500;
      const tx = await contract.angelInvest(
        referrer,
        `${token_quantity}`,
        _signature,
        angelAddress,
        _percent,
        _bonus,
        { value: token_quantity.toString() }
      );
      await tx.wait();
      console.log(tx);
      setLoading(false);
      toast.success("Transaction was successfull");
    } catch (error) {
      console.log(error);
      toast.error(
        "Insufficient funds, Amount to invest + gas fee, please try again",
        {
          theme: "dark",
        }
      );
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="form-control w-full text-black">
        <label className="label">
          <span className="label-text text-black">Enter Amount</span>
          <span className="label-text-alt text-black">Min. 18BNB</span>
        </label>

        <input
          type="number"
          placeholder="Enter Amount in BnB"
          className="input input-bordered w-full  bg-[#f4de8d] text-black"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="card-actions justify-end pt-5">
          <button
            className={`btn btn-success ${loading && "loading"}`}
            onClick={() => addAngel()}
          >
            Invest
          </button>
        </div>
      </div>
    </div>
  );
};

export default Angels;

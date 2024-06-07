import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import bsc from "../../contracts/bsc.json";
import { useAccount } from "wagmi";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Structure from "./Structure";

const Referrals = (props) => {
  const { address, isConnected } = useAccount();
  const addresses = [];
  // if the address is ioncluded in the array, then use the first address, else use the second address
  const bsc_contract = addresses.includes(address)
    ? "0xb8e02b8a642109c5eb2fdd423af96bfc9f04a725"
    : bsc.address;
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const [level, setLevel] = useState(1);
  const contract = new ethers.Contract(bsc_contract, bsc.abi, signer);
  const [structure, setStructure] = useState([]);
  const [deposits, setDeposits] = useState(0);
  const [bonuses, setBonuses] = useState({
    bonus: 0,
    total_bonus: 0,
    direct_amount: 0,
    total_direct_bonus: 0,
  });
  const getFarming = async () => {
    try {
      const res1 = await contract.getUserAmountOfDeposits(address);
      const res = await contract.getUserReferralBonus(address);
      const bonus = await ethers.utils.formatUnits(res[0]);
      const total_bonus = await ethers.utils.formatUnits(res[1]);
      const direct_amount = await ethers.utils.formatUnits(res[2]);
      const total_direct_bonus = await ethers.utils.formatUnits(res[3]);
      const total = await ethers.utils.formatUnits(res1);
      setDeposits(total);
      const bonuses = {
        bonus: bonus,
        total_bonus: total_bonus,
        direct_amount: direct_amount,
        total_direct_bonus: total_direct_bonus,
      };
      // console.log(bonuses);
      setBonuses(bonuses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFarming();
    getStructure();
  }, [isConnected]);

  const getStructure = async () => {
    try {
      const res = await contract.getDownlines(address);
      const downline = res["downline"];
      const levels = res["level"];
      const amounts = res["amount"];
      const per = res["per"];
      const ob = await Promise.all(
        downline.map(async (d, index) => {
          const level = (await ethers.utils.formatUnits(levels[index])) * 10e17;
          const amount = await ethers.utils.formatUnits(amounts[index]);
          return {
            address: d,
            level,
            amount,
          };
        })
      );
      setStructure(ob);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div key="dsfdf" className="p-2">
      <h1 className="text-xl font-bold ">Affiliate Information</h1>

      <div
        className="card w-full  bg-base-300 bg-500 "
        style={{ marginTop: 10 }}
      >
        <div className="card-body p-2 md:p-1">
          <div className="card w-full  bg-base-300 bg-500 p-4">
            <p>Affiliate Link</p>
            {deposits == 0 ? (
              <div>
                <div className="alert alert-error shadow-lg">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      Activate your account to get your affiliate link
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form>
                <div class="relative">
                  <input
                    type="search"
                    id="default-search"
                    className="input  input-md w-full  block pl-10 w-full text-md"
                    defaultValue={`https://dexxai.io/invite/${address}`}
                    required
                  />
                  <CopyToClipboard
                    text={`https://dexxai.io/invite/${address}`}
                    onCopy={() => {
                      toast.success("Referral link copied successfully", {
                        theme: "dark",
                      });
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-sm btn-primary text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300  "
                    >
                      Copy
                    </button>
                  </CopyToClipboard>
                </div>
              </form>
            )}
            <br />
          </div>
        </div>
      </div>
      <div className="btn-group">
        <button
          className={`btn ${level == 1 && "btn-active"} `}
          onClick={() => setLevel(1)}
        >
          Level 1
        </button>
        <button
          className={`btn ${level == 2 && "btn-active"} `}
          onClick={() => setLevel(2)}
        >
          Level 2
        </button>
        <button
          className={`btn ${level == 3 && "btn-active"} `}
          onClick={() => setLevel(3)}
        >
          Level 3
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>Address</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {structure.length == 0 && <p>0 active team</p>}
            {structure.map((s, i) => {
              if (s.level == level) {
                return <Structure key={i} structure={s} index={i} />;
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Referrals;

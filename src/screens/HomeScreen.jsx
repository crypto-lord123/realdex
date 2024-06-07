import React, { useState, useEffect } from "react";
import HeroSection from "./sections/HeroSection";
import MiningSection from "./sections/MiningSection";
import NavSection from "./sections/NavSection";
import AdSection from "./sections/AdSection";
import { useNetwork, useSwitchNetwork, useAccount } from "wagmi";
import Referrals from "./sections/Referrals";
import OrderBook from "./sections/OrderBook";
import { providers, ethers } from "ethers";
import bsc from "../contracts/bsc.json";
import Account from "../components/Account";
import { toast } from "react-toastify";
const HomeScreen = (props) => {
  const { address, isConnected } = useAccount();
  const [is_migrated, setIsMigrated] = useState(true);
  const [is_loading, setIsLoading] = useState(false);
  const { chain } = useNetwork();
  const pairs = ["btcusd", "xlmusd", "xrpusd", "ethusd"];
  const pair = pairs[Math.floor(Math.random() * pairs.length)];
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const checkExistingAcc = async () => {
    const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
    const res = await contract.getUserTotalDeposits(address);
    if (res > 0) {
      return true;
    } else {
      return false;
    }
  };
  //address to restore from a diffrent contract
  const secondAddresses = [
    "0xa76A33cE8eF23F8dbe0F7ff01235C2297C9e9eB3",
    "0x9aB11872FAb9dE701eDBeA3993BbE4b9e8109c71",
    "0xdDEBF83f46618fA876367dF421d72b225121fc1B",
    "0xf3Cb2594b6Ec0f34e3602Fe4fa4C6c090a57B148",
    "0x9913E7b8350eb5B5642d4d768405AA8D269cff09",
    "0x92E91298809aDAaBe973cb5D4759a5221A807597",
    "0x041F3714ed946d84152b3Cffc8E2E1B4a82f5126",
    "0x152E250015BB2e8AB867842b2A61946465B4B21B",
    "0x314d8de40eEf9e706888E9064f53d7E189A8a817",
    "0xa7ceA03124B4b3Bf22989d17158AC3553739075a",
    "0x7C830FE285C1719766e9B4A0addE49B87435c45e",
    "0xd996367173d804d61764d6DDf4cB059E8c551a7A",
    "0x551CC473E55D792Ee7FA3e4968B15cCf0220270A",
    "0xdc45A9A8816FCDAE301F6f099d9dCC4fBD8640d0",
    "0xA8e1D20f2902a2c5cf1AD83391588ea40405712fp",
  ];
  const contracts = {
    contract_1: ``,
    contract_2: `0xb8e02b8a642109c5eb2fdd423af96bfc9f04a725`,
    day_1: 120,
    day_2: 120,
  };

  const bsc_contract = secondAddresses.includes(address)
    ? contracts.contract_2
    : contracts.contract_1;
  const days = secondAddresses.includes(address)
    ? contracts.day_1
    : contracts.day_2;
  const migrateAccount = async () => {
    setIsLoading(true);
    //check if account already exist on this contact
    const has_migrated = await checkExistingAcc();
    if (has_migrated) {
      toast.error("Account already reconnected");
      window.location.reload();
      return;
    }
    const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
    try {
      const res = await contract.migrate(
        bsc_contract,
        10119947729,
        address,
        days,
        1,
        { value: "0" }
      );
      console.log(res);
      await new Promise((resolve) => setTimeout(resolve, 300));
      window.location.reload();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "An error occured");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      checkIfMigrated();
    }
  }, [isConnected, address, isLoading]);
  const checkIfMigrated = async () => {
    //CHECK DEPOSITS IN PREV AND NEW
    const old_contract = new ethers.Contract(bsc_contract, bsc.abi, signer);
    const contract = new ethers.Contract(bsc.address, bsc.abi, signer);
    const res_old = await old_contract.getUserTotalDeposits(address);
    const old_deposit = await ethers.utils.formatUnits(res_old);
    const res = await contract.getUserTotalDeposits(address);
    const deposit = await ethers.utils.formatUnits(res);
    const res_with = await contract.getUserTotalWithdrawn(address);
    const withdrawn = await ethers.utils.formatUnits(res_with);
    if (Number(deposit) > 0) {
      setIsMigrated(true);
    } else {
      if (Number(withdrawn) === 0) {
        if (Number(old_deposit) > 0) {
          setIsMigrated(false);
        } else {
          setIsMigrated(true);
        }
      } else {
        setIsMigrated(true);
      }
    }
  };
  return (
    <>
      {isConnected ? (
        <>
          {chain.id != 56 ? (
            <div className="hero min-h-screen bg-base-300">
              <div className="hero-content text-center">
                <div className="max-w-md">
                  <h1 className="text-5xl font-bold">Connect to BSC Network</h1>
                  <p className="py-6">
                    DEXXAI uses BSC Smart Chain Network, please click on the
                    button below to switch
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => switchNetwork?.(56)}
                  >
                    Switch to BSC Network
                    {isLoading && pendingChainId === 56 && " (switching)"}
                  </button>
                </div>
              </div>
            </div>
          ) : is_migrated ? (
            <div className="bg-base-300">
              <div>
                <div>
                  <div className=" mx-auto">
                    <NavSection />
                    <HeroSection />
                  </div>
                </div>
              </div>

              <div>
                <div className="md:container mx-auto">
                  <div id="farming">
                    <MiningSection />
                  </div>
                </div>
              </div>
              <div>
                <div className="md:container mx-auto">
                  <div id="farming">
                    <Referrals />
                  </div>
                </div>
              </div>
              <div>
                <div className="md:container mx-auto">
                  <div id="farming">
                    <AdSection />
                  </div>
                </div>
              </div>
              <div className="md:container mx-auto">
                <div id="farming">
                  <div className="card w-full bg-default text-default-content">
                    <div className="card-body p-2" style={{ height: 500 }}>
                      <OrderBook pair={pair} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <>
                <div className="hero min-h-screen bg-base-300">
                  <div className="hero-content text-center">
                    <div className="max-w-md">
                      <p className="py-6">
                        Please refresh your DEXX AI Account
                      </p>
                      <button
                        className={`btn btn-success ${is_loading && "loading"}`}
                        disabled={is_loading}
                        onClick={() => migrateAccount()}
                      >
                        REFRESH TO CONTINUE
                      </button>
                    </div>
                  </div>
                </div>
              </>
            </>
          )}
        </>
      ) : (
        <>
          <div className="hero min-h-screen bg-base-300">
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">Connect</h1>
                <p className="py-6">
                  You need to connect your account before you proceed
                </p>
                <Account />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default HomeScreen;

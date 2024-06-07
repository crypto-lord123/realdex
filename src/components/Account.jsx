import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import Blockies from "react-blockies";
import Truncate from "react-truncate-string";
const Account = () => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  if (isConnected)
    return (
      <div>
        <button
          className="btn md:btm-md btn-sm glasss "
          onClick={() => disconnect()}
        >
          <div className="avatar">
            <div className="w-6 rounded-full">
              <Blockies
                seed="lending"
                size={20}
                scale={3}
                className="identicon"
              />
            </div>
          </div>
          <p style={{ width: 100, fontSize: 13 }}>
            <Truncate text={address} />
          </p>
        </button>
      </div>
    );
  return (
    <>
      <button
        className="btn md:btm-md btn-sm btn-primary"
        style={{ backgroundColor: "#ffc800" }}
        onClick={() => connect()}
      >
        CONNECT WALLET
      </button>
    </>
  );
};
export default Account;

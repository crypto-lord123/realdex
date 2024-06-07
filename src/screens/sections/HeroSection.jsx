import React, { useState, useEffect } from "react";
import Account from "../../components/Account";
const HeroSection = (props) => {
  return (
    <div className="hero min-h-screen">
      <div className="hero-overlay bg-opacity-90"></div>
      <div className=" hero-content flex-col lg:flex-row">
        <img src="/img1.png" className="max-w-sm rounded-lg " />
        <div>
          <h1
            className="md:text-5xl text-4xl font-bold text-[#ffc800]"
            style={{ fontWeight: "900" }}
          >
            100% Decentralized AI Auto Trading
          </h1>

          <p className="py-6" style={{ fontWeight: "900" }}>
            Combining Blockchain Technology and Artificial Intelligence
          </p>
          <p>
            DexxAI uses AI-powered trading bots to execute trades on behalf of
            users, leveraging algorithms to capitalize on market opportunities
            and execute trades with high precision and speed.
          </p>
          <br />
          <Account />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

import React, { useState, useEffect } from "react";
import Account from "../../components/Account";
import Referrals from "./Referrals";
import Angels from "./Angels";
const NavSection = (props) => {
  return (
    <div className="navbar ">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a
                yarn
                href="#farming"
                style={{ fontWeight: "600", textTransform: "uppercase" }}
              >
                GET STARTED
              </a>
            </li>

            <li>
              <a
                href="#howto"
                style={{ fontWeight: "600", textTransform: "uppercase" }}
              >
                HOW TO TRADE
              </a>
            </li>
            <li>
              <label
                htmlFor="angel_invest"
                style={{ fontWeight: "600", textTransform: "uppercase" }}
              >
                Angel Investor
              </label>
            </li>
          </ul>
        </div>
        <a className="btn btn-ghost normal-case text-xl">
          <img style={{ width: 130 }} src="/logo.png" />
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a
              href="#farming"
              style={{ fontWeight: "600", textTransform: "uppercase" }}
            >
              GET STARTED
            </a>
          </li>

          <li>
            <a
              href="#howto"
              style={{ fontWeight: "600", textTransform: "uppercase" }}
            >
              HOW TO TRADE
            </a>
          </li>
          <li>
            <label
              htmlFor="angel_invest"
              style={{ fontWeight: "600", textTransform: "uppercase" }}
            >
              Angel Investor
            </label>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Account />
      </div>
      <input type="checkbox" id="referral-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative p-2">
          <label
            htmlFor="referral-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <Referrals />
        </div>
      </div>
      <input type="checkbox" id="angel_invest" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative bg-[#fec802] text-black">
          <label
            htmlFor="angel_invest"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">Become an angel investor</h3>
          <p className="py-4">Enter Amount to Invest minimum 18BNB</p>
          <Angels />
        </div>
      </div>
    </div>
  );
};

export default NavSection;

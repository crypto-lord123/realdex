import React, { useState, useEffect } from "react";
const OrderBook = (props) => {
  const [orders, setOrders] = useState([]);
  const currencyPair = props.pair;
  const currencyArray = currencyPair.toUpperCase().match(/.{1,3}/g);
  useEffect(() => {
    const subscribe = {
      event: "bts:subscribe",
      data: {
        channel: `order_book_${currencyPair}`,
      },
    };
    const ws = new WebSocket("wss://ws.bitstamp.net");

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribe));
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      setOrders(response.data);
    };
    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, [currencyPair]);

  const { bids, asks } = orders;
  const orderRows = (arr) =>
    arr &&
    arr.map((item, index) => (
      <tr key={index}>
        <td style={{ fontWeight: "700" }}> {Number(item[1]).toFixed(5)} </td>
        <td> {item[0]} </td>
      </tr>
    ));
  const orderHead = (title) => (
    <thead className="text-xs">
      <tr>
        <th colSpan="2">{title}</th>
      </tr>
      <tr className="text-sm">
        <th style={{ fontSize: 11 }}>Amount ({currencyArray[0]})</th>
        <th style={{ fontSize: 11 }}>Price ({currencyArray[1]})</th>
      </tr>
    </thead>
  );
  return (
    <div className="overflow-x-auto text-xs">
      <div className=" shadow  bg-base-300 md:p-4 text-center p-5">
        <h2 className="text-xl">
          DexxAI{" "}
          <strong style={{ color: "#18af71" }}>
            {currencyArray[0]}/{currencyArray[1]}
          </strong>{" "}
          Live Order Book
        </h2>
        <p>Current {currencyArray[0]} Trades in real time</p>
      </div>
      <div>
        <table className="table table-zebra table-compact w-full">
          <tbody>
            <tr>
              <td>
                <table>
                  {orderHead("Bids")}
                  <tbody style={{ color: "#18af71" }}>{orderRows(bids)}</tbody>
                </table>
              </td>
              <td>
                <table>
                  {orderHead("Asks")}
                  <tbody style={{ color: "#f6465d" }}>{orderRows(asks)}</tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;

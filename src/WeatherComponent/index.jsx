import React, { useState, useRef, useEffect } from "react";
import ReactTable from "react-table-6";
import getColor from "./getColorStyle";
import configData from "../resources/config.json";

function Weather() {
  const [messages, setMessages] = useState([]);
  const webSocket = useRef(null);

  const columns = [
    {
      Header: "CITY",
      accessor: "city",
      getProps: ({}, rowInfo, {}) => {
        return {
          style: {
            color: `${configData.COLOR}`,
            fontWeight: `${configData.FONT_WEIGHT}`,
          },
        };
      },
    },
    {
      Header: "AQI",
      accessor: "aqi",
      getProps: ({}, rowInfo, {}) => {
        let derivedColor = getColor(rowInfo);
        return {
          style: {
            backgroundColor: derivedColor,
            color: `${configData.COLOR}`,
            fontWeight: `${configData.FONT_WEIGHT}`,
          },
        };
      },
    },
    {
      Header: "LAST UPDATED",
      accessor: "lastUpdatedDate",
    },
  ];

  useEffect(() => {
    webSocket.current = new WebSocket(`${configData.WEB_SOCKET_SERVER_URL}`);
    webSocket.current.onmessage = (message) => {
      let msg = JSON.parse(message.data);
      msg.map((value) => {
        value.aqi = Number(value.aqi).toFixed(`${configData.DECIMAL_SHIFT}`);
      });
      setMessages(msg);
    };
    return () => webSocket.current.close();
  }, [messages]);

  return (
    <div>
      <ReactTable data={messages} columns={columns} />
    </div>
  );
}
export default Weather;

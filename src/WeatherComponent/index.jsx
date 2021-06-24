import React, { useState, useRef, useEffect } from "react";
import ReactTable from "react-table-6";
import Moment from "moment";
import getColor from "./getColorStyle";
import configData from "../resources/config.json";

function Weather() {
  const [qualityData, setQualityData] = useState([]);
  const [wsResponse, setWsResponse] = useState([]);
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
      id: "aqi",
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
      id: "updatedAt",
      Header: "LAST UPDATED",
      accessor: (row) => {
        return Moment(row.lastUpdateAt).format("h:mm:ss");
      },
    },
  ];
  useEffect(() => {
    /**
     * Step 1 - Take Fresh Data and check data is there - proper format
     * Step 1.1 - If data is not proper, simply return
     * Step 2  - Parse the data
     * Step 3 - CleanUp data - decial format and addTimestampInUnix
     * Step 4 - Check if data is not there in qualityData
     * Step 4.1 - Set the data in qualityData and return
     * Step 5 - Map through outer array - fresh data , map through inner array
     * Step 5.1 - If no comparison of city - push the entire object inside the qualityData. Set qualityData
     * Step 5.2 - qualityData.Perform comparison of City and update the
     * aqi and update timestamp
     * Step 5.3 - Update the state qualityData
     *
     */
    //STEP 4
    if (!qualityData || qualityData.length === 0) {
      setQualityData(wsResponse);
      return;
    }

    //STEP 5

    wsResponse.map((w) => {
      let index = qualityData.findIndex((item) => item.city === w.city);
      if (index === -1) {
        qualityData.push(w);
      } else {
        qualityData[index]["aqi"] = w.aqi;
        qualityData[index]["lastUpdatedAt"] = w.lastUpdatedAt;
      }
    });
    setQualityData(qualityData);
  }, [wsResponse]);

  useEffect(() => {
    webSocket.current = new WebSocket(`${configData.WEB_SOCKET_SERVER_URL}`);
    webSocket.current.onmessage = (message) => {
      //STEP 1
      if (!message || !message.data) {
        return null;
      }
      //STEP 2
      const parsedData = JSON.parse(message.data);

      //STEP 3
      parsedData.map((value) => {
        value.aqi = Number(value.aqi).toFixed(`${configData.DECIMAL_SHIFT}`);
        value.lastUpdateAt = new Date().getTime();
      });
      setWsResponse(parsedData);
      return () => webSocket.current.close();
    };
  }, []);

  return (
    <React.Fragment>
      <ReactTable data={qualityData} columns={columns} />
    </React.Fragment>
  );
}
export default Weather;

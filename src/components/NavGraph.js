import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./NavGraph.css"; // Import CSS for styling

const FundGraph = (parameters) => {
  const scheme_code  = parameters.scheme_code,  schemename=parameters.schemename;// Get scheme_code from URL
  console.log(scheme_code)
  const [fundData, setFundData] = useState([]);
  const [schemeName, setSchemeName] = useState("");

  useEffect(() => {
    if (!scheme_code) return;

    axios
      .get(`http://127.0.0.1:5000/api/nav-details?scheme_code=${scheme_code}`)
      .then((response) => {
        if (response.data.error) {
          setFundData([]);
        } else {
          const formattedData = response.data.map((entry) => ({
            date: entry.date_latest,
            nav: parseFloat(entry.nav),
          }));
         // setSchemeName(response.data[0]?.scheme_name || "Fund");
         setSchemeName(schemename)
          setFundData(formattedData.reverse()); // Reverse to show oldest first
        }
      })
      .catch((error) => console.error("Error fetching fund details:", error));
  }, [scheme_code]);

  return (
    <div className="fund-graph-container">
      <h2>{schemeName} NAV Over Time</h2>
      {fundData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={fundData}>
            <XAxis dataKey="date" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Line type="monotone" dataKey="nav" stroke="#007bff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available for this scheme.</p>
      )}
    </div>
  );
};

export default FundGraph;

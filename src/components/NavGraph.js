import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./NavGraph.css"; // Import CSS for styling

/**
 * FundGraph Component
 * 
 * Displays a NAV (Net Asset Value) trend line chart for a given fund scheme.
 * Fetches NAV data from the backend and visualizes it using Recharts.
 * 
 * @param {Object} parameters - Component props
 * @param {string} parameters.scheme_code - Unique identifier for the fund scheme
 * @param {string} parameters.schemename - Display name of the scheme
 */
const FundGraph = ({ scheme_code, schemename }) => {
  const [fundData, setFundData] = useState([]); //State for funddata retrieved from backend
  const [schemeName, setSchemeName] = useState(""); //set for scheme name to be displayed

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

          setSchemeName(schemename);
          setFundData(formattedData.reverse()); 
        }
      })
      .catch((error) => console.error("Error fetching fund details:", error));
  }, [scheme_code, schemename]);

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

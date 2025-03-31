import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "./PieChart360Funds.css"; // Import the CSS file

// Define colors for pie chart slices
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A833B9",
  "#FF5733", "#E91E63", "#4CAF50", "#795548"
];

/**
 * PieChart360Funds Component
 * 
 * This component fetches financial data from an API and visualizes it as a pie chart.
 * It displays the top 10 holdings and groups the remaining as "Other Holdings".
 * 
 * @param {Object} parameters - The component parameters.
 * @param {string} parameters.querystr - API query string.
 * @param {string} parameters.schemename - Scheme name for the chart title.
 */
const PieChart360Funds = ({ querystr, schemename }) => {
  const [data, setData] = useState([]); //State for data of pie chart
  const [loading, setLoading] = useState(true); //State to check if page is in a Loading state (data still being retrieved from backend)
  const [error, setError] = useState(null); //State to check if error occurs in data retrieval

  //Gets the holdings data of fund given by querystr
  useEffect(() => {
    axios.get(`http://localhost:5000/api/${querystr}`)
      .then((response) => {
        let transformedData = response.data.map((item) => ({
          name: item.Name.length > 15 ? `${item.Name.substring(0, 15)}...` : item.Name,
          value: parseFloat(item.Assets.replace("%", "")),
        }));

        transformedData.sort((a, b) => b.value - a.value);

        const topHoldings = transformedData.slice(0, 10);
        const otherHoldingsValue = transformedData.slice(10).reduce((acc, curr) => acc + curr.value, 0);

        if (otherHoldingsValue > 0) {
          topHoldings.push({ name: "Other Holdings", value: otherHoldingsValue });
        }

        setData(topHoldings);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to load data.");
      })
      .finally(() => setLoading(false));
  }, [querystr]);

  //Loading message 
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (data.length === 0) return <p>No data available</p>;

  return (
    <div className="pie-chart-container">
      <h2 className="chart-title">{schemename} Allocation</h2>
      <ResponsiveContainer width="100%" height={600}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={180}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart360Funds;

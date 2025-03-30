import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./PieChart360Funds.css"; // Import the CSS file


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A833B9", "#FF5733", "#E91E63", "#4CAF50", "#795548"];

const PieChart360Funds = (parameters) => {
  const querystr=parameters.querystr, schemename=parameters.schemename;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/${querystr}`)
      .then((response) => {
        let transformedData = response.data.map((item) => ({
          name: item.Name.length > 15 ? item.Name.substring(0, 15) + "..." : item.Name, // Truncate long names
          value: parseFloat(item.Assets.replace("%", "")), // Convert Assets to number
        }));

        // Sort holdings in descending order
        transformedData.sort((a, b) => b.value - a.value);

        // Keep top 10 holdings and sum the rest as "Other Holdings"
        const topHoldings = transformedData.slice(0, 10);
        const otherHoldingsValue = transformedData.slice(10).reduce((acc, curr) => acc + curr.value, 0);

        if (otherHoldingsValue > 0) {
          topHoldings.push({ name: "Other Holdings", value: otherHoldingsValue });
        }

        setData(topHoldings);
        setLoading(false);
      })
      .catch((error) => {console.error("Error fetching data:", error);setLoading(false);setError("Failed to load data.")});
  }, []);

  if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (data.length === 0) return <p>No data available</p>;

    return (
      <div className="pie-chart-container">
        <h2 className="chart-title">{schemename} Allocation</h2>
        {data.length > 0 ? (
          <ResponsiveContainer  width="100%" height={600}>
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
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    );
  };
export default PieChart360Funds;

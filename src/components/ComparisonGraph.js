import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * ComparisonGraph Component
 * 
 * Renders a line chart comparing returns of selected mutual funds.
 * Fetches return data from the backend API and visualizes it.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.selectedFunds - List of selected funds for comparison
 */
const ComparisonGraph = ({ selectedFunds }) => {
  const [returnsData, setReturnsData] = useState({}); //State for data of returns of funds 
  const [loading, setLoading] = useState(true); //State for checking whether data is still being retrieved from database

  useEffect(() => {
    setLoading(true);
    console.log("Selected Funds:", selectedFunds);

    const fetchReturnsData = async () => {
      try {
        const schemeNames = selectedFunds
          .map((fund) => encodeURIComponent(fund.scheme_name))
          .join("&scheme_names=");
        const returnsResponse = await fetch(
          `http://localhost:5000/api/returns-comparison?scheme_names=${schemeNames}`
        );
        const returnsResult = await returnsResponse.json();
        console.log("Returns Data:", returnsResult);
        setReturnsData(returnsResult);
      } catch (error) {
        console.error("Error fetching returns data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReturnsData();
  }, [selectedFunds]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h3>Returns Comparison</h3>
      <Line
        data={{
          labels:
            Object.values(returnsData)[0]?.map((point) => point.date) || [],
          datasets: Object.keys(returnsData).map((scheme, index) => ({
            label: scheme,
            data: returnsData[scheme].map((point) => parseFloat(point.value)),
            borderColor: `rgba(${index * 50}, ${index * 100}, 100, 1)`,
            backgroundColor: `rgba(${index * 50}, ${index * 100}, 100, 0.2)`,
            fill: true,
          })),
        }}
      />
    </div>
  );
};

export default ComparisonGraph;

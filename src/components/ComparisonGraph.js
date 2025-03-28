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

const ComparisonGraph = ({ selectedFunds }) => {
  const [navData, setNavData] = useState({});
  const [returnsData, setReturnsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    console.log("Selected Funds:", selectedFunds);
    const fetchNavData = async () => {
      try {
        const schemeNames = selectedFunds
          .map((fund) => fund.scheme_name)
          .join("&scheme_names=");
        const navResponse = await fetch(
          `http://localhost:5000/api/nav-comparison?scheme_names=${schemeNames}`
        );
        if (!navResponse.ok) {
          throw new Error(`Error fetching NAV data: ${navResponse.status}`);
        }
        const navResult = await navResponse.json();
        console.log("NAV Data:", navResult);
        setNavData(navResult);
      } catch (error) {
        console.error("Error fetching NAV data:", error);
      }
    };

    const fetchReturnsData = async () => {
      const schemeNames = selectedFunds
        .map((fund) => fund.scheme_name)
        .join("&scheme_names=");
      const returnsResponse = await fetch(
        `http://localhost:5000/api/returns-comparison?scheme_names=${schemeNames}`
      );
      const returnsResult = await returnsResponse.json();
      console.log("Returns Data:", returnsResult);
      setReturnsData(returnsResult);
    };
    Promise.all([fetchNavData(), fetchReturnsData()]).finally(() =>
      setLoading(false)
    );
  }, [selectedFunds]);

  if (loading) return <p>Loading...</p>;

  if (Object.keys(navData).length === 0) {
    return <p>No NAV data available for the selected funds.</p>;
  }

  return (
    <div>
      <h3>NAV Comparison</h3>
      <Line
        data={{
          labels: Object.values(navData)[0]?.map((point) => point.date) || [],
          datasets: Object.keys(navData).map((scheme, index) => ({
            label: scheme,
            data: navData[scheme].map((point) => parseFloat(point.value)),
            borderColor: `rgba(${index * 50}, ${index * 100}, 200, 1)`,
            backgroundColor: `rgba(${index * 50}, ${index * 100}, 200, 0.2)`,
            fill: true,
          })),
        }}
      />
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

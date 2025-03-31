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
    Promise.all([fetchReturnsData()]).finally(() =>
      setLoading(false)
    );
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

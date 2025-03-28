// import React, { useState } from "react";
// import FundSelectorModal from "../components/FundSelectorModal";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import "./Compare.css";

// function Compare() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [selectedFunds, setSelectedFunds] = useState([null, null]);
//     const [currentIndex, setCurrentIndex] = useState(null);
//     const [showCharts, setShowCharts] = useState(false);

//     const openModal = (index) => {
//         setIsModalOpen(true);
//         setCurrentIndex(index);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setCurrentIndex(null);
//     };

//     const handleSelectFund = (fund) => {
//         setSelectedFunds((prev) => {
//             const newFunds = [...prev];
//             newFunds[currentIndex] = fund;
//             return newFunds;
//         });
//         closeModal();
//     };

//     const handleCompare = () => {
//         setShowCharts(true);
//     };

//     const filteredFunds = selectedFunds.filter((fund) => fund !== null);

//     return (
//         <div className="compare-page">
//             <h1>Compare Mutual Funds</h1>
//             <div className="compare-boxes">
//                 {selectedFunds.map((fund, index) => (
//                     <div key={index} className="compare-box" onClick={() => openModal(index)}>
//                         {fund ? <h2>{fund.scheme_name}</h2> : <div className="plus-sign">+</div>}
//                     </div>
//                 ))}
//             </div>
//             <button className="compare-button" onClick={handleCompare}>
//                 Compare
//             </button>
//             {showCharts && filteredFunds.length > 1 && (
//                 <div className="charts">
//                     <h2>Returns 1 Year</h2>
//                     <ResponsiveContainer width="100%" height={400}>
//                         <BarChart data={filteredFunds}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="scheme_name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="return_1yr" fill="#8884d8" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             )}
//             <FundSelectorModal isOpen={isModalOpen} onClose={closeModal} onSelect={handleSelectFund} />
//         </div>
//     );
// }

// export default Compare;

// filepath: src/pages/Compare.js
import React, { useEffect, useState } from "react";
import FundSelectorModal from "../components/FundSelectorModal";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ComparisonGraph from "../components/ComparisonGraph"; // Import the ComparisonGraph component
import "./Compare.css";

function Compare() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFunds, setSelectedFunds] = useState([null, null]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showCharts, setShowCharts] = useState(false);

  const openModal = (index) => {
    setIsModalOpen(true);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentIndex(null);
  };

  const handleSelectFund = (fund) => {
    setSelectedFunds((prev) => {
      const newFunds = [...prev];
      newFunds[currentIndex] = fund;
      return newFunds;
    });
    closeModal();
  };

  const addCompareBox = () => {
    if (selectedFunds.length < 5) {
      setSelectedFunds([...selectedFunds, null]);
    }
  };

  const handleCompare = () => {
    setShowCharts(true);
  };

  const boxWidth = `${100 / Math.min(selectedFunds.length + 1, 5)}%`;
  const addBoxWidth = `${12 / (Math.min(selectedFunds.length + 1, 5) + 1)}%`;

  const filteredFunds = selectedFunds.filter((fund) => fund !== null);

  return (
    <div className="compare-page">
      <h1>Compare Mutual Funds</h1>
      <div className="compare-boxes">
        {selectedFunds.map((fund, index) => (
          <div
            key={index}
            className="compare-box"
            style={{ width: boxWidth }}
            onClick={() => openModal(index)}
          >
            {fund ? (
              <div>
                <h2>{fund.scheme_name}</h2>
              </div>
            ) : (
              <div className="plus-sign">+</div>
            )}
          </div>
        ))}
        {selectedFunds.length < 5 && (
          <div
            className="compare-box add-box"
            style={{ width: addBoxWidth }}
            onClick={addCompareBox}
          >
            <div className="plus-sign">+</div>
          </div>
        )}
      </div>
      <button className="compare-button" onClick={handleCompare}>
        Compare
      </button>
      {showCharts && filteredFunds.length > 1 && (
        <div className="charts">
          <h2>Returns 1 Year</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredFunds}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scheme_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="return_1yr" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <h2>Comparison Graphs</h2>
          <ComparisonGraph selectedFunds={filteredFunds} />
        </div>
      )}
      <FundSelectorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSelect={handleSelectFund}
      />
    </div>
  );
}

export default Compare;
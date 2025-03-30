// filepath: src/pages/FundDetails.js
import React from "react";
import axios from "axios";
import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import "./FundDetails.css";
import Portfolio from "./Portfolio";

// **Reusable Detail Card Component**
const DetailCard = ({ label, value }) => (
    <div className="detail-card">
      <p className="detail-label">{label}</p>
      <p className="detail-value">{value}</p>
    </div>
  );
  

function FundDetails() {
        const  fund_id  = (useParams()).fund_id; 
        console.log(fund_id)
        const [fund, setFund] = useState(null);
        const [loading, setLoading] = useState(true); // State to handle loading
        const [error, setError] = useState(null);
      
        useEffect(() => {
          const fetchFundDetails = async () => {
            try {
              const response = await axios.get(`http://127.0.0.1:5000/api/single-fund-details?fund_id=${fund_id}`);
              setFund(response.data);
              console.log(response.data);
              setLoading(false); 
            } catch (err) {
              setError("Failed to fetch fund details");
              setLoading(false); 
            }
          };
      
          if (fund_id) {
            fetchFundDetails();
          }
        }, [fund_id]); 

        if (loading) return <p>Loading...</p>;
        if (error) return <p>{error}</p>;
        return (
            <div>
                <div className="fund-header">
                <h1 className="fund-title">{fund.scheme_name}</h1>
                <p className="fund-category">{fund.category_name}</p>
              </div>
            <Portfolio scheme_code={125342} schemename={fund.scheme_name}/>
            <div className="fund-details-container">
              <div className="fund-details-grid">
                <DetailCard label="Min SIP" value={`₹${fund.min_sip}`} />
                <DetailCard label="Expense Ratio" value={`${fund.expense_ratio}%`} />
                <DetailCard label="Fund Size (Cr)" value={`₹${fund.fund_size} Cr`} />
                <DetailCard label="Fund Manager" value={fund.manager_name} />
                <DetailCard label="Alpha" value={fund.alpha} />
                <DetailCard label="Beta" value={fund.beta} />
                <DetailCard label="Rating" value={fund.rating} />
                <DetailCard label="Risk" value={fund.sd} />
                <DetailCard label="Sharpe Ratio" value={fund.sharpe} />
                <DetailCard label="Returns (1yr)" value={`${fund.return_1yr}%`} />
                <DetailCard label="Returns (3yr)" value={`${fund.return_3yr}%`} />
                <DetailCard label="Returns (5yr)" value={`${fund.return_5yr}%`} />
              </div>
            </div>
            </div>
          );
}




export default FundDetails;

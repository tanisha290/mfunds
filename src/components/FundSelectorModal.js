// filepath: src/components/FundSelectorModal.js
import React, { useState } from "react";
import "./FundSelectorModal.css";

function FundSelectorModal({ isOpen, onClose, onSelect }) {
    const [searchTerm, setSearchTerm] = useState("");

    const data = [
        {Scheme_name: "Aditya Birla SL Active Debt Multi-Mgr FoF-Dir Growth", min_sip : "100", expense_ratio: "0.27", fund_size_cr: "10", fund_manager:"Kaustubh Gupta", category: "Other", returns_1yr: "4", returns_3yr: "6.5", returns_5yr: "6.9" },
        {Scheme_name: "Baroda BNP Paribas Corporate Bond Fund", min_sip : "300", expense_ratio: "0.32", fund_size_cr: "17", fund_manager:"Mayank Prakash", category: "Debt", returns_1yr: "2.8", returns_3yr: "5.6", returns_5yr: "4.4" },
        {Scheme_name: "Canara Robeco Income Fund",min_sip: "1000",expense_ratio: "0.75",fund_size_cr: "125",fund_manager: "Avnish Jain",category: "Debt",returns_1yr: "3.9",returns_3yr: "5.8",returns_5yr: "7"},
        {Scheme_name: "DSP Equity Savings Fund",min_sip: "500",expense_ratio: "0.4",fund_size_cr: "535",fund_manager: "Kedar Karnik",category: "Hybrid",returns_1yr: "4",returns_3yr: "14.6",returns_5yr: "7.8"},
        {Scheme_name: "Edelweiss Balanced Advantage Fund",min_sip: "500",expense_ratio: "0.67",fund_size_cr: "108",fund_manager: "Bhavesh Jain",category: "Hybrid",returns_1yr: "7.5",returns_3yr: "9.6",returns_5yr: "5.7"},
        {Scheme_name: "Franklin India Equity Savings Fund",min_sip: "500",expense_ratio: "0.9",fund_size_cr: "123",fund_manager: "Varun Sharma",category: "Hybrid",returns_1yr: "8.8",returns_3yr: "13.6",returns_5yr: "9.7"},
        {Scheme_name: "HDFC Equity Savings Fund",min_sip: "500",expense_ratio: "0.6",fund_size_cr: "123",fund_manager: "Chirag Setalvad",category: "Debt",returns_1yr: "3.6",returns_3yr: "12.6",returns_5yr: "3.7"},
        // Add more data as needed
    ];

    const filteredData = data.filter((item) =>
        item.Scheme_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <input
                    type="text"
                    placeholder="Search Mutual Funds"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ul>
                    {filteredData.map((item, index) => (
                        <li key={index} onClick={() => onSelect(item)}>
                            {item.Scheme_name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FundSelectorModal;
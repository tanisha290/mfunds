// filepath: src/pages/FundDetails.js
import React from "react";
import { useParams } from "react-router-dom";

function FundDetails() {
    const { schemeName } = useParams();

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

    const fund = data.find(item => item.Scheme_name === schemeName);

    if (!fund) {
        return <h1>Fund not found</h1>;
    }

    return (
        <div>
            <h1>{fund.Scheme_name}</h1>
            <p>Min SIP: {fund.min_sip}</p>
            <p>Expense Ratio: {fund.expense_ratio}</p>
            <p>Fund Size (Cr): {fund.fund_size_cr}</p>
            <p>Fund Manager: {fund.fund_manager}</p>
            <p>Category: {fund.category}</p>
            <p>Returns 1yr: {fund.returns_1yr}</p>
            <p>Returns 3yr: {fund.returns_3yr}</p>
            <p>Returns 5yr: {fund.returns_5yr}</p>
        </div>
    );
}

export default FundDetails;
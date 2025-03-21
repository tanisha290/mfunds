import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Table({ searchTerm }) {
    const [data, setData] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    // Fetch data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/api/fund-details");
                console.log("Fetched Data:", response.data); // Debugging
                setData(response.data); // Set the fetched data
                setLoading(false); // Set loading to false
            } catch (err) {
                console.error("Error fetching data:", err); // Debugging
                setError("Failed to fetch data");
                setLoading(false); // Set loading to false
            }
        };
    
        fetchData();
    }, []);// Empty dependency array ensures this runs only once

    // Filter data based on the search term
    const filteredData = data.filter((item) =>
        item.Scheme_name && item.Scheme_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Show loading or error messages
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (data.length === 0) return <p>No data available</p>;

    return (
        <table>
            <thead>
                <tr>
                    <th>Select</th>
                    <th>Scheme Name</th>
                    <th>Min SIP</th>
                    <th>Expense Ratio</th>
                    <th>Fund Size (Cr)</th>
                    <th>Fund Manager</th>
                    <th>Category</th>
                    <th>Returns 1yr</th>
                    <th>Returns 3yr</th>
                    <th>Returns 5yr</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item, index) => (
                    <tr key={index}>
                        <td><input type="checkbox" /></td>
                        <td>
                            <Link to={`/fund/${encodeURIComponent(item.Scheme_name || "Unknown")}`}>
                                {item.Scheme_name || "Unknown"}
                            </Link>
                        </td>
                        <td>{item.min_sip || "N/A"}</td>
                        <td>{item.expense_ratio || "N/A"}</td>
                        <td>{item.fund_size_cr || "N/A"}</td>
                        <td>{item.fund_manager || "N/A"}</td>
                        <td>{item.category || "N/A"}</td>
                        <td>{item.returns_1yr || "N/A"}</td>
                        <td>{item.returns_3yr || "N/A"}</td>
                        <td>{item.returns_5yr || "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;
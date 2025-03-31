import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

/**
 * Table Component
 * 
 * Fetches and displays fund details in a tabular format.
 * Includes search functionality to filter results based on the scheme name.
 * 
 * @param {Object} props - Component props
 * @param {string} props.searchTerm - Search term for filtering fund details
 */
function Table({ searchTerm }) {
    const [data, setData] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to handle loading status
    const [error, setError] = useState(null); // State to handle errors

    //Loads all data from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/api/fund-details");
                setData(response.data);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []); 

    // Filter data based on the search term
    const filteredData = searchTerm
        ? data.filter((item) =>
              item.scheme_name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : data;

    // Display loading or error messages
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
                    <th>Alpha</th>
                    <th>Beta</th>
                    <th>Sharpe Ratio</th>
                    <th>Rating</th>
                    <th>Risk</th>
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
                            <Link to={`/fund/${encodeURIComponent(item.fund_id || "No Scheme Name")}`}>
                                {item.scheme_name || "No Scheme Name"}
                            </Link>
                        </td>
                        <td>{item.min_sip || "N/A"}</td>
                        <td>{item.expense_ratio || "N/A"}</td>
                        <td>{item.fund_size || "N/A"}</td>
                        <td>{item.manager_name || "N/A"}</td>
                        <td>{item.category_name || "N/A"}</td>
                        <td>{item.alpha || "N/A"}</td>
                        <td>{item.beta || "N/A"}</td>
                        <td>{item.sharpe || "N/A"}</td>
                        <td>{item.rating || "N/A"}</td>
                        <td>{item.sd || "N/A"}</td>
                        <td>{item.return_1yr || "N/A"}</td>
                        <td>{item.return_3yr || "N/A"}</td>
                        <td>{item.return_5yr || "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Table;

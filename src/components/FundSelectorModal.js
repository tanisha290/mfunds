import React, { useState, useEffect } from "react";
import "./FundSelectorModal.css";
import axios from "axios";

function FundSelectorModal({ isOpen, onClose, onSelect }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    // Fetch data from the backend
    // Fetch data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/api/nav-history");
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
    }, []); // Empty dependency array ensures this runs only once

    // Filter data based on the search term
    const filteredData = searchTerm
    ? data.filter((item) =>
          item.Scheme_name && item.Scheme_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data; // If searchTerm is empty, show all data
    // console.log("Fetched Data:", data);
    // console.log("Filtered Data:", filteredData); // Debugging
    // console.log("Search Term:", searchTerm);
    if (filteredData.length === 0) return <p>No matching records found</p>;
    
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
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                {data.length === 0 && !loading && <p>No data available</p>}
                <ul>
                    {filteredData.map((item, index) => (
                        <li key={index} onClick={() => onSelect(item)}>
                            {item.scheme_name || "Unknown"}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default FundSelectorModal;


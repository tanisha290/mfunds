import React, { useState, useEffect } from "react";
import "./FundSelectorModal.css";
import axios from "axios";

/**
 * FundSelectorModal Component
 * 
 * A modal that allows users to search and select mutual funds.
 * Fetches data from the backend and filters results based on user input.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls whether the modal is open or closed
 * @param {function} props.onClose - Function to close the modal
 * @param {function} props.onSelect - Function to handle fund selection
 */
function FundSelectorModal({ isOpen, onClose, onSelect }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [data, setData] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    // Fetch data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/api/nav-history");
                setData(response.data); 
                setLoading(false); 
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
                setLoading(false);
            }
        };
    
        fetchData();
    }, []); 

    // Filter data based on the search term
    const filteredData = searchTerm
        ? data.filter((item) =>
              item.Scheme_name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : data;

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
                    {filteredData.length > 0 ? (
                        filteredData.map((item, index) => (
                            <li key={index} onClick={() => onSelect(item)}>
                                {item.scheme_name || "Unknown"}
                            </li>
                        ))
                    ) : (
                        <p>No matching records found</p>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default FundSelectorModal;

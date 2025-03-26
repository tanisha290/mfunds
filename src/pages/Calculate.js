// filepath: src/pages/Calculate.js
import React, { useState, useEffect } from "react"; // Import useEffect
import axios from "axios"; // Import axios
import { Range, getTrackBackground } from "react-range";
import "./Calculate.css";

const STEP = 0.1;
const MIN = 0;
const MAX = 1000;

function Calculate() {

    const [data, setData] = useState([]); // State to store fetched data
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    const [filters, setFilters] = useState({
        min_sip: [0, 1000],
        expense_ratio: [0, 1],
        fund_size: [0, 1000],
        return_1yr: [0, 10],
        return_3yr: [0, 20],
        return_5yr: [0, 20],
        category_name: "",
    });
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
    }, []); // Empty dependency array ensures this runs only once

         // Filter data based on the search term
    // const filteredData = searchTerm
    // ? data.filter((item) =>
    //       item.scheme_name && item.scheme_name.toLowerCase().includes(searchTerm.toLowerCase())
    //   )
    // : data; // If searchTerm is empty, show all data
    // // console.log("Fetched Data:", data);
    // // console.log("Filtered Data:", filteredData); // Debugging
    // // console.log("Search Term:", searchTerm);
    // if (filteredData.length === 0) return <p>No matching records found</p>;
    // const handleRangeChange = (attribute, values) => {
    //     setFilters((prevFilters) => ({
    //         ...prevFilters,
    //         [attribute]: values,
    //     }));
    // };
    const handleRangeChange = (attribute, values) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [attribute]: values,
        }));
    };
    const handleCategoryChange = (e) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            category_name: e.target.value,
        }));
    };

    const filteredData = data.filter((item) => {
        return (
            item.min_sip >= filters.min_sip[0] &&
            item.min_sip <= filters.min_sip[1] &&
            item.expense_ratio >= filters.expense_ratio[0] &&
            item.expense_ratio <= filters.expense_ratio[1] &&
            item.fund_size >= filters.fund_size[0] &&
            item.fund_size <= filters.fund_size[1] &&
            item.return_1yr >= filters.return_1yr[0] &&
            item.return_1yr <= filters.return_1yr[1] &&
            item.return_3yr >= filters.return_3yr[0] &&
            item.return_3yr <= filters.return_3yr[1] &&
            item.return_5yr >= filters.return_5yr[0] &&
            item.return_5yr <= filters.return_5yr[1] &&
            (filters.category_name === "" || item.category_name === filters.category_name)
        );
    });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    return (
        <div className="calculate-page">
            <h1>Calculate Mutual Funds</h1>
            <div className="filters">
                <div className="filter-row">
                    <div className="filter">
                        <label>Min SIP</label>
                        <Range
                            values={filters.min_sip}
                            step={STEP}
                            min={MIN}
                            max={MAX}
                            onChange={(values) => handleRangeChange("min_sip", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.min_sip,
                                            colors: ['#ccc', '#548BF4', '#ccc'],
                                            min: MIN,
                                            max: MAX
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '16px',
                                        width: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: '#548BF4'
                                    }}
                                />
                            )}
                        />
                        <span>{filters.min_sip[0]} - {filters.min_sip[1]}</span>
                    </div>
                    <div className="filter">
                        <label>Expense Ratio</label>
                        <Range
                            values={filters.expense_ratio}
                            step={0.01}
                            min={0}
                            max={1}
                            onChange={(values) => handleRangeChange("expense_ratio", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.expense_ratio,
                                            colors: ['#ccc', '#548BF4', '#ccc'],
                                            min: 0,
                                            max: 1
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '16px',
                                        width: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: '#548BF4'
                                    }}
                                />
                            )}
                        />
                        <span>{filters.expense_ratio[0]} - {filters.expense_ratio[1]}</span>
                    </div>
                    <div className="filter">
                        <label>Fund Size (Cr)</label>
                        <Range
                            values={filters.fund_size}
                            step={STEP}
                            min={MIN}
                            max={MAX}
                            onChange={(values) => handleRangeChange("fund_size", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.fund_size,
                                            colors: ['#ccc', '#548BF4', '#ccc'],
                                            min: MIN,
                                            max: MAX
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '16px',
                                        width: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: '#548BF4'
                                    }}
                                />
                            )}
                        />
                        <span>{filters.fund_size[0]} - {filters.fund_size[1]}</span>
                    </div>
                </div>
                <div className="filter-row">
                    <div className="filter">
                        <label>Returns 1 Year</label>
                        <Range
                            values={filters.return_1yr}
                            step={0.1}
                            min={0}
                            max={10}
                            onChange={(values) => handleRangeChange("return_1yr", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.return_1yr,
                                            colors: ['#ccc', '#548BF4', '#ccc'],
                                            min: 0,
                                            max: 10
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '16px',
                                        width: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: '#548BF4'
                                    }}
                                />
                            )}
                        />
                        <span>{filters.return_1yr[0]} - {filters.return_1yr[1]}</span>
                    </div>
                    <div className="filter">
                        <label>Returns 3 Years</label>
                        <Range
                            values={filters.return_3yr}
                            step={0.1}
                            min={0}
                            max={20}
                            onChange={(values) => handleRangeChange("return_3yr", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.return_3yr,
                                            colors: ['#ccc', '#548BF4', '#ccc'],
                                            min: 0,
                                            max: 20
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '16px',
                                        width: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: '#548BF4'
                                    }}
                                />
                            )}
                        />
                        <span>{filters.return_3yr[0]} - {filters.return_3yr[1]}</span>
                    </div>
                    <div className="filter">
                        <label>Returns 5 Years</label>
                        <Range
                            values={filters.return_5yr}
                            step={0.1}
                            min={0}
                            max={20}
                            onChange={(values) => handleRangeChange("return_5yr", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.return_5yr,
                                            colors: ['#ccc', '#548BF4', '#ccc'],
                                            min: 0,
                                            max: 20
                                        }),
                                    }}
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '16px',
                                        width: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: '#548BF4'
                                    }}
                                />
                            )}
                        />
                        <span>{filters.return_5yr[0]} - {filters.return_5yr[1]}</span>
                    </div>
                </div>
                <div className="filter">
                    <label>Category</label>
                    <select value={filters.category_name} onChange={handleCategoryChange}>
                        <option value="">All</option>
                        <option value="Debt">Debt</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>scheme Name</th>
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
                            <td>{item.scheme_name}</td>
                            <td>{item.min_sip}</td>
                            <td>{item.expense_ratio}</td>
                            <td>{item.fund_size}</td>
                            <td>{item.fund_manager}</td>
                            <td>{item.category_name}</td>
                            <td>{item.return_1yr}</td>
                            <td>{item.return_3yr}</td>
                            <td>{item.return_5yr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Calculate;
// filepath: src/pages/Calculate.js
import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";
import "./Calculate.css";

const STEP = 0.1;
const MIN = 0;
const MAX = 1000;

function Calculate() {
    const data = [
        {Scheme_name: "Aditya Birla SL Active Debt Multi-Mgr FoF-Dir Growth", min_sip : 100, expense_ratio: 0.27, fund_size_cr: 10, fund_manager:"Kaustubh Gupta", category: "Other", returns_1yr: 4, returns_3yr: 6.5, returns_5yr: 6.9 },
        {Scheme_name: "Baroda BNP Paribas Corporate Bond Fund", min_sip : 300, expense_ratio: 0.32, fund_size_cr: 17, fund_manager:"Mayank Prakash", category: "Debt", returns_1yr: 2.8, returns_3yr: 5.6, returns_5yr: 4.4 },
        {Scheme_name: "Canara Robeco Income Fund",min_sip: 1000,expense_ratio: 0.75,fund_size_cr: 125,fund_manager: "Avnish Jain",category: "Debt",returns_1yr: 3.9,returns_3yr: 5.8,returns_5yr: 7},
        {Scheme_name: "DSP Equity Savings Fund",min_sip: 500,expense_ratio: 0.4,fund_size_cr: 535,fund_manager: "Kedar Karnik",category: "Hybrid",returns_1yr: 4,returns_3yr: 14.6,returns_5yr: 7.8},
        {Scheme_name: "Edelweiss Balanced Advantage Fund",min_sip: 500,expense_ratio: 0.67,fund_size_cr: 108,fund_manager: "Bhavesh Jain",category: "Hybrid",returns_1yr: 7.5,returns_3yr: 9.6,returns_5yr: 5.7},
        {Scheme_name: "Franklin India Equity Savings Fund",min_sip: 500,expense_ratio: 0.9,fund_size_cr: 123,fund_manager: "Varun Sharma",category: "Hybrid",returns_1yr: 8.8,returns_3yr: 13.6,returns_5yr: 9.7},
        {Scheme_name: "HDFC Equity Savings Fund",min_sip: 500,expense_ratio: 0.6,fund_size_cr: 123,fund_manager: "Chirag Setalvad",category: "Debt",returns_1yr: 3.6,returns_3yr: 12.6,returns_5yr: 3.7},
        // Add more data as needed
    ];

    const [filters, setFilters] = useState({
        min_sip: [0, 1000],
        expense_ratio: [0, 1],
        fund_size_cr: [0, 1000],
        returns_1yr: [0, 10],
        returns_3yr: [0, 20],
        returns_5yr: [0, 20],
        category: "",
    });

    const handleRangeChange = (attribute, values) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [attribute]: values,
        }));
    };

    const handleCategoryChange = (e) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            category: e.target.value,
        }));
    };

    const filteredData = data.filter((item) => {
        return (
            item.min_sip >= filters.min_sip[0] &&
            item.min_sip <= filters.min_sip[1] &&
            item.expense_ratio >= filters.expense_ratio[0] &&
            item.expense_ratio <= filters.expense_ratio[1] &&
            item.fund_size_cr >= filters.fund_size_cr[0] &&
            item.fund_size_cr <= filters.fund_size_cr[1] &&
            item.returns_1yr >= filters.returns_1yr[0] &&
            item.returns_1yr <= filters.returns_1yr[1] &&
            item.returns_3yr >= filters.returns_3yr[0] &&
            item.returns_3yr <= filters.returns_3yr[1] &&
            item.returns_5yr >= filters.returns_5yr[0] &&
            item.returns_5yr <= filters.returns_5yr[1] &&
            (filters.category === "" || item.category === filters.category)
        );
    });

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
                            values={filters.fund_size_cr}
                            step={STEP}
                            min={MIN}
                            max={MAX}
                            onChange={(values) => handleRangeChange("fund_size_cr", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.fund_size_cr,
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
                        <span>{filters.fund_size_cr[0]} - {filters.fund_size_cr[1]}</span>
                    </div>
                </div>
                <div className="filter-row">
                    <div className="filter">
                        <label>Returns 1 Year</label>
                        <Range
                            values={filters.returns_1yr}
                            step={0.1}
                            min={0}
                            max={10}
                            onChange={(values) => handleRangeChange("returns_1yr", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.returns_1yr,
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
                        <span>{filters.returns_1yr[0]} - {filters.returns_1yr[1]}</span>
                    </div>
                    <div className="filter">
                        <label>Returns 3 Years</label>
                        <Range
                            values={filters.returns_3yr}
                            step={0.1}
                            min={0}
                            max={20}
                            onChange={(values) => handleRangeChange("returns_3yr", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.returns_3yr,
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
                        <span>{filters.returns_3yr[0]} - {filters.returns_3yr[1]}</span>
                    </div>
                    <div className="filter">
                        <label>Returns 5 Years</label>
                        <Range
                            values={filters.returns_5yr}
                            step={0.1}
                            min={0}
                            max={20}
                            onChange={(values) => handleRangeChange("returns_5yr", values)}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    style={{
                                        ...props.style,
                                        height: '6px',
                                        width: '100%',
                                        background: getTrackBackground({
                                            values: filters.returns_5yr,
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
                        <span>{filters.returns_5yr[0]} - {filters.returns_5yr[1]}</span>
                    </div>
                </div>
                <div className="filter">
                    <label>Category</label>
                    <select value={filters.category} onChange={handleCategoryChange}>
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
                            <td>{item.Scheme_name}</td>
                            <td>{item.min_sip}</td>
                            <td>{item.expense_ratio}</td>
                            <td>{item.fund_size_cr}</td>
                            <td>{item.fund_manager}</td>
                            <td>{item.category}</td>
                            <td>{item.returns_1yr}</td>
                            <td>{item.returns_3yr}</td>
                            <td>{item.returns_5yr}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Calculate;
import React from "react";
import PieChart from "../components/PieChart";
import NavGraph from "../components/NavGraph";
import "./Portfolio.css";

/**
 * Portfolio Component
 * 
 * Renders a portfolio view with a PieChart and NavGraph.
 * The chart data source is determined based on the scheme code.
 * 
 * @param {Object} parameters - Component parameters
 * @param {number} parameters.scheme_code - Unique scheme code for the portfolio
 * @param {string} parameters.schemename - Name of the scheme
 */
export default function Portfolio({ scheme_code, schemename }) {
  let querystr = "360funds";
  
  if (scheme_code === 148982) {
    querystr = "bluechipholdings";
    schemename = "Scheme Name 2";
  }

  return (
    <div className="portfolio-container">
      <div className="charts-container">
        <div className="pc-box">
          <PieChart querystr={querystr} schemename={schemename} />
        </div>
        <div className="nv-box">
          <NavGraph scheme_code={scheme_code} schemename={schemename} />
        </div>
      </div>
    </div>
  );
}

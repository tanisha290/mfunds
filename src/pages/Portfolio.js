import React, { useEffect, useState } from "react";
import axios from "axios";
import PieChart from "../components/PieChart"
import NavGraph from "../components/NavGraph"
import { schd } from "react-range/lib/utils";
import { useParams } from "react-router-dom";
import "./Portfolio.css";

export default function Portfolio(parameters){
    const scheme_code=parameters.scheme_code;
    const schemename=parameters.schemename;
    let querystr="360funds";
    if(scheme_code==148982) {querystr="bluechipholdings"; schemename="Scheme Name 2";}
    return <div className="portfolio-container">
    <div className="charts-container">
      <div className="pc-box">
      <PieChart querystr={querystr} schemename={schemename}/>
      </div>
      <div className="nv-box">
      <NavGraph scheme_code={scheme_code} schemename={schemename}/>
      </div>
    </div>
  </div>
}




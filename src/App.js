// filepath: src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import Calculate from "./pages/Calculate";
import Login from "./pages/Login";
import FundDetails from "./pages/FundDetails";
import Header from "./components/Header";
import Portfolio from "./pages/Portfolio";
import Personalize from "./pages/Personalize";
import NavGraph from "./components/NavGraph";
import "./styles.css"; 

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/calculate" element={<Calculate />} />
                <Route path="/login" element={<Login />} />
                <Route path="/fund/:fund_id" element={<FundDetails />} />
                <Route path="/portfolio/:scheme_code" element={<Portfolio />} />
                <Route path="/nav/:scheme_code" element={<NavGraph />} />
                <Route path="/personalize" element={<Personalize/>} />
            </Routes>
        </Router>
    );
}

export default App;
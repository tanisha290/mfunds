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


/**
 * App Component
 *
 * This component serves as the entry point of the React application.
 * It sets up routing using `react-router-dom` and defines different routes
 * for navigating between pages of the application.
 *
 * Routes:
 * - `/` (Home): Displays the homepage.
 * - `/compare` (Compare): Allows users to compare mutual funds.
 * - `/calculate` (Calculate): Provides investment calculation tools.
 * - `/login` (Login): Handles user authentication.
 * - `/fund/:fund_id` (FundDetails): Shows details of a specific mutual fund.
 * - `/portfolio/:scheme_code` (Portfolio): Displays user portfolio details.
 * - `/nav/:scheme_code` (NavGraph): Visualizes the NAV history of a mutual fund.
 * - `/personalize` (Personalize): Offers personalized investment recommendations.
 *
 * Components:
 * - `Header`: Displays the navigation bar.
 *
 * @returns {JSX.Element} The main application component with routing.
 */

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
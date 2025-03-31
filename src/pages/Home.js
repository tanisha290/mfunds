import React, { useState } from "react";
import Table from "../components/Table";

/**
 * Home Component
 * 
 * Displays a search input for filtering mutual funds and renders the Table component.
 * 
 * @returns {JSX.Element} The rendered Home component.
 */
function Home() {
    const [searchTerm, setSearchTerm] = useState("");

    /**
     * Handles changes in the search input field.
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <main>
                <input
                    type="text"
                    placeholder="Search Mutual Funds"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </main>
            
            <Table searchTerm={searchTerm} />
            
            <footer>
                <p>&copy; DESIS Group 11</p>
            </footer>
        </div>
    );
}

export default Home;
import React, { useState } from "react";
import Table from "../components/Table";

function Home() {
    const [searchTerm, setSearchTerm] = useState("");

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
                    width={100}
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

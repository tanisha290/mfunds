# InvestBuddy

InvestBuddy is a web-based mutual fund research and comparison tool that enables users to analyze, compare, and make informed decisions about mutual funds. It provides insights into fund performance, financial metrics, and portfolio details.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Major Functions](#major-functions)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Project Overview

InvestBuddy helps users research and compare mutual funds based on various parameters like NAV, risk, fees, and returns. Users can also authenticate themselves, save funds for later comparison, and get fund insights.

## Features

- **User Authentication**  
  - Sign-up, login, and password security.

- **Mutual Fund Data Retrieval**  
  - Fetch mutual fund details such as NAV, risk levels, and performance.

- **Fund Comparison**  
  - Compare multiple mutual funds side by side.

- **Portfolio Management**  
  - Users can choose the fund best suited for them.

---

## Technologies Used

- **Frontend**: React.js, Bootstrap
- **Backend**: Python (Flask)
- **Database**: MySQL
- **Deployment**: GitHub

---

## Prerequisites

- **Python 3.x** and `pip`
- **Node.js** and `npm`
- **MySQL** installed and running
- **Git** for version control

---

## Installation and Setup

1. **Clone the Repository**
   ```sh
   git clone https://github.com/tanisha290/investbuddy.git
   cd investbuddy
   ```

2. **Set Up Backend**
   ```sh
   pip install -r requirements.txt
   ```

3. **Set Up MySQL Database**
   ```sql
   CREATE DATABASE investbuddy_db;
   ```
   Import the database schema:
   ```sh
   mysql -u your_user -p investbuddy_db < database.sql
   ```

4. **Start Backend**
   ```sh
   python app.py
   ```

5. **Set Up Frontend**
   ```sh
   npm install
   npm start
   ```

---

## Project Structure

```
investbuddy/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── routes/
│   │   ├── auth.py
│   │   ├── funds.py
│   ├── utils/
│   │   ├── db.py
│   │   ├── helpers.py
│   ├── requirements.txt
│   ├── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   ├── package.json
│   ├── .env
├── database.sql
├── README.md
└── .gitignore
```

---

## API Endpoints

### **User Authentication**
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| POST   | `/api/login`  | Register or login user |

### **Mutual Fund Management**
| Method | Endpoint          | Description |
|--------|------------------|-------------|
| GET    | `/api/funds`     | Fetch all mutual funds |
| GET    | `/api/funds/<id>` | Fetch details of a specific fund |

---

## Major Functions

### **User Authentication Functions (`auth.py`)**

#### `register_user(data)`
- **Purpose**: Registers a new user.
- **Parameters**: `data` (dict) - User details.
- **Returns**: Success or failure response.

#### `login_user(email, password)`
- **Purpose**: Authenticates user and generates JWT token.
- **Parameters**: `email` (string), `password` (string)
- **Returns**: JWT token if credentials are valid.

---

### **Fund Data Management Functions (`funds.py`)**

#### `get_all_funds()`
- **Purpose**: Retrieves all mutual fund data from the database.
- **Returns**: JSON list of mutual fund details.

#### `get_fund_by_id(fund_id)`
- **Purpose**: Fetches details of a single mutual fund.
- **Parameters**: `fund_id` (int) - The ID of the mutual fund.
- **Returns**: JSON object with mutual fund details.

---

### **Database Utility Functions (`db.py`)**

#### `connect_db()`
- **Purpose**: Establishes a connection to the MySQL database.
- **Returns**: A database connection instance.

#### `execute_query(query, params=None)`
- **Purpose**: Executes an SQL query on the database.
- **Parameters**: `query` (string), `params` (optional tuple)
- **Returns**: Query results or success status.

---

## Database Schema
 

The database consists of multiple tables that store information about mutual funds, their performance, and user details. Below is a brief description of each table:  

### **Tables and Their Functionalities**  

- **`360funds`** – Stores details about various mutual funds, including name, sector, instrument type, and assets.  
- **`assestmanagementcompany`** – Contains information about asset management companies (AMCs) managing mutual funds.  
- **`boi_bluechip_holdings`** – Stores the portfolio holdings of the BOI Bluechip Fund, including asset distribution.  
- **`fund_category`** – Categorizes mutual funds into different categories and subcategories.  
- **`fund_details`** – Stores financial details of mutual funds, such as minimum SIP and lumpsum investment amounts.  
- **`fund_manager`** – Contains information about fund managers handling different mutual funds.  
- **`fund_performance`** – Tracks the historical performance of mutual funds based on date-wise return values.  
- **`mutual_fund`** – Stores general information about each mutual fund, including its name, type, and fund house.  
- **`nav`** – Maintains the Net Asset Value (NAV) of mutual funds over time.  
- **`returns`** – Stores return percentages of mutual funds over different time periods (1-year, 3-year, 5-year, etc.).  
- **`riskmetrics`** – Contains risk-related metrics such as volatility, Sharpe ratio, and beta for each mutual fund.  
- **`users`** – Stores user information, including name, email, and password for authentication.  


---

## Usage

1. Start the backend server:
   ```sh
   python backend/app.py
   ```
2. Start the frontend:
   ```sh
   npm start
   ```
3. Open `http://localhost:3000` in your browser.

---
## To run the unit tests:
1. Run the following command to run unit tests of app.py -
   ```sh
        python -m unittest tests/test_app.py
    ```
2. Run the following command to check pylint score - 
    ```sh
        python -m pylint app.py
    ```          
3. Pylint score is 9.75/10
4. Run the following command to check pyflakes score - 
    ```sh
        python -m pyflakes app.py
    ```

---
## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Submit a Pull Request.

---
## Disclaimer  

The data used in this project has been collected from various sources and may not always be accurate or up-to-date. Despite our best efforts, obtaining reliable and comprehensive data has been a challenge, and some inconsistencies may exist. 

---



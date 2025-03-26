from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Database connection
DATABASE_URL = "mysql+pymysql://root:Tanisha29123@localhost/temp2"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

@app.route('/')
def home():
    return "Welcome to the Mutual Funds Comparison Tool API!"

@app.route('/api/nav-history', methods=['GET'])
def get_nav_history():
    # Use a connection object to execute the query
    with engine.connect() as connection:
        result = connection.execute(text("SELECT DISTINCT scheme_name FROM nav order by scheme_name")).fetchall()
        nav_history = [dict(row._mapping) for row in result]  # Use row._mapping to convert to a dictionary
    return jsonify(nav_history)

@app.route('/api/fund-details', methods=['GET'])
def get_fund_details():
    with engine.connect() as connection:
        result = connection.execute(text("Select * from mutual_fund mf join fund_details fd on mf.fund_id=fd.fund_id join returns on mf.fund_id=returns.fund_id join fund_category fc on mf.fund_id=fc.fund_id join fund_manager fm on mf.fund_id=fm.fund_id;")).fetchall()
        print(result)  # Debugging: Log the raw query result
        fund_details = [dict(row._mapping) for row in result]
    return jsonify(fund_details)

if __name__ == "__main__":
    app.run(debug=True)
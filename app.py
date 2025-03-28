from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Database connection
DATABASE_URL = "mysql+pymysql://root:240305@localhost/temp2"
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

@app.route('/api/nav-comparison', methods=['GET'])
def get_nav_comparison():
    scheme_names = request.args.getlist('scheme_names')  # Get multiple scheme names from query parameters
    if not scheme_names:
        return jsonify({"error": "At least one scheme_name is required"}), 400

    # Dynamically generate placeholders for the IN clause
    placeholders = ', '.join([f':name{i}' for i in range(len(scheme_names))])
    params = {f'name{i}': scheme for i, scheme in enumerate(scheme_names)}

    with engine.connect() as connection:
        query = text(f"""
            SELECT scheme_name, date_latest, nav 
            FROM nav 
            WHERE scheme_name IN ({placeholders}) 
            ORDER BY date_latest
        """)
        result = connection.execute(query, params).fetchall()

        # Process the result into the desired format
        nav_data = {}
        for row in result:
            scheme = row.scheme_name
            if scheme not in nav_data:
                nav_data[scheme] = []
            nav_data[scheme].append({"date": row.date_latest.strftime('%Y-%m-%d'), "value": row.nav})

    return jsonify(nav_data)

@app.route('/api/returns-comparison', methods=['GET'])
def get_returns_comparison():
    scheme_names = request.args.getlist('scheme_names')  # Get multiple fund IDs from query parameters
    if not scheme_names:
        return jsonify({"error": "At least one scheme is required"}), 400

    # Dynamically generate placeholders for the IN clause
    placeholders = ', '.join([f':id{i}' for i in range(len(scheme_names))])
    params = {f'id{i}': scheme for i, scheme in enumerate(scheme_names)}

    with engine.connect() as connection:
        query = text(f"""
            SELECT scheme_name, date, return_value 
            FROM fund_performance2 
            WHERE scheme_name IN ({placeholders}) 
            ORDER BY date
        """)
        result = connection.execute(query, params).fetchall()

        # Process the result into the desired format
        returns_data = {}
        for row in result:
            scheme = row.scheme_name
            if scheme not in returns_data:
                returns_data[scheme] = []
            returns_data[scheme].append({"date": row.date.strftime('%Y-%m-%d'), "value": float(row.return_value)})

    return jsonify(returns_data)

if __name__ == "__main__":
    app.run(debug=True)
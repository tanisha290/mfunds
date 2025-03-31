"""
Flask API for Mutual Funds Comparison Tool.

This module provides a RESTful API for comparing mutual funds, retrieving NAV history,
fund details, and handling user authentication.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Database connection configuration
DATABASE_URL = "mysql+pymysql://root:240305@localhost:3306/temp2"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()


db = SQLAlchemy(app)


@app.route('/')
def home():
    """
    Root endpoint that returns a welcome message.
    
    Returns:
        str: Welcome message
    
    >>> home()
    'Welcome to the Mutual Funds Comparison Tool API!'
    """
    return "Welcome to the Mutual Funds Comparison Tool API!"


@app.route('/api/nav-history', methods=['GET'])
def get_nav_history():
    """
    Retrieve a list of all available mutual fund scheme names.
    
    Returns:
        JSON: Array of distinct scheme names from the nav table or error message
    
    Example:
        >>> # Example response format:
        >>> # [{"scheme_name": "Fund A"}, {"scheme_name": "Fund B"}]
    """
    try:
        # Use a connection object to execute the query
        with engine.connect() as connection:
            result = connection.execute(
                text("SELECT DISTINCT scheme_name FROM nav order by scheme_name")
            ).fetchall()
            # Use row._mapping to convert to a dictionary
            nav_history = [dict(row._mapping) for row in result]
        return jsonify(nav_history)
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": str(e)}), 500


@app.route('/api/fund-details', methods=['GET'])
def get_fund_details():
    """
    Retrieve comprehensive details of all mutual funds.
    
    Returns:
        JSON: Array of funds with their associated details or error message
    
    Example:
        >>> # Example response format:
        >>> # [{"fund_id": 1, "fund_name": "Fund A", "category": "Equity"},
        >>> #  {"fund_id": 2, "fund_name": "Fund B", "category": "Debt"}]
    """
    try:
        with engine.connect() as connection:
            query = """
                Select * from mutual_fund mf 
                join fund_details fd on mf.fund_id=fd.fund_id 
                join returns on mf.fund_id=returns.fund_id 
                join fund_category fc on mf.fund_id=fc.fund_id 
                join riskmetrics rkm on mf.fund_id=rkm.fund_id 
                join fund_manager fm on mf.fund_id=fm.fund_id;
            """
            result = connection.execute(text(query)).fetchall()
            print(result)  # Debugging: Log the raw query result
            fund_details = [dict(row._mapping) for row in result]  # pylint: disable=protected-access
        return jsonify(fund_details)
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": str(e)}), 500


@app.route('/api/single-fund-details', methods=['GET'])
def single_fund_details():
    """
    Retrieve detailed information for a specific mutual fund.
    
    Query Parameters:
        fund_id (str): The unique identifier of the fund.
        
    Returns:
        JSON: Fund details or error message
    
    Example:
        >>> # With missing fund_id, returns 400 error:
        >>> # {"error": "fund_id is required"}
        >>>
        >>> # With valid fund_id=1, returns fund details:
        >>> # {"fund_id": 1, "fund_name": "Fund A", "category": "Equity", ...}
    """
    print(request.args)
    fund_id = request.args.get('fund_id')

    if not fund_id:
        return jsonify({"error": "fund_id is required"}), 400

    try:
        with engine.connect() as connection:
            query = text("""
                SELECT * FROM mutual_fund mf
                JOIN fund_details fd ON mf.fund_id = fd.fund_id
                JOIN returns ON mf.fund_id = returns.fund_id
                JOIN fund_category fc ON mf.fund_id = fc.fund_id
                JOIN riskmetrics rkm on mf.fund_id=rkm.fund_id
                JOIN fund_manager fm ON mf.fund_id = fm.fund_id
                WHERE mf.fund_id = :fund_id;
            """)
            result = connection.execute(query, {"fund_id": fund_id}).fetchone()

            if not result:
                return jsonify({"error": "Fund not found"}), 404

            return jsonify(dict(result._mapping))  # pylint: disable=protected-access
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": str(e)}), 500


@app.route('/api/nav-comparison', methods=['GET'])
def get_nav_comparison():
    """
    Compare NAV values for multiple mutual fund schemes over time.
    
    Query Parameters:
        scheme_names (list): List of scheme names to compare.
        
    Returns:
        JSON: Comparison data or error message
    
    Example:
        >>> # Without scheme_names:
        >>> # {"error": "At least one scheme_name is required"}
        >>>
        >>> # With scheme_names=Fund1&scheme_names=Fund2:
        >>> # {
        >>> #   "Fund1": [
        >>> #     {"date": "2022-01-01", "value": 100.5},
        >>> #     {"date": "2022-01-02", "value": 101.2}
        >>> #   ],
        >>> #   "Fund2": [
        >>> #     {"date": "2022-01-01", "value": 50.75},
        >>> #     {"date": "2022-01-02", "value": 51.0}
        >>> #   ]
        >>> # }
    """
    scheme_names = request.args.getlist('scheme_names')
    if not scheme_names:
        return jsonify({"error": "At least one scheme_name is required"}), 400

    try:
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
                nav_data[scheme].append({
                    "date": row.date_latest.strftime('%Y-%m-%d'),
                    "value": row.nav
                })

        return jsonify(nav_data)
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": str(e)}), 500


@app.route('/api/returns-comparison', methods=['GET'])
def get_returns_comparison():
    """
    Compare returns for multiple mutual fund schemes over time.
    
    Query Parameters:
        scheme_names (list): List of scheme names to compare.
        
    Returns:
        JSON: Comparison data or error message
    
    Example:
        >>> # Without scheme_names:
        >>> # {"error": "At least one scheme is required"}
        >>>
        >>> # With scheme_names=Fund1&scheme_names=Fund2:
        >>> # {
        >>> #   "Fund1": [
        >>> #     {"date": "2022-01-01", "value": 10.5},
        >>> #     {"date": "2022-01-02", "value": 11.2}
        >>> #   ],
        >>> #   "Fund2": [
        >>> #     {"date": "2022-01-01", "value": 8.75},
        >>> #     {"date": "2022-01-02", "value": 9.0}
        >>> #   ]
        >>> # }
    """
    scheme_names = request.args.getlist('scheme_names')
    if not scheme_names:
        return jsonify({"error": "At least one scheme is required"}), 400

    try:
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
                returns_data[scheme].append({
                    "date": row.date.strftime('%Y-%m-%d'),
                    "value": float(row.return_value)
                })

        return jsonify(returns_data)
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": str(e)}), 500


# Model for 360funds Table
class Fund(db.Model):
    """
    SQLAlchemy model for the 360funds table.
    
    Attributes:
        id (int): Primary key.
        Name (str): Fund name.
        Sector (str): Investment sector.
        Instrument (str): Investment instrument type.
        Assets (str): Assets under management.
    """
    __tablename__ = "360funds"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(255))
    Sector = db.Column(db.String(100))
    Instrument = db.Column(db.String(50))
    Assets = db.Column(db.String(10))


# Model for bluechipholdings Table
class BlueChip(db.Model):
    """
    SQLAlchemy model for the boi_bluechip_holdings table.
    
    Attributes:
        id (int): Primary key.
        Name (str): Holding name.
        Sector (str): Business sector.
        Instrument (str): Investment instrument type.
        Assets (str): Percentage of assets.
    """
    __tablename__ = "boi_bluechip_holdings"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(255))
    Sector = db.Column(db.String(100))
    Instrument = db.Column(db.String(50))
    Assets = db.Column(db.String(10))


@app.route("/api/360funds", methods=["GET"])
def get_360funds():
    """
    Retrieve all records from the 360funds table.
    
    Returns:
        JSON: Array of all fund entries with their details or error message
    """
    try:
        funds = Fund.query.all()
        funds_list = [
            {
                "id": fund.id,
                "Name": fund.Name,
                "Sector": fund.Sector,
                "Instrument": fund.Instrument,
                "Assets": fund.Assets
            }
            for fund in funds
        ]
        return jsonify(funds_list)
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": str(e)}), 500


@app.route("/api/bluechipholdings", methods=["GET"])
def get_bluechipholdings():
    """
    Retrieve all records from the boi_bluechip_holdings table.
    
    Returns:
        JSON: Array of all bluechip holdings with their details or error message
    """
    try:
        bluechips = BlueChip.query.all()
        bluechips_list = [
            {
                "id": bluechip.id,
                "Name": bluechip.Name,
                "Sector": bluechip.Sector,
                "Instrument": bluechip.Instrument,
                "Assets": bluechip.Assets
            }
            for bluechip in bluechips
        ]
        return jsonify(bluechips_list)
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": str(e)}), 500


@app.route('/api/nav-details', methods=['GET'])
def get_nav_details():
    """
    Retrieve NAV history for a specific mutual fund scheme.
    
    Query Parameters:
        scheme_code (str): The unique code of the mutual fund scheme.
        
    Returns:
        JSON: NAV values with dates or error message
    """
    scheme_code = request.args.get('scheme_code')

    if not scheme_code:
        return jsonify({"error": "scheme_code is required"}), 400

    try:
        with db.engine.connect() as connection:
            query = text("""
                SELECT scheme_code, scheme_name, date_latest, nav
                FROM nav
                WHERE scheme_code = :scheme_code
                ORDER BY date_latest desc
            """)
            result = connection.execute(query, {"scheme_code": scheme_code}).fetchall()

            if not result:
                return jsonify({"error": "No entries found for this scheme_code"}), 404

            fund_details = [dict(row._mapping) for row in result]  # pylint: disable=protected-access
            return jsonify(fund_details)
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": str(e)}), 500


# Model for user table
class User(db.Model):
    """
    SQLAlchemy model for the Users table.
    
    Attributes:
        email (str): Primary key - user's email address.
        name (str): User's name.
        password (str): User's password.
    """
    __tablename__ = "Users"

    email = db.Column(db.String(255), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    password = db.Column(db.String(255), nullable=False)


@app.route('/api/login', methods=['POST'])
def login():
    """
    Handle user login or registration.
    
    Request Body:
        JSON: Contains name, email, and password.
        
    Returns:
        JSON: Welcome message or error message
    """
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"error": "Name, email, and password are required"}), 400

        try:
            # Check if the user already exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return jsonify({"message": f"Welcome back, {existing_user.name}!"})

            # Create a new user
            new_user = User(name=name, email=email, password=password)
            db.session.add(new_user)
            db.session.commit()

            return jsonify({"message": f"Welcome, {name}!"})
        except Exception as e:  # pylint: disable=broad-except
            db.session.rollback()
            return jsonify({"error": str(e)}), 500
    except Exception as e:  # pylint: disable=broad-except
        return jsonify({"error": "Invalid request format: " + str(e)}), 400

if __name__ == "__main__":
    # Run doctests if requested
    if 'doctest' in __import__('sys').argv:
        import doctest
        doctest.testmod()
    else:
        app.run(debug=True)

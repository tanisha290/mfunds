from flask import Flask, jsonify, request
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database connection
DATABASE_URL = "mysql+pymysql://root:mysql@127.0.0.1:3306/temp2"
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

db = SQLAlchemy(app)

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
        result = connection.execute(text("Select * from mutual_fund mf join fund_details fd on mf.fund_id=fd.fund_id join returns on mf.fund_id=returns.fund_id join fund_category fc on mf.fund_id=fc.fund_id join riskmetrics rkm on mf.fund_id=rkm.fund_id join fund_manager fm on mf.fund_id=fm.fund_id;")).fetchall()
        print(result)  # Debugging: Log the raw query result
        fund_details = [dict(row._mapping) for row in result]
    return jsonify(fund_details)

@app.route('/api/single-fund-details', methods=['GET'])
def single_fund_details():
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

            if result:
                return jsonify(dict(result._mapping)) 
            else:
                return jsonify({"error": "Fund not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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


# Model for 360funds Table
class Fund(db.Model):
    __tablename__ = "360funds"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(255))
    Sector = db.Column(db.String(100))
    Instrument = db.Column(db.String(50))
    Assets = db.Column(db.String(10))

#  Model for bluechipholdings Table
class BlueChip(db.Model):
    __tablename__ = "boi_bluechip_holdings"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(255))
    Sector = db.Column(db.String(100))
    Instrument = db.Column(db.String(50))
    Assets = db.Column(db.String(10))

#  API to Fetch Data from 360funds
@app.route("/api/360funds", methods=["GET"])
def get_360funds():
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

#  API to Fetch Data from bluechipholdings
@app.route("/api/bluechipholdings", methods=["GET"])
def get_bluechipholdings():
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


@app.route('/api/nav-details', methods=['GET'])
def get_nav_details():
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

            if result:
                fund_details = [dict(row._mapping) for row in result]
                return jsonify(fund_details)
            else:
                return jsonify({"error": "No entries found for this scheme_code"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(debug=True)
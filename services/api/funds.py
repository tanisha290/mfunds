"""
API endpoints for fund-related operations.
"""

from   sqlalchemy    import text
from   flask         import jsonify, request
from   models.models import Fund, BlueChip
from   db.database   import engine


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

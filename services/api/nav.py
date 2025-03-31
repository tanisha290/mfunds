"""
API endpoints for NAV-related operations.
"""


from   flask       import jsonify, request
from   sqlalchemy  import text
from   db.database import engine, db


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

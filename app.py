"""
Flask API for Mutual Funds Comparison Tool.

This module provides a RESTful API for comparing mutual funds, retrieving NAV history,
fund details, and handling user authentication.
"""

from    flask              import Flask
from    flask_cors         import CORS
from    db.database        import init_app
from    services.api.auth  import login
from    services.api.funds import (get_fund_details, single_fund_details, \
                                   get_returns_comparison, get_360funds, \
                                   get_bluechipholdings)
from    services.api.home  import home
from    services.api.nav   import get_nav_history, get_nav_comparison, get_nav_details


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize database
init_app(app)


# Register routes
app.route('/')(home)
app.route('/api/nav-history', methods=['GET'])(get_nav_history)
app.route('/api/fund-details', methods=['GET'])(get_fund_details)
app.route('/api/single-fund-details', methods=['GET'])(single_fund_details)
app.route('/api/nav-comparison', methods=['GET'])(get_nav_comparison)
app.route('/api/returns-comparison', methods=['GET'])(get_returns_comparison)
app.route('/api/360funds', methods=['GET'])(get_360funds)
app.route('/api/bluechipholdings', methods=['GET'])(get_bluechipholdings)
app.route('/api/nav-details', methods=['GET'])(get_nav_details)
app.route('/api/login', methods=['POST'])(login)


if __name__ == "__main__":
    # Run doctests if requested
    if 'doctest' in __import__('sys').argv:
        import doctest
        doctest.testmod()
    else:
        app.run(debug=True)

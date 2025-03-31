"""
API endpoints for authentication operations.
"""

from    db.database   import db
from    flask         import jsonify, request
from    models.models import User


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

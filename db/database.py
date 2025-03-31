"""
Database connection utilities for the Mutual Funds Comparison Tool.
"""

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config.constants import DATABASE_URL

# Initialize SQLAlchemy instance
db = SQLAlchemy()

# Create engine and session
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()


def init_app(app):
    """
    Initialize the Flask app with the database configuration.
    
    Args:
        app: Flask application instance
    """
    app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
    db.init_app(app)

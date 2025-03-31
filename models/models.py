"""
SQLAlchemy models for the Mutual Funds Comparison Tool.
"""

from db.database import db


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

"""
API endpoint for the homepage.
"""


def home():
    """
    Root endpoint that returns a welcome message.
    
    Returns:
        str: Welcome message
    
    >>> home()
    'Welcome to the Mutual Funds Comparison Tool API!'
    """
    return "Welcome to the Mutual Funds Comparison Tool API!"

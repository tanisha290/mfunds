import unittest
from unittest.mock import patch, MagicMock
import json
from datetime import datetime
from app import app
from models.models import Fund, BlueChip, User
from db.database import db, engine

class TestApp(unittest.TestCase):
   """Test cases for the Mutual Funds Comparison Tool API"""


   def setUp(self):
       """Set up test client and other test variables"""
       self.app = app.test_client()
       self.app.testing = True
       # Configure app for testing
       app.config['TESTING'] = True
       app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///:memory:"
       # Create application context
       self.app_context = app.app_context()
       self.app_context.push()


   def tearDown(self):
       """Clean up after tests"""
       # Pop application context
       self.app_context.pop()


   def test_home_endpoint(self):
       """Test the home endpoint returns correct welcome message"""
       response = self.app.get('/')
       self.assertEqual(response.status_code, 200)
       self.assertEqual(response.data.decode('utf-8'),
                        'Welcome to the Mutual Funds Comparison Tool API!')


   @patch('db.database.engine.connect')
   def test_nav_history(self, mock_connect):
       """Test retrieving NAV history"""
       # Mock the database connection
       mock_conn = MagicMock()
       mock_connect.return_value.__enter__.return_value = mock_conn
      
       # Create mock result
       mock_row1 = MagicMock()
       mock_row1._mapping = {'scheme_name': 'Fund 1'}
       mock_row2 = MagicMock()
       mock_row2._mapping = {'scheme_name': 'Fund 2'}
       mock_result = [mock_row1, mock_row2]
      
       # Setup the mock to return our data
       mock_conn.execute.return_value.fetchall.return_value = mock_result
      
       # Make the request
       response = self.app.get('/api/nav-history')
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(len(data), 2)
       self.assertEqual(data[0]['scheme_name'], 'Fund 1')
       self.assertEqual(data[1]['scheme_name'], 'Fund 2')


   @patch('db.database.engine.connect')
   def test_fund_details(self, mock_connect):
       """Test retrieving all fund details"""
       # Mock the database connection
       mock_conn = MagicMock()
       mock_connect.return_value.__enter__.return_value = mock_conn
      
       # Create mock result
       mock_row = MagicMock()
       mock_row._mapping = {
           'fund_id': 1,
           'fund_name': 'Test Fund',
           'aum': '1000 Cr'
       }
       mock_conn.execute.return_value.fetchall.return_value = [mock_row]
      
       # Make the request
       response = self.app.get('/api/fund-details')
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(len(data), 1)
       self.assertEqual(data[0]['fund_id'], 1)
       self.assertEqual(data[0]['fund_name'], 'Test Fund')


   @patch('db.database.engine.connect')
   def test_single_fund_details_success(self, mock_connect):
       """Test retrieving details for a specific fund"""
       # Mock the database connection
       mock_conn = MagicMock()
       mock_connect.return_value.__enter__.return_value = mock_conn
      
       # Create mock result
       mock_row = MagicMock()
       mock_row._mapping = {
           'fund_id': 1,
           'fund_name': 'Test Fund',
           'aum': '1000 Cr'
       }
       mock_conn.execute.return_value.fetchone.return_value = mock_row
      
       # Make the request
       response = self.app.get('/api/single-fund-details?fund_id=1')
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['fund_id'], 1)
       self.assertEqual(data['fund_name'], 'Test Fund')


   def test_single_fund_details_missing_id(self):
       """Test fund details fails with missing fund_id"""
       response = self.app.get('/api/single-fund-details')
       self.assertEqual(response.status_code, 400)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['error'], 'fund_id is required')


   @patch('db.database.engine.connect')
   def test_single_fund_details_not_found(self, mock_connect):
       """Test retrieving a non-existent fund"""
       # Mock the database connection
       mock_conn = MagicMock()
       mock_connect.return_value.__enter__.return_value = mock_conn
      
       # Return None to simulate no fund found
       mock_conn.execute.return_value.fetchone.return_value = None
      
       # Make the request
       response = self.app.get('/api/single-fund-details?fund_id=999')
      
       # Verify response
       self.assertEqual(response.status_code, 404)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['error'], 'Fund not found')


   def test_nav_comparison_missing_scheme(self):
       """Test NAV comparison fails with missing scheme names"""
       response = self.app.get('/api/nav-comparison')
       self.assertEqual(response.status_code, 400)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['error'], 'At least one scheme_name is required')


   @patch('db.database.engine.connect')
   def test_nav_comparison_success(self, mock_connect):
       """Test NAV comparison with valid scheme names"""
       # Mock the database connection
       mock_conn = MagicMock()
       mock_connect.return_value.__enter__.return_value = mock_conn
      
       # Create mock result
       today = datetime.now()
       mock_row1 = MagicMock()
       mock_row1.scheme_name = 'Fund 1'
       mock_row1.date_latest = today
       mock_row1.nav = 100.50
      
       mock_row2 = MagicMock()
       mock_row2.scheme_name = 'Fund 1'
       mock_row2.date_latest = today
       mock_row2.nav = 105.75
      
       mock_conn.execute.return_value.fetchall.return_value = [mock_row1, mock_row2]
      
       # Make the request
       response = self.app.get('/api/nav-comparison?scheme_names=Fund 1&scheme_names=Fund 2')
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertIn('Fund 1', data)
       self.assertEqual(len(data['Fund 1']), 2)


   def test_returns_comparison_missing_scheme(self):
       """Test returns comparison fails with missing scheme names"""
       response = self.app.get('/api/returns-comparison')
       self.assertEqual(response.status_code, 400)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['error'], 'At least one scheme is required')


   @patch('models.models.Fund.query')
   def test_360funds(self, mock_query):
       """Test retrieving data from 360funds table"""
       # Mock Fund.query.all()
       fund1 = Fund(id=1, Name='Fund A', Sector='Technology', Instrument='Equity', Assets='1000')
       fund2 = Fund(id=2, Name='Fund B', Sector='Finance', Instrument='Debt', Assets='2000')
       mock_query.all.return_value = [fund1, fund2]
      
       # Make the request
       response = self.app.get('/api/360funds')
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(len(data), 2)
       self.assertEqual(data[0]['Name'], 'Fund A')
       self.assertEqual(data[1]['Name'], 'Fund B')


   @patch('models.models.BlueChip.query')
   def test_bluechipholdings(self, mock_query):
       """Test retrieving data from bluechipholdings table"""
       # Mock BlueChip.query.all()
       chip1 = BlueChip(id=1, Name='HDFC', Sector='Banking', Instrument='Equity', Assets='12%')
       chip2 = BlueChip(id=2, Name='Reliance', Sector='Energy', Instrument='Equity', Assets='10%')
       mock_query.all.return_value = [chip1, chip2]
      
       # Make the request
       response = self.app.get('/api/bluechipholdings')
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(len(data), 2)
       self.assertEqual(data[0]['Name'], 'HDFC')
       self.assertEqual(data[1]['Name'], 'Reliance')


   def test_nav_details_missing_code(self):
       """Test NAV details fails with missing scheme code"""
       response = self.app.get('/api/nav-details')
       self.assertEqual(response.status_code, 400)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['error'], 'scheme_code is required')


   @patch('db.database.db.engine.connect')
   def test_nav_details_success(self, mock_connect):
       """Test NAV details with valid scheme code"""
       # Mock the database connection
       mock_conn = MagicMock()
       mock_connect.return_value.__enter__.return_value = mock_conn
      
       # Create mock result
       today = datetime.now()
       mock_row = MagicMock()
       mock_row._mapping = {
           'scheme_code': '12345',
           'scheme_name': 'Test Scheme',
           'date_latest': today,
           'nav': 125.75
       }
       mock_conn.execute.return_value.fetchall.return_value = [mock_row]
      
       # Make the request
       response = self.app.get('/api/nav-details?scheme_code=12345')
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(len(data), 1)
       self.assertEqual(data[0]['scheme_code'], '12345')
       self.assertEqual(data[0]['scheme_name'], 'Test Scheme')


   @patch('db.database.db.engine.connect')
   def test_nav_details_not_found(self, mock_connect):
       """Test NAV details with invalid scheme code"""
       # Mock the database connection
       mock_conn = MagicMock()
       mock_connect.return_value.__enter__.return_value = mock_conn
      
       # Return empty list to simulate no scheme found
       mock_conn.execute.return_value.fetchall.return_value = []
      
       # Make the request
       response = self.app.get('/api/nav-details?scheme_code=nonexistent')
      
       # Verify response
       self.assertEqual(response.status_code, 404)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['error'], 'No entries found for this scheme_code')


   def test_login_missing_data(self):
       """Test login fails with missing data"""
       response = self.app.post('/api/login', json={})
       self.assertEqual(response.status_code, 400)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['error'], 'No JSON data provided')


   def test_login_missing_fields(self):
       """Test login fails with missing required fields"""
       response = self.app.post('/api/login', json={'name': 'Test'})
       self.assertEqual(response.status_code, 400)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['error'], 'Name, email, and password are required')


   @patch('models.models.User.query')
   @patch('db.database.db.session')
   def test_login_existing_user(self, mock_session, mock_query):
       """Test login with existing user"""
       # Mock User.query.filter_by().first()
       user = User(email='test@example.com', name='Test User', password='password123')
       mock_query.filter_by.return_value.first.return_value = user
      
       # Make the request
       response = self.app.post('/api/login',
                                json={'name': 'Test User',
                                      'email': 'test@example.com',
                                      'password': 'password123'})
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['message'], 'Welcome back, Test User!')
      
       # Verify db.session wasn't called (no new user created)
       mock_session.add.assert_not_called()
       mock_session.commit.assert_not_called()


   @patch('models.models.User.query')
   @patch('db.database.db.session')
   def test_login_new_user(self, mock_session, mock_query):
       """Test login with new user"""
       # Mock User.query.filter_by().first() to return None (no existing user)
       mock_query.filter_by.return_value.first.return_value = None
      
       # Make the request
       response = self.app.post('/api/login',
                                json={'name': 'New User',
                                      'email': 'new@example.com',
                                      'password': 'newpass123'})
      
       # Verify response
       self.assertEqual(response.status_code, 200)
       data = json.loads(response.data.decode('utf-8'))
       self.assertEqual(data['message'], 'Welcome, New User!')
      
       # Verify db.session was called to add new user
       mock_session.add.assert_called_once()
       mock_session.commit.assert_called_once()




if __name__ == '__main__':
   unittest.main()





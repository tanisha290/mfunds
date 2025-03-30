import unittest
from app import app
import json
from unittest.mock import patch, MagicMock

class TestMutualFundsAPI(unittest.TestCase):
    def setUp(self):
        """Set up test client and other test variables"""
        self.app = app.test_client()
        self.app.testing = True

    def test_home_endpoint(self):
        """Test the home endpoint"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.decode('utf-8'), "Welcome to the Mutual Funds Comparison Tool API!")

    @patch('app.engine.connect')
    def test_nav_history_endpoint(self, mock_connect):
        """Test the nav-history endpoint"""
        # Mock the database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connection.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [{'scheme_name': 'Test Fund'}]
        mock_connect.return_value = mock_connection

        response = self.app.get('/api/nav-history')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        if len(data) > 0:
            self.assertIn('scheme_name', data[0])

    @patch('app.engine.connect')
    def test_fund_details_endpoint(self, mock_connect):
        """Test the fund-details endpoint"""
        # Mock the database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connection.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [{
            'scheme_name': 'Test Fund',
            'min_sip': '500',
            'expense_ratio': 0.5,
            'fund_size': '1000 Cr',
            'manager_name': 'Test Manager',
            'category_name': 'Test Category',
            'return_1yr': '10%',
            'return_3yr': '15%',
            'return_5yr': '20%'
        }]
        mock_connect.return_value = mock_connection

        response = self.app.get('/api/fund-details')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        if len(data) > 0:
            expected_fields = ['scheme_name', 'min_sip', 'expense_ratio', 'fund_size', 
                              'manager_name', 'category_name', 'return_1yr', 'return_3yr', 'return_5yr']
            for field in expected_fields:
                self.assertIn(field, data[0])

    def test_nav_comparison_endpoint_without_params(self):
        """Test the nav-comparison endpoint without parameters"""
        response = self.app.get('/api/nav-comparison')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data['error'], "At least one scheme_name is required")

    @patch('app.engine.connect')
    def test_nav_comparison_endpoint_with_params(self, mock_connect):
        """Test the nav-comparison endpoint with valid parameters"""
        # Mock the database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connection.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [
            {'scheme_name': 'Test Fund 1', 'date': '2024-01-01', 'nav': 100},
            {'scheme_name': 'Test Fund 2', 'date': '2024-01-01', 'nav': 200}
        ]
        mock_connect.return_value = mock_connection

        response = self.app.get('/api/nav-comparison?scheme_names=Test%20Fund%201&scheme_names=Test%20Fund%202')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)

    def test_returns_comparison_endpoint_without_params(self):
        """Test the returns-comparison endpoint without parameters"""
        response = self.app.get('/api/returns-comparison')
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data['error'], "At least one scheme is required")

    @patch('app.engine.connect')
    def test_returns_comparison_endpoint_with_params(self, mock_connect):
        """Test the returns-comparison endpoint with valid parameters"""
        # Mock the database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connection.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [
            {'scheme_name': 'Test Fund 1', 'date': '2024-01-01', 'returns': 10},
            {'scheme_name': 'Test Fund 2', 'date': '2024-01-01', 'returns': 20}
        ]
        mock_connect.return_value = mock_connection

        response = self.app.get('/api/returns-comparison?scheme_names=Test%20Fund%201&scheme_names=Test%20Fund%202')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)

    def test_invalid_endpoint(self):
        """Test accessing an invalid endpoint"""
        response = self.app.get('/invalid-endpoint')
        self.assertEqual(response.status_code, 404)

    @patch('app.engine.connect')
    def test_nav_comparison_data_structure(self, mock_connect):
        """Test the structure of nav-comparison response data"""
        # Mock the database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connection.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [
            {'scheme_name': 'Test Fund', 'date': '2024-01-01', 'nav': 100}
        ]
        mock_connect.return_value = mock_connection

        response = self.app.get('/api/nav-comparison?scheme_names=Test%20Fund')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        if len(data) > 0:
            scheme_name = list(data.keys())[0]
            self.assertIsInstance(data[scheme_name], list)
            if len(data[scheme_name]) > 0:
                self.assertIn('date', data[scheme_name][0])
                self.assertIn('value', data[scheme_name][0])

    @patch('app.engine.connect')
    def test_returns_comparison_data_structure(self, mock_connect):
        """Test the structure of returns-comparison response data"""
        # Mock the database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connection.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [
            {'scheme_name': 'Test Fund', 'date': '2024-01-01', 'returns': 10}
        ]
        mock_connect.return_value = mock_connection

        response = self.app.get('/api/returns-comparison?scheme_names=Test%20Fund')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        if len(data) > 0:
            scheme_name = list(data.keys())[0]
            self.assertIsInstance(data[scheme_name], list)
            if len(data[scheme_name]) > 0:
                self.assertIn('date', data[scheme_name][0])
                self.assertIn('value', data[scheme_name][0])

    @patch('app.engine.connect')
    def test_fund_details_data_types(self, mock_connect):
        """Test the data types of fund details response"""
        # Mock the database connection and cursor
        mock_connection = MagicMock()
        mock_cursor = MagicMock()
        mock_connection.__enter__.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [{
            'scheme_name': 'Test Fund',
            'min_sip': '500',
            'expense_ratio': 0.5,
            'fund_size': '1000 Cr',
            'manager_name': 'Test Manager',
            'category_name': 'Test Category',
            'return_1yr': '10%',
            'return_3yr': '15%',
            'return_5yr': '20%'
        }]
        mock_connect.return_value = mock_connection

        response = self.app.get('/api/fund-details')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        if len(data) > 0:
            fund = data[0]
            self.assertIsInstance(fund['scheme_name'], str)
            self.assertIsInstance(fund['min_sip'], str)
            self.assertIsInstance(fund['expense_ratio'], (int, float))
            self.assertIsInstance(fund['fund_size'], str)
            self.assertIsInstance(fund['manager_name'], str)
            self.assertIsInstance(fund['category_name'], str)
            self.assertIsInstance(fund['return_1yr'], str)
            self.assertIsInstance(fund['return_3yr'], str)
            self.assertIsInstance(fund['return_5yr'], str)

if __name__ == '__main__':
    unittest.main() 
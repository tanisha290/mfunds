import axios from 'axios';

// Action Types
export const FETCH_NAV_HISTORY_SUCCESS = 'FETCH_NAV_HISTORY_SUCCESS';
export const FETCH_FUND_DETAILS_SUCCESS = 'FETCH_FUND_DETAILS_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

// Action Creators
export const fetchNavHistory = () => async (dispatch) => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/api/nav-history');
        dispatch({
            type: FETCH_NAV_HISTORY_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_DATA_FAILURE,
            payload: error.message,
        });
    }
};

export const fetchFundDetails = () => async (dispatch) => {
    try {
        const response = await axios.get('http://127.0.0.1:5000/api/fund-details');
        dispatch({
            type: FETCH_FUND_DETAILS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_DATA_FAILURE,
            payload: error.message,
        });
    }
};
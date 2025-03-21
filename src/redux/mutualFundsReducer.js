import {
    FETCH_NAV_HISTORY_SUCCESS,
    FETCH_FUND_DETAILS_SUCCESS,
    FETCH_DATA_FAILURE,
} from '../actions/mutualFundsActions';

const initialState = {
    navHistory: [],
    fundDetails: [],
    error: null,
};

const mutualFundsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NAV_HISTORY_SUCCESS:
            return {
                ...state,
                navHistory: action.payload,
            };
        case FETCH_FUND_DETAILS_SUCCESS:
            return {
                ...state,
                fundDetails: action.payload,
            };
        case FETCH_DATA_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default mutualFundsReducer;
import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk"; // Use named import for thunk
import mutualFundsReducer from "./mutualFundsReducer";

const rootReducer = combineReducers({
    mutualFunds: mutualFundsReducer, // Add the mutual funds reducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
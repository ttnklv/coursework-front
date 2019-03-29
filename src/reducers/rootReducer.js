import {combineReducers} from "redux";
import pointsReducer from "./pointsReducer";
import loginReducer from './loginReducer';
import infoReducer from "./infoReducer"
import reviewReducer from "./reviewReducer"


export default combineReducers({
    pointsReducer,
    loginReducer,
    infoReducer,
    reviewReducer
});
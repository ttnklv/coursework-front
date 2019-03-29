import {SET_INFO} from "../actions/setInfo";

export default function infoReducer(state = [], action = {}) {
    switch (action.type) {
        case SET_INFO:
            return {
                info: action.info
            };
        default:
            return state;
    }
}
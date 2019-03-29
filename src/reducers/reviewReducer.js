import {SET_REVIEW} from "../actions/setReview";

export default function reviewReducer(state = [], action = {}) {
    switch (action.type) {
        case SET_REVIEW:
            return {
                review: action.review
            };
        default: return state;
    }
}
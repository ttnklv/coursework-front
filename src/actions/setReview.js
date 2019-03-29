export const SET_REVIEW = 'SET_REVIEW';

export function setReview(rev) {
    return{
        type: SET_REVIEW,
        review: rev
    }
}
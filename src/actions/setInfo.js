export const SET_INFO = 'SET_INFO';

export function setInfo(infoData) {
    return{
        type: SET_INFO,
        info: infoData
    }
}
export const initialState = null

export const reducer = (state, action) => {

    if (action.type === "USER") {
        return action.payload
    }
    if (action.type === "LOGOUT") {
        return null
    }
    if (action.type === "UPDATE_PHOTO") {
        return {
            ...state,
            photo: action.payload.photo
        }
    }

    return state
}
import { GLOBALTYPES } from "../actions/globalTypes"
import { getDataAPI } from "../../utils/fetchData"

export const SUGGES_TYPE = {
    LOADING: 'LOADING_SUGGES',
    GET_USERS: 'GET_USERS_SUGGES',

}

export const getSuggestions = (token) => async (dispatch) => {
    try {
        dispatch({type: SUGGES_TYPE.LOADING, payload: true})

        const res = await getDataAPI('suggestionsUser',token)

        dispatch({type: SUGGES_TYPE.GET_USERS, payload: res.data})

        dispatch({type: SUGGES_TYPE.LOADING, payload: false})


    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
    }
}
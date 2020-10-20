export const initialState = {
    user: null,
};

export const Action_Types = {
     
    SET_USER : "SET_USER",
};

export const reducer = (state,action)=>
{
    switch (action.type) {
        case Action_Types.SET_USER : 
        return {
            ...state , 
            user : action.user,
        }
        default: return state;
    }

}
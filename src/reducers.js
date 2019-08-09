export default function(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS") {
        state = {
            ...state,
            users: action.users
        };
    }
    if (action.type == "ACCEPT_REQUEST") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    accepted: true
                };
            })
        };
    }
    if (action.type == "CANCEL_REQUEST") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    cancelled: true
                };
            })
        };
    }
    if (action.type == "END_FRIENDSHIP") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    user: null
                };
            })
        };
    }

    if (action.type == "NEW_CHAT_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.msg]
        };
    }

    if (action.type == "CHAT_MESSAGES") {
        console.log("inside action");
        state = {
            ...state,
            chatMessages: action.msgs
        };
    }
    if (action.type == "NEW_PRIVATE_MESSAGE") {
        state = {
            ...state
        };
        return {
            ...state,
            pm: state.pm ? [...state.pm, action.pm] : [action.pm]
        };
    }

    if(action.type == 'NEW_WALL_POST') {
        state = {
            ...state,
            post: [...state.post, action.post]
        };
    }

    if(action.type == 'OLD_WALL_POST') {
        state = {
            ...state,
            post: action.post
        };
    }


    return state;
}

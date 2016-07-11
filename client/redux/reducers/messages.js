const initialState = {
  list: []
};

export const ADD_MESSAGE = 'messages/ADD_MESSAGE';
export const addMessage = (message) => {
  return {
    message,
    type: ADD_MESSAGE
  };
};

export const DELETE_MESSAGE = 'messages/DELETE_MESSAGE';
export const deleteMessage = (index) => {
  return {
    index,
    type: DELETE_MESSAGE
  };
};

export const CLEAR_MESSAGES = 'messages/CLEAR_MESSAGES';
export const clearMessages = () => {
  return {
    type: CLEAR_MESSAGES
  };
};

/* Messages reducer */
export const messages = (state = initialState, action) => {
  let newMessages = state.list.slice();
  switch (action.type) {
    case ADD_MESSAGE:
      newMessages.push(action.message);
      return {
        ...state,
        list: newMessages
      };
    case DELETE_MESSAGE:
      newMessages.splice(action.index, 1);
      return {
        ...state,
        list: newMessages
      };
    case CLEAR_MESSAGES:
      return {
        ...state,
        list: []
      };
    default:
      return state;
  }
};
const initialState = {
  list: [],
  activeQuestion: 0,
  error: null
};

export const ADD_QUESTIONS_SUCCESS = 'questions/ADD_QUESTIONS_SUCCESS';
export const ADD_QUESTIONS_ERROR = 'questions/ADD_QUESTIONS_ERROR';

export const addQuestions = () => {
  return dispatch => {
    fetch('/resources/questions.json')
      .then(data => data.json())
      .then(data => {
        return dispatch({
          questions: data.questions,
          type: ADD_QUESTIONS_SUCCESS
        });
      })
      .catch(err => {
        return dispatch({
          err,
          type: ADD_QUESTIONS_ERROR
        });
      });
  };
};

export const SET_QUESTION = 'questions/SET_QUESTION';

export const setQuestion = (num) => {
  return {
    num,
    type: SET_QUESTION
  };
}

/* questions reducer */
export const questions = (state = initialState, action) => {
  switch (action.type) {
    case ADD_QUESTIONS_SUCCESS:
      return {
        ...state,
        list: action.questions
      };
    case ADD_QUESTIONS_ERROR:
      return {
        ...state,
        error: action.err
      };
    case SET_QUESTION:
      return {
        ...state,
        activeQuestion: action.num
      };
    default:
      return state;
  }
};
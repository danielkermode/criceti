function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const bounds = { x: 274, y: 132 };

const initialState = {
  bounds,
  all: {},
  username: '',
  room: '',
  id: '',
  challenging: '',
  startCoords: { x: getRandomInt(6, bounds.x), y: getRandomInt(6, bounds.y) }
};

export const ADD_HAMSTER = 'hamsters/ADD_HAMSTER';
export const addHamster = (hamster) => {
  return {
    hamster,
    type: ADD_HAMSTER
  };
};

export const DELETE_HAMSTER = 'hamsters/DELETE_HAMSTER';
export const deleteHamster = (name) => {
  return {
    name,
    type: DELETE_HAMSTER
  };
};

export const UPDATE_COORDS = 'hamsters/UPDATE_COORDS';
export const updateCoords = (name, coords) => {
  return {
    name,
    coords,
    type: UPDATE_COORDS
  };
};

export const CLEAR_HAMSTERS = 'hamsters/CLEAR_HAMSTERS';
export const clearHamsters = () => {
  return {
    type: CLEAR_HAMSTERS
  };
};

export const SET_USERNAME = 'hamsters/SET_USERNAME';
export const setUsername = (username) => {
  return {
    username,
    type: SET_USERNAME
  };
};

export const SET_ROOM = 'hamsters/SET_ROOM';
export const setRoom = (room) => {
  return {
    room,
    type: SET_ROOM
  };
};

export const SET_ID = 'hamsters/SET_ID';
export const setId = (id) => {
  return {
    id,
    type: SET_ID
  };
};

export const SET_CHALLENGING = 'hamsters/SET_CHALLENGING';
export const setChallenging = (name) => {
  return {
    name,
    type: SET_CHALLENGING
  };
};

/* hamsters reducer */
export const hamsters = (state = initialState, action) => {
  let newHamsters = state.all;
  switch (action.type) {
    case ADD_HAMSTER:
      newHamsters[action.hamster.name] = action.hamster;
      return {
        ...state,
        all: newHamsters
      };
    case DELETE_HAMSTER:
      delete newHamsters[action.name];
      return {
        ...state,
        all: newHamsters
      };
    case UPDATE_COORDS:
      newHamsters[action.name].x = action.coords.x;
      newHamsters[action.name].y = action.coords.y;
      return {
        ...state,
        all: newHamsters
      };
    case CLEAR_HAMSTERS:
      return {
        ...state,
        all: {}
      };
    case SET_USERNAME:
      return {
        ...state,
        username: action.username
      };
    case SET_ROOM:
      return {
        ...state,
        room: action.room
      };
    case SET_ID:
      return {
        ...state,
        id: action.id
      };
    case SET_CHALLENGING:
      return {
        ...state,
        challenging: action.name
      };

    default:
      return state;
  }
};
import * as types from './types';

const initialState = {
  loading: false,
  movies: {},
  idsMovieList: [],
  idMovieSelected: null,
  queries: {},
  favorites: [],
};

const LibraryReducers = (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_FAVORITES:
      return {
        ...state,
        favorites: action.payload,
      };
    case types.UPDATE_MOVIES_LIST:
      return {
        ...state,
        idsMovieList: action.payload,
      };
    case types.UPDATE_MOVIE_SELECTED:
      return {
        ...state,
        idMovieSelected: action.payload,
      };
    case types.LOAD_MOVIES_REQUEST:
      return { ...state, loading: true };
    case types.LOAD_MOVIES_SUCCESS:
      return {
        ...state,
        loading: false,
        movies: action.payload.movies,
        idsMovieList: action.payload.idsMovieList,
        idMovieSelected: null,
        queries: action.payload.queries,
      };
    case types.LOAD_MOVIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default LibraryReducers;

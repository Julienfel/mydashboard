/* eslint import/prefer-default-export: 0 */
import * as types from './types';
import genres from '../../data/genres';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '92b418e837b833be308bbfb1fb2aca1e';
const defaultParams = {
  api_key: API_KEY,
  language: 'en-US',
  timezone: 'America/New_York',
  include_null_first_air_dates: false,
  sort_by: 'popularity.desc',
  page: 1,
};

const stringifyQuery = (params, noPage = false) => {
  const oParams = { ...params };
  if (noPage) {
    delete oParams.page;
  }
  return Object.keys(oParams)
    .sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
};

const getIdGenreByName = name =>
  Object.keys(genres).find(key => genres[key].toLowerCase() === name);

export const updateFavorites = payload => ({
  type: types.UPDATE_FAVORITES,
  payload,
});

export const updateMoviesList = idsMovieList => ({
  type: types.UPDATE_MOVIES_LIST,
  payload: idsMovieList,
});

export const updateMovieSelected = idMovieSelected => ({
  type: types.UPDATE_MOVIE_SELECTED,
  payload: idMovieSelected,
});

const loadMoviesSuccess = payload => ({
  type: types.LOAD_MOVIES_SUCCESS,
  payload,
});

const loadMoviesFailure = error => ({
  type: types.LOAD_MOVIES_FAILURE,
  error,
});

export const loadMovies = params => (dispatch, getState) => {
  const { Library } = getState();

  if (
    typeof params !== 'undefined'
    && typeof params.list !== 'undefined'
    && params.list === 'favorites'
  ) {
    return dispatch(updateMoviesList(Library.favorites));
  }

  const currParams = { ...params } || {
    page: 1,
    sort_by: defaultParams.sort_by,
  };
  const idQuery = stringifyQuery(currParams, true);

  if (idQuery in Library.queries && currParams.page in Library.queries[idQuery]) {
    return dispatch(updateMoviesList(Library.queries[idQuery][currParams.page]));
  }

  let url = '';
  let sCompleteQuery = stringifyQuery({ ...defaultParams, ...currParams });
  if (typeof currParams.genre !== 'undefined') {
    const idGenre = getIdGenreByName(currParams.genre);
    if (!idGenre) {
      return dispatch(loadMoviesFailure({ error: `No movies found for : ${currParams.genre}` }));
    }
    delete currParams.genre;
    sCompleteQuery = stringifyQuery({ ...defaultParams, ...currParams });
    url = `${BASE_URL}genre/${idGenre}/movies?${sCompleteQuery}`;
  } else {
    const typeOfRequest = (typeof currParams.query !== 'undefined') ? 'search' : 'discover';
    url = `${BASE_URL}${typeOfRequest}/movie?${sCompleteQuery}`;
  }

  return dispatch({
    types: [
      types.LOAD_MOVIES_REQUEST,
      types.LOAD_MOVIES_SUCCESS,
      types.LOAD_MOVIES_FAILURE,
    ],
    callAPI: () => fetch(url),
    callbackSuccess: (data) => {
      let idsMovieList = [];

      if (
        data.page > 1
        && Object.keys(Library.queries).length > 0
        && typeof Library.queries[idQuery] !== 'undefined'
        && data.page - 1 in Library.queries[idQuery]
      ) {
        // Add ids of prev pages
        idsMovieList = Library.queries[idQuery][data.page - 1].slice();
      }

      // Saving movies in an object with their id as key
      // too make future searches easier and faster
      const resultsMovies = data.results
        .filter(movie => movie.poster_path)
        .reduce((acc, curr) => {
          idsMovieList.push(curr.id);
          return { ...acc, [curr.id]: curr };
        }, {});
      const movies = Object.assign({},
        resultsMovies,
        Library.movies,
      );

      // Remove duplicates
      idsMovieList = [...new Set(idsMovieList)];

      // Saving queries in an object with their stringified query as key
      // too make future searches easier and faster
      const queries = { ...Library.queries };
      if (typeof queries[idQuery] === 'undefined') {
        queries[idQuery] = {};
      }
      queries[idQuery][data.page] = idsMovieList;

      dispatch(loadMoviesSuccess({
        movies,
        idsMovieList,
        queries,
      }));
    },
  });
};

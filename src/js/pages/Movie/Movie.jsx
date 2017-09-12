import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from '../../containers/Sidebar/Sidebar';
import Movie from '../../containers/Movie/Movie';

const MoviePage = (props) => {
  const idMovie = props.match.params.idMovie;

  return (
    <div>
      <Sidebar backToHome />
      <Movie idMovie={idMovie} />
    </div>
  );
};

MoviePage.propTypes = {
  match: PropTypes.objectOf(PropTypes.shape).isRequired,
};

export default MoviePage;

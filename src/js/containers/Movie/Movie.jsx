import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import * as LibraryActions from '../../modules/library/actions';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import MovieDetails from '../../components/MovieDetails/MovieDetails';

@connect(state => ({
  Library: state.Library,
}))
class Movie extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    Library: PropTypes.objectOf(PropTypes.shape).isRequired,
    idMovie: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.handleClickAddFavorite = this.handleClickAddFavorite.bind(this);
    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  componentWillMount() {
    if (typeof this.props.Library.movies[this.props.idMovie] === 'undefined') {
      this.props.dispatch(push('/'));
    }
  }

  handleClickAddFavorite(e, idMovie) {
    e.preventDefault();
    const { favorites } = this.props.Library;
    if (favorites.includes(idMovie)) return;
    this.props.dispatch(LibraryActions.updateFavorites([...favorites, idMovie]));
  }

  handleImageLoaded() {
    this.setState({ loading: false });
  }

  render() {
    const idMovie = this.props.idMovie;
    const { movies, favorites } = this.props.Library;

    if (typeof movies[idMovie] === 'undefined') return false;

    const movie = movies[idMovie];

    return (
      <div>
        <ProgressBar
          loading={this.state.loading}
        />
        <MovieDetails
          movie={movie}
          isInFavorites={favorites.includes(parseInt(idMovie, 10))}
          loading={this.state.loading}
          handleImageLoaded={this.handleImageLoaded}
          handleClickAddFavorite={this.handleClickAddFavorite}
        />
      </div>
    );
  }
}

export default Movie;

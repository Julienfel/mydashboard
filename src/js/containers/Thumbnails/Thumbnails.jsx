import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { GridList } from 'material-ui/GridList';

import * as LibraryActions from '../../modules/library/actions';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import ProgressBar from '../../components/ProgressBar/ProgressBar';

import genres from '../../data/genres';
import styles from './Thumbnails.css';

const urlToAPIParam = {
  popular: { sort_by: 'popularity.desc' },
  latest: { sort_by: 'release_date.desc' },
};

const refCols = {
  1: 0,
  2: 768,
  3: 980,
  4: 1280,
};

const checkCols = (w, cols) =>
  (w > refCols[cols] && typeof refCols[cols + 1] === 'undefined')
  || (w > refCols[cols] && w < refCols[cols + 1]);

let prevClientHeight = 0;

@connect(state => ({
  router: state.router,
  Library: state.Library,
}))
class Thumbnails extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.objectOf(PropTypes.shape).isRequired,
    Library: PropTypes.objectOf(PropTypes.shape).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      cols: 4,
      idsMovieList: [],
      countImgLoaded: 0,
      urlParam: '',
      filter: {
        page: 1,
      },
    };

    this.handleClickAddFavorite = this.handleClickAddFavorite.bind(this);
    this.handleImgLoaded = this.handleImgLoaded.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentWillMount() {
    let urlParam = this.props.router.location.pathname.slice(1);
    if (urlParam === '') urlParam = 'popular';
    this.loadMovies(urlParam);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    let urlParam = nextProps.router.location.pathname.slice(1);
    if (urlParam === '') urlParam = 'popular';

    if (this.state.urlParam !== urlParam) {
      prevClientHeight = 0;
      this.setState({ loading: false });
      this.loadMovies(urlParam);
    }

    if (this.state.idsMovieList !== nextProps.Library.idsMovieList) {
      this.setState({ idsMovieList: nextProps.Library.idsMovieList });

      if (!this.state.loading) {
        if (nextProps.Library.idsMovieList.length > 0) {
          // Count of movies already loaded
          const diff = nextProps.Library.idsMovieList
            .filter(a => this.state.idsMovieList.find(b => a === b)).length;

          this.setState({
            loading: true,
            idsMovieList: nextProps.Library.idsMovieList,
            countImgLoaded: diff,
          });
        } else {
          this.setState({
            loading: false,
            idsMovieList: [],
            countImgLoaded: 0,
          });
        }
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.checkIfAllImgAreLoaded(nextState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.handleScroll);
  }

  getMoreMovies() {
    const filter = {
      ...this.state.filter,
      page: this.state.filter.page + 1,
    };

    this.setState({ filter });
    this.props.dispatch(LibraryActions.loadMovies(filter));
  }

  loadMovies(urlParam) {
    let param = urlParam;
    let filter = {};

    if (param.includes('favorites')) {
      filter = { list: 'favorites' };
    } else if (param.includes('search')) {
      param = param.replace('search/', '');
      filter.query = param;
    } else if (param.includes('genre')) {
      param = param.replace('genre/', '');
      filter.genre = param;
    } else {
      filter = urlToAPIParam[param];
    }
    filter.page = 1;

    this.setState({
      urlParam,
      filter,
    });
    this.props.dispatch(LibraryActions.loadMovies(filter));
  }

  checkIfAllImgAreLoaded(nextState) {
    if (nextState.loading && nextState.idsMovieList.length === nextState.countImgLoaded) {
      this.setState({ loading: false });
    }
  }

  handleClickAddFavorite(e, idMovie) {
    e.preventDefault();
    const { favorites } = this.props.Library;
    if (favorites.includes(idMovie)) return;
    this.props.dispatch(LibraryActions.updateFavorites([...favorites, idMovie]));
  }

  handleImgLoaded() {
    const countImgLoaded = this.state.countImgLoaded + 1;
    this.setState({ countImgLoaded });
  }

  handleResize() {
    const w = window.innerWidth;
    if (checkCols(w, this.state.cols)) return;
    Object.keys(refCols).forEach((cols) => {
      if (checkCols(w, parseInt(cols, 10))) {
        this.setState({ cols: parseInt(cols, 10) });
      }
    });
  }

  handleScroll() {
    if (this.state.urlParam === 'favorites') return;

    const y = window.scrollY + window.innerHeight;
    const clientHeight = document.body.clientHeight;

    if (
      prevClientHeight !== clientHeight
      && !this.state.loading
      && y > clientHeight * 0.9
    ) {
      prevClientHeight = clientHeight;
      this.getMoreMovies();
    }
  }

  renderThumbnails() {
    if (this.state.idsMovieList.length > 0) {
      return (
        <GridList
          cellHeight={375}
          className={styles.gridList}
          cols={this.state.cols}
        >
          {this.state.idsMovieList.map(idMovie => (
            <Thumbnail
              key={idMovie}
              data={this.props.Library.movies[idMovie]}
              onImgLoaded={this.handleImgLoaded}
              genres={genres}
              isInFavorites={this.props.Library.favorites.includes(idMovie)}
              handleClickAddFavorite={this.handleClickAddFavorite}
            />
          ))}
        </GridList>
      );
    }

    return (
      <div className={styles.noVideo}>
        No movies found :(
      </div>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <ProgressBar loading={this.state.loading} />
        <div className={styles.thumbnails}>
          {this.renderThumbnails()}
        </div>
      </div>
    );
  }
}

export default Thumbnails;

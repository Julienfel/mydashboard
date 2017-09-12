import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import IconFavorite from 'material-ui/svg-icons/action/favorite';
import CircularProgress from 'material-ui/CircularProgress';

import styles from './Thumbnail.css';

const BASE_URL = 'https://image.tmdb.org/t/p/w500/';

class Thumbnail extends Component {
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.shape).isRequired,
    onImgLoaded: PropTypes.func.isRequired,
    genres: PropTypes.objectOf(PropTypes.shape).isRequired,
    isInFavorites: PropTypes.bool.isRequired,
    handleClickAddFavorite: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      imgLoaded: false,
    };

    this.handleImageLoaded = this.handleImageLoaded.bind(this);
  }

  handleImageLoaded() {
    this.setState({ imgLoaded: true });
    this.props.onImgLoaded();
  }

  render() {
    const { data, isInFavorites } = this.props;
    const stylesImg = this.state.imgLoaded ? `${styles.img} ${styles.loaded}` : styles.img;
    const propsGridTile = {
      subtitle: <span>{data.genre_ids.map(id => this.props.genres[id]).join(', ')}</span>,
    };
    if (!isInFavorites) {
      propsGridTile.actionIcon = <IconButton onClick={e => this.props.handleClickAddFavorite(e, data.id)}><IconFavorite color="white" /></IconButton>;
    }


    return (
      <GridTile
        title={data.title}
        {...propsGridTile}
        className={styles.container}
        containerElement={<Link to={`/movie/${data.id}`} />}
      >
        {data.poster_path &&
          <img
            src={BASE_URL + data.poster_path}
            alt={data.title}
            onLoad={this.handleImageLoaded}
            className={stylesImg}
          />
        }

        {data.poster_path && !this.state.imgLoaded &&
          <CircularProgress
            className={styles.spinner}
          />
        }
      </GridTile>
    );
  }
}

export default Thumbnail;

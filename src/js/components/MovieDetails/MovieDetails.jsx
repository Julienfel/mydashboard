// @flow

import React from 'react';

import { Card, CardActions, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';
import IconDate from 'material-ui/svg-icons/action/date-range';
import IconStar from 'material-ui/svg-icons/toggle/star';
import IconStarBorder from 'material-ui/svg-icons/toggle/star-border';
import IconStarHalf from 'material-ui/svg-icons/toggle/star-half';

import genres from '../../data/genres';
import styles from './MovieDetails.css';

const BASE_URL = 'https://image.tmdb.org/t/p/w1280/';

const getStars = (vote: number) => {
  const stars = [];
  const voteTest = vote / 2;
  for (let i = 0; i < 5; i += 1) {
    if (voteTest > i) {
      stars.push(voteTest < i + 1 ? <IconStarHalf key={i} /> : <IconStar key={i} />);
    } else {
      stars.push(<IconStarBorder key={i} />);
    }
  }
  return stars;
};

type Movie = {
  adult: boolean,
  backdrop_path: string,
  genre_ids: Array<number>,
  id: number,
  original_language: string,
  original_title: string,
  overview: string,
  release_date: string,
  poster_path: string,
  popularity: number,
  title: string,
  video: string,
  vote_average: number,
  vote_count: number,
};

type Props = {
  movie: Movie,
  loading: boolean,
  isInFavorites: boolean,
  handleImageLoaded: () => void,
  handleClickAddFavorite:
    (SyntheticMouseEvent<HTMLButtonElement>, number) => void, // eslint-disable-line no-undef
};

const MovieDetails = ({
  movie,
  loading,
  isInFavorites,
  handleClickAddFavorite,
  handleImageLoaded,
}: Props) => {
  const stylesImg = !loading ? `${styles.img} ${styles.loaded}` : styles.img;
  const sGenres = movie.genre_ids.map((id: number): string => genres[id]).join(', ');

  return (
    <div className={styles.movie}>
      <Card>
        <CardMedia
          overlay={<CardTitle title={movie.title} subtitle={sGenres} />}
          className={styles.cardMedia}
        >
          {movie.backdrop_path &&
            <img
              src={BASE_URL + movie.backdrop_path}
              alt={movie.title}
              onLoad={handleImageLoaded}
              className={stylesImg}
            />
          }
        </CardMedia>
        <List>
          <ListItem
            disabled
            primaryText={movie.release_date}
            leftIcon={<IconDate />}
          />
          <ListItem
            disabled
            primaryText={getStars(movie.vote_average)}
            leftIcon={<IconStarHalf />}
          />
        </List>
        <h2 className={styles.subtitle}>OVERVIEW</h2>
        <CardText>
          {movie.overview}
        </CardText>
        {!isInFavorites &&
          <CardActions>
            <FlatButton
              label="Add to favorite"
              onClick={
                (e: SyntheticMouseEvent<HTMLButtonElement>) => // eslint-disable-line no-undef
                  handleClickAddFavorite(e, movie.id)
              }
            />
          </CardActions>
        }
      </Card>
    </div>
  );
};

export default MovieDetails;

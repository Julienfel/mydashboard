// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import IconStar from 'material-ui/svg-icons/toggle/star';
import IconFavorite from 'material-ui/svg-icons/action/favorite';
import IconQueryBuilder from 'material-ui/svg-icons/action/query-builder';
import IconGenreAction from 'material-ui/svg-icons/maps/directions-run';
import IconGenreComedy from 'material-ui/svg-icons/social/mood';
import IconGenreFantasy from 'material-ui/svg-icons/notification/adb';
import IconGenreThriller from 'material-ui/svg-icons/av/movie';

import styles from './MainMenu.css';

type Props = {
  favoriteAdded: boolean,
  nbFavorites: number,
};

const MainMenu = (props: Props) => {
  const sNbFavorites:string = props.nbFavorites ? ` (${props.nbFavorites})` : '';
  const classItemFavorites = props.favoriteAdded ? `${styles.favorites} ${styles.added}` : styles.favorites;

  return (
    <Paper>
      <Menu
        autoWidth={false}
        className={styles.menu}
      >
        <MenuItem
          primaryText="Popular"
          leftIcon={<IconStar />}
          containerElement={<Link to="/popular" />}
        />
        <MenuItem
          primaryText="Latest"
          leftIcon={<IconQueryBuilder />}
          containerElement={<Link to="/latest" />}
        />
        <Divider />
        <MenuItem
          className={classItemFavorites}
          primaryText={`Favorites${sNbFavorites}`}
          leftIcon={<IconFavorite />}
          containerElement={<Link to="/favorites" />}
        />
        <Divider />
        <MenuItem
          primaryText="Action"
          leftIcon={<IconGenreAction />}
          containerElement={<Link to="/genre/action" />}
        />
        <MenuItem
          primaryText="Comedy"
          leftIcon={<IconGenreComedy />}
          containerElement={<Link to="/genre/comedy" />}
        />
        <MenuItem
          primaryText="Fantasy"
          leftIcon={<IconGenreFantasy />}
          containerElement={<Link to="/genre/fantasy" />}
        />
        <MenuItem
          primaryText="Thriller"
          leftIcon={<IconGenreThriller />}
          containerElement={<Link to="/genre/thriller" />}
        />
      </Menu>
    </Paper>
  );
};

export default MainMenu;

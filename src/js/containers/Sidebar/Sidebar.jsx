import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SearchBox from '../../components/SearchBox/SearchBox';
import MainMenu from '../../components/MainMenu/MainMenu';

import styles from './Sidebar.css';

@connect(state => ({
  Library: state.Library,
}))
class Sidebar extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    Library: PropTypes.objectOf(PropTypes.shape).isRequired,
    backToHome: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      favorites: this.props.Library.favorites,
      favoriteAdded: false,
    };

    this.handleClickSearch = this.handleClickSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.favorites !== nextProps.Library.favorites) {
      this.setState({
        favorites: nextProps.Library.favorites,
        favoriteAdded: true,
      });

      setTimeout(() => this.setState({ favoriteAdded: false }), 250);
    }
  }

  handleClickSearch(searchValue) {
    const res = searchValue.trim().replace(' ', '+');
    this.props.dispatch(push(`/search/${res}`));
  }

  render() {
    const nbFavorites = this.state.favorites.length;

    return (
      <div className={styles.container}>
        <Breadcrumb
          backToHome={this.props.backToHome}
        />
        <SearchBox
          handleClickSearch={this.handleClickSearch}
        />
        <MainMenu nbFavorites={nbFavorites} favoriteAdded={this.state.favoriteAdded} />
      </div>
    );
  }
}

export default Sidebar;

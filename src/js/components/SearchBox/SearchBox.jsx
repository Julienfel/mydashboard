import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionSearch from 'material-ui/svg-icons/action/search';

import styles from './SearchBox.css';

class SearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: '',
    };

    this.onSearch = this.onSearch.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }

  onSearch() {
    this.props.handleClickSearch(this.state.searchValue);
    this.setState({ searchValue: '' });
  }

  handleChangeSearch(event) {
    this.setState({
      searchValue: event.target.value,
    });
  }

  render() {
    return (
      <div className={styles.searchBox}>
        <TextField
          hintText="Search a movie"
          fullWidth
          value={this.state.searchValue}
          onChange={this.handleChangeSearch}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.onSearch();
              e.preventDefault();
            }
          }}
        />
        <div>
          <FloatingActionButton mini onClick={this.onSearch}>
            <ActionSearch />
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}

SearchBox.propTypes = {
  handleClickSearch: PropTypes.func.isRequired,
};

export default SearchBox;

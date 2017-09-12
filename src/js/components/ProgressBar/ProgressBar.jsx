import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from 'material-ui/LinearProgress';
import styles from './ProgressBar.css';

class ProgressBar extends Component {
  static propTypes = {
    loading: PropTypes.bool,
  }

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      completed: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loading !== nextProps.loading) {
      if (nextProps.loading) {
        this.setState({ loading: true });
        this.progress(0);
      } else {
        this.setState({ loading: false });
        this.progress(100);
        clearTimeout(this.timer);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  progress(completed) {
    if (completed >= 100) {
      this.setState({ completed: 100 });
    } else {
      this.setState({ completed });
      const diff = Math.random() * 10;
      this.timer = setTimeout(() => this.progress(completed + diff), 100);
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <LinearProgress mode="determinate" value={this.state.completed} />
      </div>
    );
  }
}

export default ProgressBar;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';

import HomePage from './pages/Home/Home';
import MoviePage from './pages/Movie/Movie';

class ScrollToTop extends Component {
  static propTypes = {
    location: PropTypes.objectOf(PropTypes.shape),
    children: PropTypes.node,
  };

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return <div>{this.props.children}</div>;
  }
}
const RouterScrollToTop = withRouter(ScrollToTop);

const Routes = () => (
  <RouterScrollToTop>
    <Switch>
      <Route exact path="/:filter?" component={HomePage} />
      <Route path="/search/:search" component={HomePage} />
      <Route path="/genre/:genre" component={HomePage} />
      <Route path="/movie/:idMovie" component={MoviePage} />
      <Route render={() => (<h2>Error 404</h2>)} />
    </Switch>
  </RouterScrollToTop>
);

export default Routes;

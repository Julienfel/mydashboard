// @flow

import React from 'react';
import { Link } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import styles from './Breadcrumb.css';

type Props = {
  backToHome?: boolean,
};

const Breadcrumb = ({ backToHome }: Props) => (
  <h2 className={styles.title}>
    {backToHome
      ? <RaisedButton
        containerElement={<Link to="/" />}
        label="Back to dashboard"
        secondary
        fullWidth
        icon={<ArrowLeft />}
      />
      : 'MyDASHBOARD'}
  </h2>
);

export default Breadcrumb;

import React from 'react';

import Background from 'Components/Background';

import styles from './Layout.module.scss';

const Layout = ({ children }) => (
  <div className={styles.root}>
    {children}
    <Background />
  </div>
);

export default Layout;

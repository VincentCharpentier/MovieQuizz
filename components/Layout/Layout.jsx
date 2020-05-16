import React from 'react';

import AudioBackground from 'Components/AudioBackground';
import Background from 'Components/Background';

import styles from './Layout.module.scss';

const Layout = ({ children }) => (
  <div className={styles.root}>
    {children}
    <Background />
    <AudioBackground />
  </div>
);

export default Layout;

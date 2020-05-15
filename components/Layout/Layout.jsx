import React from 'react';
import Head from 'next/head';
// import '';
import styles from './Layout.module.scss';

const BASE_TITLE = 'Music Quiz';

const computeTitle = (title) =>
  title ? [BASE_TITLE, title].join(' - ') : BASE_TITLE;

const Layout = ({ title = '', children }) => (
  <>
    <Head>
      <title>{computeTitle(title)}</title>
    </Head>
    <div className={styles.root}>{children}</div>
  </>
);

export default Layout;

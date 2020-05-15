import React from 'react';

import Link from 'Components/Link';
import PageTitle from 'Components/PageTitle';
import MainMenu from 'Components/MainMenu';

import styles from './Home.module.scss';

const HomePage = () => {
  return (
    <>
      <PageTitle>Home</PageTitle>
      <div className={styles.root}>
        <MainMenu className={styles.menu} />
        <Link href="/about" className={styles.link}>
          About
        </Link>
      </div>
    </>
  );
};

export default HomePage;

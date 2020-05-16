import React from 'react';

import Link from 'Components/Link';
import PageTitle from 'Components/PageTitle';
import MainMenu from 'Components/MainMenu';
import Routes from 'Constants/routes';

import styles from './Home.module.scss';

const HomePage = () => {
  return (
    <>
      <PageTitle>Home</PageTitle>
      <div className={styles.root}>
        <h1 className={styles.mainTitle}>Movie Quizz</h1>
        <MainMenu className={styles.menu} />
        <Link href={Routes.ABOUT} className={styles.link}>
          About
        </Link>
      </div>
    </>
  );
};

export default HomePage;

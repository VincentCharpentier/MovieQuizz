import React from 'react';

import Link from 'Components/Link';
import Routes from 'Constants/routes';

import styles from './About.module.scss';

export default () => (
  <div className={styles.root}>
    <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" />
    <p>This project is using TMDB - The movie database</p>
    <Link href={Routes.HOME}>Back to home page</Link>
  </div>
);

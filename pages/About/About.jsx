import React from 'react';

import Link from 'Components/Link';
import Routes from 'Constants/routes';

import styles from './About.module.scss';

export default () => (
  <div className={styles.root}>
    <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" />
    <p>Data: TMDB - The movie database</p>
    <p>
      Music: <a href="https://www.bensound.com">https://www.bensound.com</a>
    </p>
    <p>
      Sound Effects: <a href="https://freesound.org/">https://freesound.org/</a>{' '}
      (NenadSimic and broumbroum)
    </p>
    <Link href={Routes.HOME}>Back to home page</Link>
  </div>
);

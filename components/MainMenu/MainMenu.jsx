import React from 'react';
import clsx from 'clsx';

import Button from 'Components/Button';

import styles from './MainMenu.module.scss';

const MainMenu = ({ className }) => (
  <div className={clsx(styles.root, className)}>
    <Button>Play !</Button>
    <Button>Multiplayer</Button>
  </div>
);

export default MainMenu;

import React, { useCallback, useContext, useState, useMemo } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import Button from 'Components/Button';
import Routes from 'Constants/routes';
import SettingsContext from 'Contexts/Settings';
import { SFX_VALIDATE } from 'Utils/sfx';

import styles from './MainMenu.module.scss';

const MENU = {
  MAIN: 'MAIN',
  SETTINGS: 'SETTING',
  SOUND: 'SOUND',
};

const PARENT_MENU = {
  [MENU.SETTINGS]: MENU.MAIN,
  [MENU.SOUND]: MENU.SETTINGS,
};

const isParentMenu = (menu, parentMenu) => {
  let result = false;
  const actualParent = PARENT_MENU[menu];
  if (actualParent) {
    if (actualParent === parentMenu) {
      result = true;
    } else {
      result = isParentMenu(actualParent, parentMenu);
    }
  }
  return result;
};

const Menu = ({ menuId, currentMenu, children }) => {
  const isParent = useMemo(() => isParentMenu(currentMenu, menuId), [
    menuId,
    currentMenu,
  ]);
  const isCurrent = menuId === currentMenu;

  const classes = clsx(
    styles.menu,
    isParent && styles.left,
    isCurrent && styles.current,
  );
  return <div className={classes}>{children}</div>;
};

const MainMenu = ({ className }) => {
  const router = useRouter();
  const {
    soundActive,
    soundVolume,
    setSoundActive,
    setSoundVolume,
  } = useContext(SettingsContext);

  const [currentMenu, setCurrentMenu] = useState(MENU.MAIN);

  const goto = useCallback((menuId) => () => setCurrentMenu(menuId), [
    setCurrentMenu,
  ]);
  const navTo = useCallback((route) => () => router.push(route));

  const toggleSound = useCallback(() => {
    setSoundActive(!soundActive);
  }, [setSoundActive, soundActive]);

  const handleVolumeChange = useCallback(
    (e) => setSoundVolume(e.target.value),
    [setSoundVolume],
  );

  return (
    <div className={clsx(styles.root, className)}>
      <Menu menuId={MENU.MAIN} currentMenu={currentMenu}>
        <Button
          className={styles.menuEntry}
          onClick={navTo(Routes.SOLO_GAME)}
          clickSound={SFX_VALIDATE}>
          Play !
        </Button>
        <Button className={styles.menuEntry} disabled>
          Multiplayer
        </Button>
        <Button className={styles.menuEntry} onClick={goto(MENU.SETTINGS)}>
          Settings
        </Button>
      </Menu>
      <Menu menuId={MENU.SETTINGS} currentMenu={currentMenu}>
        <Button className={styles.menuEntry} onClick={goto(MENU.SOUND)}>
          Sound
        </Button>
        <Button className={styles.menuEntry} onClick={goto(MENU.MAIN)}>
          Back
        </Button>
      </Menu>
      <Menu menuId={MENU.SOUND} currentMenu={currentMenu}>
        <Button className={styles.menuEntry} onClick={toggleSound}>
          Sound: {soundActive ? 'ON' : 'OFF'}
        </Button>
        <div className={clsx(styles.menuEntry, styles.volumeCtrl)}>
          <p>Volume {soundVolume * 100}%</p>
          <input
            type="range"
            min="0"
            max="1"
            step=".1"
            value={soundVolume}
            onChange={handleVolumeChange}
          />
        </div>
        <Button className={styles.menuEntry} onClick={goto(MENU.SETTINGS)}>
          Back
        </Button>
      </Menu>
    </div>
  );
};

export default MainMenu;

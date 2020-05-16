import React, { useCallback, useState, useMemo } from 'react';
import clsx from 'clsx';

import Button from 'Components/Button';
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
  const [currentMenu, setCurrentMenu] = useState(MENU.MAIN);

  const goto = useCallback((menuId) => () => setCurrentMenu(menuId), [
    setCurrentMenu,
  ]);

  return (
    <div className={clsx(styles.root, className)}>
      <Menu menuId={MENU.MAIN} currentMenu={currentMenu}>
        <Button clickSound={SFX_VALIDATE}>Play !</Button>
        <Button disabled>Multiplayer</Button>
        <Button onClick={goto(MENU.SETTINGS)}>Settings</Button>
      </Menu>
      <Menu menuId={MENU.SETTINGS} currentMenu={currentMenu}>
        <Button onClick={goto(MENU.SOUND)}>Sound</Button>
        <Button onClick={goto(MENU.MAIN)}>Back</Button>
      </Menu>
      <Menu menuId={MENU.SOUND} currentMenu={currentMenu}>
        <p>Nothing here yet !</p>
        <Button onClick={goto(MENU.SETTINGS)}>Back</Button>
      </Menu>
    </div>
  );
};

export default MainMenu;

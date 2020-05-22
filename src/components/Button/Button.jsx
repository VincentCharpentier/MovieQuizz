import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import SettingsCtx from 'Contexts/Settings';
import useRandomColor from 'Hooks/useRandomColor';
import { SFX_HOVER, SFX_SELECT } from 'Utils/sfx';

import styles from './Button.module.scss';

const Button = ({
  color,
  tabIndex = 0,
  className = null,
  onMouseEnter: _onMouseEnter = () => null,
  onClick: _onClick = () => null,
  clickSound,
  children,
  ...rest
}) => {
  const { soundActive, soundVolume } = useContext(SettingsCtx);
  const _clickSound = clickSound ?? SFX_SELECT;
  const randomColor = useRandomColor();
  let background = useMemo(() => color ?? randomColor, [color, randomColor]);

  useEffect(() => {
    SFX_HOVER.setVolume(soundVolume);
    _clickSound.setVolume(soundVolume);
  }, [soundVolume]);

  const onMouseEnter = useCallback(
    (e) => {
      if (soundActive) {
        SFX_HOVER.play();
      }
      _onMouseEnter(e);
    },
    [soundActive],
  );
  const onClick = useCallback(
    (e) => {
      if (soundActive) {
        _clickSound.play();
      }
      _onClick(e);
    },
    [_clickSound, _onClick, soundActive],
  );

  const props = {
    style: { background },
    className: clsx(styles.root, className),
    tabIndex,
    onMouseEnter,
    onClick,
    ...rest,
  };
  return <button {...props}>{children}</button>;
};

Button.propTypes = {
  color: PropTypes.string,
};

export default Button;

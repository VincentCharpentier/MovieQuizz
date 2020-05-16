import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

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
  const _clickSound = clickSound ?? SFX_SELECT;
  const randomColor = useRandomColor();
  let background = useMemo(() => color ?? randomColor, [color, randomColor]);

  const onMouseEnter = useCallback((e) => {
    SFX_HOVER.play();
    _onMouseEnter(e);
  }, []);
  const onClick = useCallback(
    (e) => {
      _clickSound.play();
      _onClick(e);
    },
    [_clickSound],
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

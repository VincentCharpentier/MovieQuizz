import React, { useMemo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import randomColor from 'Utils/randomColor';
import styles from './Button.module.scss';

const Button = ({
  color,
  tabIndex = 0,
  onClick = () => null,
  className = null,
  children,
}) => {
  let background = useMemo(() => color ?? randomColor(), [color]);

  const props = {
    style: { background },
    className: clsx(styles.root, className),
    tabIndex,
    onClick,
  };
  return <button {...props}>{children}</button>;
};

Button.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;

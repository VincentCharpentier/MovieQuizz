import React, { useMemo } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import useRandomColor from 'Hooks/useRandomColor';

import styles from './Button.module.scss';

const Button = ({
  color,
  tabIndex = 0,
  className = null,
  children,
  ...rest
}) => {
  const randomColor = useRandomColor();
  let background = useMemo(() => color ?? randomColor, [color, randomColor]);

  const props = {
    style: { background },
    className: clsx(styles.root, className),
    tabIndex,
    ...rest,
  };
  return <button {...props}>{children}</button>;
};

Button.propTypes = {
  color: PropTypes.string,
};

export default Button;

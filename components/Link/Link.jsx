import React, { useMemo } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import useRandomColor from 'Hooks/useRandomColor';

import styles from './Link.module.scss';

export default ({ className, color: _color, style, children, ...rest }) => {
  const randomColor = useRandomColor(75, 40);
  let color = useMemo(() => _color ?? randomColor, [_color, randomColor]);

  const props = {
    style: { color, ...style },
    className: clsx(styles.root, className),
  };
  return (
    <Link {...rest}>
      <a {...props}>{children}</a>
    </Link>
  );
};

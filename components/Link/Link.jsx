import React, { useMemo } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

import randomColor from 'Utils/randomColor';

import styles from './Link.module.scss';

export default ({ className, color: _color, style, children, ...rest }) => {
  let color = useMemo(() => _color ?? randomColor(), [_color]);

  console.log('test', color);
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

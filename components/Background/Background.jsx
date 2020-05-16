import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

import randomColor from 'Utils/randomColor';

import styles from './Background.module.scss';

const CELL_SIZE = 50;

const rand = (min, max) => Math.round(Math.random() * (max - min)) + min;

function renderCellGrid(width, height) {
  const result = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const style = {
        background: randomColor(),
        height: CELL_SIZE + 'px',
        width: CELL_SIZE + 'px',
        animationDuration: rand(800, 2000) + 'ms',
      };
      row.push(<div key={`${y}-${x}`} className={styles.cell} style={style} />);
    }
    result.push(
      <div key={y} className={styles.row}>
        {row}
      </div>,
    );
  }
  return result;
}

export default () => {
  const [[width, height], setDimensions] = useState([0, 0]);

  const resize = useCallback(() => {
    const { innerHeight, innerWidth } = window;
    console.log(
      Math.ceil(innerWidth / CELL_SIZE),
      Math.ceil(innerHeight / CELL_SIZE),
    );
    setDimensions([
      Math.ceil(innerWidth / CELL_SIZE),
      Math.ceil(innerHeight / CELL_SIZE),
    ]);
  }, []);

  useEffect(() => {
    resize();
    const dResize = debounce(resize, 350, { maxWait: 1000 });
    window.addEventListener('resize', dResize);
    return () => window.removeEventListener('resize', dResize);
  }, [resize]);

  return <div className={styles.grid}>{renderCellGrid(width, height)}</div>;
};

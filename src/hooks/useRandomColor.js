import { useEffect, useState } from 'react';

import randomColor from 'Utils/randomColor';

const useRandomColor = (sat, lum) => {
  const [color, setColor] = useState('#000');

  useEffect(() => {
    setColor(randomColor(sat, lum));
  }, [sat, lum]);

  return color;
};

export default useRandomColor;

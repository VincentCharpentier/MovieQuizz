export default (sat = 65, lum = 65) => {
  let hue = Math.round(Math.random() * 360);
  return `hsl(${hue}, ${sat}%, ${lum}%)`;
};

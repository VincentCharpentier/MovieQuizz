export default () => {
  let hue = Math.round(Math.random() * 360);
  return `hsl(${hue}, 65%, 65%)`;
};

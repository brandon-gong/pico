function color(x, y) {
  let column = floor(y / height * 8);
  let row = floor(x / width * 8);

  if ((column + row) % 2 == 0) return [238, 238, 210];
  else return [118, 150, 86];
}

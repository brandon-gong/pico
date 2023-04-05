loop = false;

// Adjust these parameters to zoom in/out on
// different areas of the fractal
let boxUpperLeft = [-0.75, -0.2];
let boxSize = 0.05;
let maxIterations = 100;

// abs distance for complex numbers
function dist(x1, y1, x2, y2) {
  let dx = x1 - x2; dx *= dx;
  let dy = y1 - y2; dy *= dy;
  return pow(dx + dy, 0.5);
}

// the below two functions (lerp and iterToColor) are
// purely for aesthetic purposes, and don't contribute
// to actually computing the fractal.
function lerp(colorA, colorB, amt) {
  res = [0,0,0];
  for(let i = 0; i < 3; i++) {
    res[i] = colorA[i] + (colorB[i] - colorA[i]) * amt;
  }
  return res;
}

function iterToColor(norm) {
  if (norm < 0.333) {
    norm *= 3;
    return lerp([0,0,0], [0,7,100], norm);
  } else if (norm < 0.666) {
    norm = 3 * (norm - 0.333);
    return lerp([0,7,100], [237, 255, 255], norm);
  } else {
    norm = 3 * (norm - 0.666);
    return lerp([237, 255, 255], [255, 170, 0], norm);
  }
}

function color(x, y) {
  // pixel coords to real-world coords
  x = boxUpperLeft[0] + boxSize * x / width;
  y = boxUpperLeft[1] - boxSize + boxSize * y / height;

  let a = x;
  let b = y;
  let n = 0;
  // figure out how many iterations it takes to escape
  // to infinity-ish (aka 16).
  while (n < maxIterations) {
    const aa = a * a;
    const bb = b * b;
    const twoab = 2.0 * a * b;
    a = aa - bb + x;
    b = twoab + y;
    if (dist(aa, bb, 0, 0) > 16) break;
    n++;
  }

  let norm = n / maxIterations;
  if (n == maxIterations) norm = 0;
  return iterToColor(norm);
}

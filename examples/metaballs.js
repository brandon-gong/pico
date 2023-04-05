let sqrt = (x) => pow(x, 0.5);
let sq = (x) => pow(x, 2);

function invHypot(a, b) {
  return 1 / sqrt(sq(a[0] - b[0]) + sq(a[1] - b[1]));
}

function normalize(a) {
  return [a[0] / width, a[1] / height];
}

function smoothstep(edge0, edge1, x) {
   if (x < edge0) return 0;
   else if (x >= edge1) return 1;

   x = (x - edge0) / (edge1 - edge0);
   return x * x * (3 - 2 * x);
}

function color(x, y, f, mouseX, mouseY) {
  let mb1 = [0.5, 0.5];
  let mb2 = normalize([mouseX, mouseY]);
  let pos = normalize([x, y]);

  let mbTotal = invHypot(pos, mb1) + invHypot(pos, mb2);
  mbTotal = smoothstep(9.9, 10, mbTotal);
  mbTotal *= 255;

  return [mbTotal, mbTotal, mbTotal];
}

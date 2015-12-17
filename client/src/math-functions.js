// http://math.stackexchange.com/questions/466198/algorithm-to-get-the-maximum-size-of-n-squares-that-fit-into-a-rectangle-with-a
export function maxSquareSize(x, y, n) {
  let Px;
  let Sx;
  let Sy;
  let Py;

  if (x === 0 || y === 0 || n === 0) return 0;

  Px = Math.ceil(Math.sqrt(n * x / y));

  if (Math.floor(Px * y / x) * Px < n) Sx = y / Math.ceil(Px * y / x);
  else Sx = x / Px;

  Py = Math.ceil(Math.sqrt(n * y / x));

  if (Math.floor(Py * x / y) * Py < n) Sy = x / Math.ceil(x * Py / y);
  else Sy = y / Py;

  return Math.floor(Math.max(Sx, Sy));
}

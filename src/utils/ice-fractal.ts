let lengthModifier = 0.8;
let angleModifier = 0.5;


/**
 * Draws a line between two points.
 * 
 * @param {number} x1 - Starting x coordinate.
 * @param {number} y1 - Starting y coordinate.
 * @param {number} x2 - Ending x coordinate.
 * @param {number} y2 - Ending y coordinate.
 */
function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

/**
* Recursively draws the Ice Fractal.
* 
* @param {number} x - Current x position.
* @param {number} y - Current y position.
* @param {number} l - Length of the current segment.
* @param {number} u - Angle in radians.
* @param {number} t - Depth of recursion.
*/
function drawFractal(ctx: CanvasRenderingContext2D, x: number, y: number, l: number, u: number, t: number) {
  if (t > 0) {
    l *= 0.5;
    [x, y] = drawAndMove(ctx, x, y, l, u, t-1);
    [x, y] = drawAndMove(ctx, x, y, l*lengthModifier, u + Math.PI * angleModifier, t-1);
    [x, y] = drawAndMove(ctx, x, y, l*lengthModifier, u - Math.PI * angleModifier, t-1);
    [x, y] = drawAndMove(ctx, x, y, l, u, t-1);
  } else {
    drawLine(ctx, x, y, x + Math.cos(u) * l, y - Math.sin(u) * l);
  }
}

/**
* Draws the fractal segment and returns the updated position.
* 
* @param {number} x - Starting x position.
* @param {number} y - Starting y position.
* @param {number} l - Length of the segment.
* @param {number} u - Angle in radians.
* @param {number} t - Depth of recursion.
* @returns {Array} Updated [x, y] coordinates.
*/
function drawAndMove(ctx: CanvasRenderingContext2D, x: number, y: number, l: number, u: number, t: number): [number, number] {
  drawFractal(ctx, x, y, l, u, t);
  return [x + l * Math.cos(u), y - l * Math.sin(u)];
}

/**
 * Initialize and draw the Ice fractal from each corner of the SQUARE canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} iterationsCount - Number of iterations
 */
export function start(ctx: CanvasRenderingContext2D, iterationsCount: number, lModifier = lengthModifier, aModifier = angleModifier) {
  const width = ctx.canvas.width;
  lengthModifier = lModifier;
  angleModifier = aModifier;
  ctx.lineWidth = 1 / Math.max(iterationsCount - 4, 1);
  drawFractal(ctx, width - 10, 10, width - 20, -Math.PI, iterationsCount);
  drawFractal(ctx, 10, width - 10, width - 20, 0, iterationsCount);
  drawFractal(ctx, 10, 10, width - 20, -Math.PI / 2, iterationsCount);
  drawFractal(ctx, width - 10, width - 10, width - 20, Math.PI / 2, iterationsCount);
}

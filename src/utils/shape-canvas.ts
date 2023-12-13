import { Shape } from "./geometry";

const shapeColor = 'hotpink';
const margin = 0

export function gridToCanvas(gridSize: number, x: number, y: number, canvas: HTMLCanvasElement): [number, number] {
  const gridStep = canvas ? canvas.width / (gridSize * 2) : 30;
  const canvasX = (x + gridSize) * gridStep;
  const canvasY = (-y + gridSize) * gridStep;
  return [canvasX, canvasY];
}

export function drawGridCoords(gridSize: number, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const effectiveWidth = width - 2 * margin;
  const effectiveHeight = height - 2 * margin;
  const step = effectiveWidth / (gridSize * 2);

  // Draw the grid lines
  ctx.beginPath();
  ctx.strokeStyle = 'white'; // Light green color for grid lines
  ctx.lineWidth = 1; // Standard line width for the grid
  for (let x = margin; x <= effectiveWidth + margin; x += step) {
    ctx.moveTo(x, margin);
    ctx.lineTo(x, effectiveHeight + margin);
  }
  for (let y = margin; y <= effectiveHeight + margin; y += step) {
    ctx.moveTo(margin, y);
    ctx.lineTo(effectiveWidth + margin, y);
  }
  ctx.stroke(); // Render grid lines


  // Draw the axes
  ctx.beginPath();
  ctx.strokeStyle = 'white'; // Black color for axes
  ctx.lineWidth = 4; // Thicker line for the axes
  const centerX = width / 2;
  const centerY = height / 2;
  ctx.moveTo(centerX, margin);
  ctx.lineTo(centerX, effectiveHeight + margin);
  ctx.moveTo(margin, centerY);
  ctx.lineTo(effectiveWidth + margin, centerY);
  ctx.stroke(); // Render axes lines


  // Arrowheads for axes
  const arrowLength = 20;
  const arrowWidth = 20;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(effectiveWidth + margin, centerY);
  ctx.lineTo(effectiveWidth + margin - arrowLength, centerY - arrowWidth / 2);
  ctx.lineTo(effectiveWidth + margin - arrowLength, centerY + arrowWidth / 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(centerX, margin);
  ctx.lineTo(centerX - arrowWidth / 2, margin + arrowLength);
  ctx.lineTo(centerX + arrowWidth / 2, margin + arrowLength);
  ctx.closePath();
  ctx.fill();

  // Label the axes
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top'; // Adjusted for horizontal alignment only
  ctx.font = '18px Arial';
  for (let i = -gridSize + 1; i <= gridSize - 1; i++) {
    const labelPosX = gridToCanvas(gridSize, i, 0, canvas)[0];
    const labelPosY = gridToCanvas(gridSize, 0, i, canvas)[1];

    if (i !== 0) {
      ctx.fillText(i.toString(), labelPosX, centerY + 10); // Offset below the x-axis
      ctx.fillText((i).toString(), centerX - 15, labelPosY);
    }
  }
}

export function drawShape(shape: Shape, gridSize: number, canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  const vertices = shape.vertices.map((v) => gridToCanvas(gridSize, v[0], v[1], canvas));
  ctx.beginPath();
  ctx.moveTo(vertices[0][0], vertices[0][1]);
  for (let i = 1; i < vertices.length; i++) {
    ctx.lineTo(vertices[i][0], vertices[i][1]);
  }
  ctx.closePath();
  ctx.strokeStyle = shapeColor;
  ctx.fillStyle = shapeColor;
  ctx.globalAlpha = 0.5;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();
}

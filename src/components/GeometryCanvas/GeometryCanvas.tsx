import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './GeometryCanvas.module.css'; // Adjust the path for CSS modules
import { useShapeInfo } from '../../context/RectangleContext';
import { Shape } from '../../utils/geometry';
import { drawGridCoords, drawShape } from '../../utils/shape-canvas';

const totalFrames = 20;

const GeometryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gridSize, setGridSize] = useState<number>(15);
  const frameCount = useRef(0);
  const {
    setIsDrawing,
    setShape,
    shape,
    isDrawing,
    x,
    y,
    rotate,
    zoom,
  } = useShapeInfo();

  // Draw the shape on the canvas
  const drawGeometricShape = useCallback((shape: Shape) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Could not get canvas');
    }
    drawShape(shape, gridSize, canvas);
  }, [gridSize]);

  // Draw the grid on the canvas
  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Could not get canvas');
    }
    drawGridCoords(gridSize, canvas);
  }, [gridSize]);


  // Animation logic
  const animate = useCallback(() => {
    if (frameCount.current < totalFrames) {
      const incrementalRotation = rotate / totalFrames;
      const incrementalScale = Math.pow(zoom, 1 / totalFrames);
      const incrementalX = x / totalFrames;
      const incrementalY = y / totalFrames;

      shape.scaleRotateAndMove(
        incrementalScale,
        incrementalScale,
        incrementalRotation,
        incrementalX,
        incrementalY
      );
      setShape(new Shape(shape.vertices)); // Update the state to trigger re-render

      frameCount.current += 1;
      requestAnimationFrame(animate);
    } else {
      setIsDrawing(false);
      frameCount.current = 0;
    }
  }, [rotate, zoom, x, y, shape, setShape, setIsDrawing]);

  useEffect(() => {
    if (isDrawing) {
      animate();
    }
  }, [isDrawing, animate]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawGeometricShape(shape);
      }
    }
  }, [drawGrid, drawGeometricShape, shape]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    if (isDrawing) {
      animate();
    }
  }, [isDrawing, animate]);

  return (
    <div className={styles.imageContainer}>
      <canvas ref={canvasRef} width="500" height="500" className={styles.canvas}></canvas>
      <input
        type="range"
        className={styles.slider}
        value={gridSize}
        onChange={(e) => setGridSize(Number(e.target.value))}
        min="2"
        max="100"
        step="1"
      />
    </div>
  );
};

export default GeometryCanvas;

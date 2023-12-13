import React, { useRef, useState, useEffect, useCallback } from 'react';
import styles from './GeometryCanvas.module.css'; // Adjust the path for CSS modules
import { useShapeInfo } from '../../context/ShapeContext';
import { Shape } from '../../utils/geometry';
import { drawGridCoords, drawShape, gridToCanvas } from '../../utils/shape-canvas';

const isNearPoint = (clickX: number, clickY: number, pointX: number, pointY: number, radius: number) => {
  return Math.hypot(pointX - clickX, pointY - clickY) <= radius;
};

const totalFrames = 100;

const GeometryCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gridSize, setGridSize] = useState<number>(15);
  const frameCount = useRef(0);
  const imageRef = useRef(new Image());

  useEffect(() => {
    imageRef.current.src = '/anchor.png';
  }, []);

  const {
    setIsDrawing,
    setShape,
    shape,
    isDrawing,
    x,
    y,
    rotate,
    zoom,
    anchor,
    setAnchor
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

      setShape(shape => {
        shape.scaleRotateAndMove(
          incrementalScale,
          incrementalScale,
          incrementalRotation,
          incrementalX,
          incrementalY,
          anchor
        );
        return new Shape(shape.vertices)
      });

      frameCount.current += 1;
      requestAnimationFrame(animate);
    } else {
      console.log('Done animating');
      setIsDrawing(false)
    }
  }, [rotate, zoom, x, y, anchor, setShape, setIsDrawing]);

  useEffect(() => {
    if (isDrawing) {
      console.log('START ANIMATION');
      animate();
    }
  }, [isDrawing, animate]);

  useEffect(() => {
    if (isDrawing) {
      frameCount.current = 0;
      animate();
    }
  }, [isDrawing, animate]);

  const drawImageAtPoint = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const image = imageRef.current;
    const scale = Math.max(1 / gridSize * 6, 0.5);
    const width = image.width * scale;
    const height = image.height * scale;
    const imageX = x - width / 2;
    const imageY = y - height / 2;
  
    // Calculate the radius for the circle - it should fit the image
    const radius = Math.min(width, height) / 2;
  
    // Draw the circle
    ctx.beginPath();
    ctx.arc(x, y, radius + 7, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent white circle
    ctx.fill();
  
    // Draw the image
    ctx.drawImage(image, imageX, imageY, width, height);
  }, [gridSize]);

  const drawImageAtLastAnchor = useCallback((ctx: CanvasRenderingContext2D) => {
    if (imageRef.current.complete) { // Check if the image is loaded
      const [x, y] = gridToCanvas(gridSize, ...shape.getVertex(anchor), canvasRef.current!);
      drawImageAtPoint(ctx, x, y);
    }
  }, [anchor, drawImageAtPoint, gridSize, shape]);

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

    // Main draw function
  const drawAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        draw();
        drawImageAtLastAnchor(ctx);
      }
    }
  }, [draw, drawImageAtLastAnchor]);
  

  useEffect(() => {
    drawAll();
  }, [drawAll]);

  // Function to handle canvas click events
  const onCanvasClick = useCallback((event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    console.log('canvas clicked');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if any vertex was clicked
    for (let i = 0; i < shape.vertices.length; i++) {
      const [vertexX, vertexY] = shape.vertices[i];
      if (isNearPoint(x, y, ...gridToCanvas(gridSize, vertexX, vertexY, canvas), 10)) {
        setAnchor(i);
        return;
      }
    }

    // Check if the center was clicked
    const [centerX, centerY] = shape.getCenter();
    if (isNearPoint(x, y, ...gridToCanvas(gridSize, centerX, centerY, canvas), 10)) {
      setAnchor('center');
      return;
    }
  }, [gridSize, setAnchor, shape]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !isDrawing) {
      canvas.addEventListener('click', onCanvasClick);
    }

    return () => {
      canvas?.removeEventListener('click', onCanvasClick);
    };
  }, [isDrawing, onCanvasClick]);

  return (
    <div className={styles.imageContainer}>
      <canvas ref={canvasRef} width="550" height="550" className={styles.canvas}></canvas>
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

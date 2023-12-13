import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Shape, Matrix, Vertex } from '../utils/geometry';

export type Point2D = {
  x: number;
  y: number;
};


interface ShapeContextValue {
  shape: Shape;
  rotate: number;
  zoom: number;
  x: number;
  y: number;
  isDrawing: boolean;
  isNeedToSave: boolean;
  center: Point2D;
  setCenter: React.Dispatch<React.SetStateAction<Point2D>>;
  radius: number;
  // Set angle of rotation in radians
  setRadius: (newVal: number) => void;
  setZoom: (newVal: number) => void;
  setRotate: (newVal: number) => void;
  setX: (newVal: number) => void;
  setY: (newVal: number) => void;
  anchor: Vertex;
  setAnchor: (newVal: Vertex) => void;
  setShape: React.Dispatch<React.SetStateAction<Shape>>;
  setIsDrawing: (newVal: boolean) => void;
  setIsNeedToSave: (newVal: boolean) => void;
}

function createHexagonVertices(cx: number, cy: number, r: number): Matrix {
  const vertices: Matrix = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i; // 60 degrees for each hexagon vertex
    const angleRad = (Math.PI / 180) * angleDeg;
    vertices.push([
      cx + r * Math.cos(angleRad), // x coordinate
      cy + r * Math.sin(angleRad), // y coordinate
      1 // homogeneous coordinate for affine transformations
    ]);
  }
  return vertices;
}


// Create the context
const ShapeContext = createContext<ShapeContextValue | null>(null);

// Context provider component
export const ShapeProvider = ({ children }: { children: ReactNode}) => {
  const [center, setCenter] = useState<Point2D>({ x: 0, y: 0 });
  const [radius, setRadius] = useState(2);
  const initialVertices = createHexagonVertices(center.x, center.y, radius);
  const [shape, setShape] = useState(new Shape(initialVertices));
  const [rotate, setRotate] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [targetX, setTargetX] = useState(0);
  const [targetY, setTargetY] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isNeedToSave, setIsNeedToSave] = useState(false);
  const [anchor, setAnchor] = useState<Vertex>('center');

  const contextValue: ShapeContextValue = {
    shape: shape,
    rotate,
    zoom,
    x: targetX,
    y: targetY,
    center,
    setCenter,
    radius,
    setRadius,
    isDrawing,
    isNeedToSave,
    anchor,
    setAnchor,
    setZoom,
    setRotate,
    setX: setTargetX,
    setY: setTargetY,
    setShape,
    setIsDrawing,
    setIsNeedToSave
  };

  useEffect(() => {
    setShape(new Shape(createHexagonVertices(center.x, center.y, radius)));
  }, [center, radius]);

  return (
    <ShapeContext.Provider value={contextValue}>
      {children}
    </ShapeContext.Provider>
  );
};

// Custom hook to use the context
export const useShapeInfo = () => {
  const context = useContext(ShapeContext);
  if (!context) {
    throw new Error('useShapeInfo must be used within a ShapeProvider');
  }
  return context;
};

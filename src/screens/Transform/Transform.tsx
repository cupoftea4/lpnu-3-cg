import { useState } from "react";
import GeometryCanvas from "../../components/GeometryCanvas/GeometryCanvas";
import { LeftPanel } from "../../components/LeftPanel"
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import SettingCard from "../../components/SettingCard/SettingCard";
import { TopRightPanel } from "../../components/TopRightPanel"
import { Point2D, useShapeInfo } from "../../context/ShapeContext";
import "./styles.css";

const Transform = () => {
  const [targetPosition, setTargetPosition] = useState<Point2D>({ x: 0, y: 0 });
  const [targetRotate, setTargetRotate] = useState(0);
  const [targetScale, setTargetScale] = useState(1);

  const {
    center,
    setCenter,
    radius,
    setRadius,
    isDrawing,
    setIsDrawing,
    setRotate,
    setZoom,
    setX,
    setY,
  } = useShapeInfo();

  const startTransformation = () => {
    if (!isDrawing) {
      setIsDrawing(true);

      setRotate(targetRotate);
      setZoom(targetScale);
      setX(targetPosition.x);
      setY(targetPosition.y);
    } else {
      console.log('Already drawing');
    }
  };

  const resetShape = () => {
    setIsDrawing(false);
    setRotate(0);
    setZoom(1);
    setX(0);
    setY(0);
    setCenter({ x: 0, y: 0 });
    setRadius(2);
  }

  return (
      <div className="transform">
        <LeftPanel page="page-3" />
        <div className="container">
          <div className="content">
            <div className="top-panel">
              <div className="text-wrapper-2">
                Educational platform - Transformations
              </div>
              <TopRightPanel className="top-right-panel" theme="dark" />
            </div>
            <div className="page">
              <div className="preview">
                <div className="text-wrapper-3">
                  Hexagon
                </div>
                <GeometryCanvas />
                <div className="button-container">
                  <button onClick={() => startTransformation()} className="start-button" >
                    Start transformation
                  </button>
                </div>
              </div>
              <div className="right-panel">
                <div className="text-wrapper-3">
                Initial values:
                </div>
                <SettingCard color="blue">
                  <ProgressBar
                    title="X"
                    steps={200}
                    max={50}
                    min={-50}
                    progressState={[center.x, (x: number) => setCenter(prev => ({ ...prev, x: x}))]} />

                  <ProgressBar
                    title="Y"
                    steps={200}
                    min={-50}
                    max={50}
                    progressState={[center.y, (y: number) => setCenter(prev => ({ ...prev, y}))]} />
                </SettingCard>
                <SettingCard color="orange">
                  <ProgressBar 
                    title="Radius"
                    steps={50} 
                    max={100}
                    progressState={[radius, setRadius]}  />
                </SettingCard>
                <div className="text-wrapper-3">
                Target values:
                </div>
                <SettingCard color="blue">
                  <ProgressBar
                    title="X"
                    steps={200}
                    max={50}
                    min={-50}
                    progressState={[targetPosition.x, (x: number) => setTargetPosition(prev => ({ ...prev, x: x}))]} />

                  <ProgressBar
                    title="Y"
                    steps={200}
                    min={-50}
                    max={50}
                    progressState={[targetPosition.y, (y: number) => setTargetPosition(prev => ({ ...prev, y}))]} />
                </SettingCard>
                <SettingCard color="orange">
                  <ProgressBar 
                    title="Rotation angle"
                    steps={60} 
                    max={360}
                    progressState={[targetRotate, setTargetRotate]}  />
                </SettingCard>
                <SettingCard color="orange">
                  <ProgressBar 
                    title="Scale"
                    steps={20} 
                    max={5}
                    min={0}
                    toFixed={1}
                    progressState={[targetScale, setTargetScale]}  />
                </SettingCard>
                <SettingCard color="green" onClick={() => resetShape()} >
                  Reset
                </SettingCard>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Transform;

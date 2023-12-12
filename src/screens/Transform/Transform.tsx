import { useState } from "react";
import GeometryCanvas from "../../components/GeometryCanvas/GeometryCanvas";
import { LeftPanel } from "../../components/LeftPanel"
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import SettingCard from "../../components/SettingCard/SettingCard";
import { TopRightPanel } from "../../components/TopRightPanel"
import { useShapeInfo } from "../../context/RectangleContext";
import "./styles.css";

type RotationAnchor = "center" | "A" | "B" | "C" | "D" | "E" | "F" | "G";

const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;

const Transform = () => {
  const [rotationAnchor, setRotationAnchor] = useState("center");

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

      const randomRotate = randomInRange(-Math.PI, Math.PI); // Random rotation between -π and π radians
      // const randomZoom = randomInRange(0.5, 1.5); // Random zoom between 0.5x and 2x
      const randomX = randomInRange(-1, 1); // Random x movement between -5 and 5 units
      const randomY = randomInRange(-1, 1); // Random y movement between -5 and 5 units
      setRotate(randomRotate);
      setZoom(1.07);
      setX(randomX);
      setY(randomY);
    } else {
      console.log('Already drawing');
    }
  };

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
                  Rectangle
                </div>
                <GeometryCanvas />
              </div>
              <div className="right-panel">
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
                    steps={200} 
                    max={100}
                    progressState={[radius, setRadius]}  />
                </SettingCard>
                <SettingCard color="orange">
                  <select value={rotationAnchor} onChange={e => setRotationAnchor(e.target.value as RotationAnchor)}>
                    <option value={"center"}>Center</option>
                    <option value={"A"}>A</option>
                    <option value={"B"}>B</option>
                    <option value={"C"}>C</option>
                    <option value={"D"}>D</option>
                    <option value={"E"}>E</option>
                    <option value={"F"}>F</option>
                    <option value={"G"}>G</option>
                  </select>
                </SettingCard>
                <SettingCard color="green" onClick={() => startTransformation()} >
                  Start transformation
                </SettingCard>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Transform;

import { useEffect, useState } from "react";
import { LeftPanel } from "../../components/LeftPanel";
import { TopRightPanel } from "../../components/TopRightPanel";
import { IceFractalCanvas } from "../../components/IceFractalCanvas/IceFractalCanvas";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import SettingCard from "../../components/SettingCard/SettingCard";
import ChooseFunctionSetting from "../../components/ChooseFunctionSetting/ChooseFunctionSetting";
import ChooseColorSetting from "../../components/ChooseColorSetting/ChooseColorSetting";
import { HueColor, NewtonFractal } from "../../components/NewtonFractal/NewtonFractal";
import "./style.css";


const colors: HueColor[] = ["blue", "green", "red", "purple", "yellow", "colorful"];

const functions = ["Ice fractal", "x^3 + c", "x^4 + c", "x^5 + c", "x^6 + c", "x^7 + c"];
enum Functions {
  IceFractal,
  X3,
  X4,
  X5,
  X6,
  X7,
  X8,
}

type OwnProps = {
  onTheoryClick?: () => void;
};

export const Fractals = ({ onTheoryClick }: OwnProps): JSX.Element => {
  const [iterations, setIterations] = useState(2);
 
  const [currentFunction, setCurrentFunction] = useState(Functions.IceFractal);
  const [lengthModifier, setLengthModifier] = useState(0.8);
  const [angleModifier, setAngleModifier] = useState(0.5);
  
  const [color, setColor] = useState<HueColor>("colorful");
  const [vibrance, setVibrance] = useState(0.025); // [0.01, 0.1]
  const [saturation, setSaturation] = useState(1.5); // [0.1, 2.0]
  const [newtonC, setNewtonC] = useState({ x: 0, y: 0 });


  useEffect(() => {
    if (currentFunction === Functions.IceFractal) {
      setIterations(5);
    } else {
      setIterations(50);
    }
  }, [currentFunction]);


  return (
    <div className="dark-fractals">
      <LeftPanel className="left-panel" page="fractals" onTheoryClick={onTheoryClick}/>
      <div className="container">
        <div className="content">
          <div className="top-panel">
            <div className="text-wrapper-2">
              Educational platform - Fractals
            </div>
            <TopRightPanel className="top-right-panel" theme="dark" />
          </div>
          <div className="page">
            <div className="preview">
              <div className="text-wrapper-3">{
                currentFunction === Functions.IceFractal
                  ? "Ice fractal"
                  : `Newton fractal: z^${currentFunction + 2} + (${newtonC.x.toFixed(2)}i + ${newtonC.y.toFixed(2)})`
              }</div>
              <div className="fractal-frame">
                { currentFunction === Functions.IceFractal 
                  ? <IceFractalCanvas iterations={iterations} lengthModifier={lengthModifier} angleModifier={angleModifier} /> 
                  : <NewtonFractal 
                      iterations={iterations} 
                      power={currentFunction + 2} 
                      hueColor={color} 
                      saturation={saturation}
                      vibrance={vibrance}
                      onConstantChange={setNewtonC} 
                    />
                } 
              </div>
            </div>
            <div className="right-panel">
              <ChooseFunctionSetting
                functions={functions}
                setFunction={i => { setCurrentFunction(i) }}
              />
              <SettingCard color="orange">
                <ProgressBar 
                  title="Iterations"
                  steps={currentFunction === Functions.IceFractal ? 10 : 100} 
                  progressState={[iterations, setIterations]}  />
              </SettingCard>
              {
                currentFunction === Functions.IceFractal ? (
                  <>
                    <SettingCard color="green">
                      <ProgressBar 
                        title="Length modifier"
                        steps={100} max={10} 
                        progressState={[lengthModifier, setLengthModifier]} toFixed={1}  />
                    </SettingCard>
                    <SettingCard color="green">
                      <ProgressBar 
                        title="Angle modifier"
                        steps={100} max={1} 
                        progressState={[angleModifier, setAngleModifier]} toFixed={2} />
                    </SettingCard>
                  </>
                ) : (
                  <>
                    <ChooseColorSetting
                      colors={colors}
                      setColor={colorIndex => setColor(colors[colorIndex])}
                    />
                    <SettingCard color="green">
                      <ProgressBar 
                        title="Vibrance"
                        steps={20} max={0.1} 
                        progressState={[vibrance, setVibrance]} toFixed={3} />
                    </SettingCard>
                    <SettingCard color="green">
                    <ProgressBar 
                        title="Saturation"
                        steps={20} max={2} 
                        progressState={[saturation, setSaturation]} toFixed={1}  />
                    </SettingCard>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

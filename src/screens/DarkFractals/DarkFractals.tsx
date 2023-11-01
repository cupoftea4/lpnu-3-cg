import { useEffect, useState } from "react";
import { LeftPanel } from "../../components/LeftPanel";
import { TopRightPanel } from "../../components/TopRightPanel";
import { IceFractalCanvas } from "../../components/IceFractalCanvas/IceFractalCanvas";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import SettingCard from "../../components/SettingCard/SettingCard";
import ChooseFunctionSetting from "../../components/ChooseFunctionSetting/ChooseFunctionSetting";
import { NewtonFractal } from "../../components/NewtonFractal/NewtonFractal";
import "./style.css";
import ChooseColorSetting from "../../components/ChooseColorSetting/ChooseColorSetting";

const functions = ["Ice fractal", "x^3 + c", "x^4 + c", "x^5 + c", "x^6 + c", ];
enum Functions {
  IceFractal,
  X3,
  X4,
  X5,
  X6,
  X7,
  X8,
}

export const DarkFractals = (): JSX.Element => {
  const [iterations, setIterations] = useState(2);
 
  const [currentFunction, setCurrentFunction] = useState(Functions.IceFractal);
  const [lengthModifier, setLengthModifier] = useState(0.8);
  const [angleModifier, setAngleModifier] = useState(0.5);

  useEffect(() => {
    if (currentFunction === Functions.IceFractal) {
      setIterations(5);
    } else {
      setIterations(50);
    }
  }, [currentFunction]);


  return (
    <div className="dark-fractals">
      <LeftPanel className="left-panel" page="fractals" />
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
              <div className="text-wrapper-3">{functions[currentFunction]}</div>
              <div className="fractal-frame">
                { currentFunction === 0 
                  ? <IceFractalCanvas iterations={iterations} lengthModifier={lengthModifier} angleModifier={angleModifier} /> 
                  : <NewtonFractal iterations={iterations} power={currentFunction + 2}/>
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
              <ChooseColorSetting
                colors={["#ff0000", "#00ff00", "#0000ff"]}
                setColor={color => { console.log("set color", color) }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

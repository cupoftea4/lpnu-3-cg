import { FC, MouseEvent, useState } from "react";
import { FunctionIcon } from "../../icons/FunctionIcon"
import { RightArrowIcon } from "../../icons/RightArrowIcon"
import SettingCard from "../SettingCard/SettingCard"
import styles from "./ChooseFunctionSetting.module.css"

type OwnProps = {
  functions: string[];
  setFunction: (funcIndex: number) => void;
}

const ChooseFunctionSetting: FC<OwnProps> = ({ functions, setFunction }) => {
  const [currentPosition, setCurrentPosition] = useState(-1); // -1 means no function is displayed
  console.log("currentPosition", currentPosition) 
  const isChoosing = currentPosition !== -1;

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (currentPosition === -1) {
      setCurrentPosition(0);
    } else {
      setFunction(currentPosition);
      setCurrentPosition(-1);
    }
  } 

  const nextFunction = (e: MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation();
    console.log("next function")
    if (currentPosition === functions.length - 1) {
      setCurrentPosition(-1);
    } else {
      console.log("new func", functions[currentPosition + 1]) 
      setCurrentPosition(currentPosition + 1);
    }
  }

  return (
    <SettingCard color="blue" onClick={onClick} className={isChoosing ? styles.choosing : ""}>
      {currentPosition === -1 ? (
        <div className={styles.container}>
          <FunctionIcon className="function-icon" />
          Choose function
          <RightArrowIcon className={""}/>
        </div>
      ) : (
        <div className={styles.container}>
          <FunctionIcon className="function-icon" />
          {functions[currentPosition]}
          <RightArrowIcon className={""} onClick={nextFunction}/>
        </div>
      )
      }
     
    </SettingCard>
  )
}

export default ChooseFunctionSetting
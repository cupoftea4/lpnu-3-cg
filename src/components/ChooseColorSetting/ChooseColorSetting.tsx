import { FC, MouseEvent, useEffect, useState } from "react";
import { RightArrowIcon } from "../../icons/RightArrowIcon"
import SettingCard from "../SettingCard/SettingCard"
import styles from "./ChooseColorSetting.module.css"

type OwnProps = {
  colors: string[];
  setColor: (color: number) => void;
}

const COLORS_PER_ROW = 5;

export const Color = ({ hex, ...props }: { hex: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props} style={{ backgroundColor: hex, width: "2rem", height: "2rem", borderRadius: ".5rem", display: "inline-block", margin: ".25rem" }}/>
  )
}

const ChooseColorSetting: FC<OwnProps> = ({ colors, setColor }) => {
  const [currentPosition, setCurrentPosition] = useState(-1); // -1 means no colors are displayed
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const isChoosing = currentPosition !== -1;

  useEffect(() => {
    if (currentPosition !== -1) {
      setCurrentColor(colors[currentPosition]);
    }
  }, [currentPosition, colors])

  const onClick = (e: MouseEvent<HTMLButtonElement>, colorIndex: number) => {
    e.stopPropagation();
    if (colorIndex === -1) {
      setCurrentPosition(0);
    } else {
      setColor(colorIndex);
      setCurrentColor(colors[colorIndex]);
      setCurrentPosition(-1);
    }
  } 

  const nextFunction = (e: MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation();
    if (currentPosition === colors.length - 1) {
      setCurrentPosition(-1);
    } else {
      console.log("new color", colors[currentPosition + 1]) 
      setCurrentPosition(currentPosition + 1);
    }
  }

  return (
    <SettingCard color="blue" onClick={(e) => onClick(e, -1)} className={isChoosing ? styles.choosing : ""}>
      {currentPosition === -1 ? (
        <div className={styles.container}>
          <Color hex={currentColor} />
          <span>Choose color</span>
          <RightArrowIcon className={""}/>
        </div>
      ) : (
        <div className={styles.container}>
          {colors.slice(currentPosition * COLORS_PER_ROW, currentPosition * COLORS_PER_ROW + COLORS_PER_ROW).map((color, i) => (
            <Color hex={color} onClick={(e) => onClick(e, currentPosition * COLORS_PER_ROW + i)}  key={i} />
          ))}
          <RightArrowIcon className={""} onClick={nextFunction}/>
        </div>
      )
      }
     
    </SettingCard>
  )
}

export default ChooseColorSetting


import { FC, MouseEvent, useEffect, useState } from "react";
import { RightArrowIcon } from "../../icons/RightArrowIcon"
import SettingCard from "../SettingCard/SettingCard"
import styles from "./ChooseColorSetting.module.css"

type OwnProps = {
  colors: string[];
  setColor: (color: number) => void;
}

const COLORS_PER_ROW = 4;

export const ColorTile = ({ color, ...props }: { color: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  let backgroundColor = color;

  if (color === "colorful") {
    backgroundColor = "linear-gradient(45deg, firebrick, goldenrod, seagreen, darkblue)";
  }

  return (
    <button {...props} style={{ background: backgroundColor, width: "2rem", height: "2rem", borderRadius: ".5rem", display: "inline-block", margin: ".25rem" }}/>
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
          <ColorTile color={currentColor} />
          <span>Choose color</span>
          <RightArrowIcon className={""}/>
        </div>
      ) : (
        <div className={styles.container}>
          {colors.slice(currentPosition * COLORS_PER_ROW, currentPosition * COLORS_PER_ROW + COLORS_PER_ROW).map((color, i) => (
            <ColorTile color={color} onClick={(e) => onClick(e, currentPosition * COLORS_PER_ROW + i)} key={i} />
          ))}
          {currentPosition !== colors.length /3 - 1 && <RightArrowIcon className={""} onClick={nextFunction}/>}
        </div>
      )
      }
     
    </SettingCard>
  )
}

export default ChooseColorSetting

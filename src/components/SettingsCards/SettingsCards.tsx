import { AdjustIcon1 } from "../../icons/AdjustIcon1";
import { RightArrowIcon } from "../../icons/RightArrowIcon";
import { ChevronRight7 } from "../../icons/ChevronRight7";
import { FunctionIcon } from "../../icons/FunctionIcon";
import { SomeText } from "../SomeText";
import "./style.css";

interface Props {
  showChevronRight?: boolean;
  color: "orange-adjustment" | "blue-adjustment" | "blue" | "green" | "orange" | "green-adjustment";
  className: string;
  someTextText: string;
  chevronRight2StyleOverrideClassName: string;
  icon?: JSX.Element;
  someTextDivClassName?: string;
}

export const SettingsCards = ({
  showChevronRight = true,
  color,
  className,
  someTextText = "Some text",
  chevronRight2StyleOverrideClassName,
  icon = <FunctionIcon className="function-icon" />,
  someTextDivClassName,
}: Props): JSX.Element => {
  return (
    <div className={`settings-cards ${color} ${className}`}>
      {["blue", "green", "orange"].includes(color) && (
        <>
          {icon}
          <SomeText
            className={`${color === "green" ? "class" : "class-2"}`}
            divClassName={someTextDivClassName}
            text={someTextText}
          />
          <>{showChevronRight && <RightArrowIcon className={chevronRight2StyleOverrideClassName} color="#F7F9FC" />}</>
        </>
      )}

      {["blue-adjustment", "green-adjustment", "orange-adjustment"].includes(color) && (
        <>
          <AdjustIcon1
            className="adjust-icon"
            color={color === "orange-adjustment" ? "#FFA34C" : color === "green-adjustment" ? "#79E977" : "#4D79FF"}
          />
          <div className="select">
            {showChevronRight && <ChevronRight7 className="chevron-right" />}

            <div className="AAAAAAAA">
              {color === "blue-adjustment" && <>AAAAAAAA</>}

              {color === "orange-adjustment" && (
                <>
                  <div className="rectangle" />
                  <div className="div" />
                  <div className="rectangle-2" />
                </>
              )}

              {color === "green-adjustment" && <>Some text</>}
            </div>
            {showChevronRight && <RightArrowIcon className="chevron-right" color="#F7F9FC" />}
          </div>
        </>
      )}
    </div>
  );
};

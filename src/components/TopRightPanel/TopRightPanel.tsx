import "./style.css";

interface Props {
  theme: "dark" | "light";
  className: string;
}

export const TopRightPanel = ({ theme, className }: Props): JSX.Element => {
  return (
    <div className={`top-right-panel ${className}`}>
      <img
        className={`vuesax-bulk-sun ${theme}`}
        alt="Vuesax bulk sun"
        src={
          theme === "dark"
            ? "https://c.animaapp.com/eWIr2F3Z/img/vuesax-bulk-sun-3.svg"
            : "https://c.animaapp.com/eWIr2F3Z/img/vuesax-bulk-sun-1.svg"
        }
      />
      <div className="frame">
        <img
          className="vector"
          alt="Vector"
          src={
            theme === "dark"
              ? "https://c.animaapp.com/eWIr2F3Z/img/vector-1.svg"
              : "https://c.animaapp.com/eWIr2F3Z/img/vector-3.svg"
          }
        />
      </div>
    </div>
  );
};

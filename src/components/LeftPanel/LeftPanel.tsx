import { Link } from "react-router-dom";
import "./style.css";

interface Props {
  page: "fractals" | "page-2" | "page-3" | "page-4";
  className?  : string;
  onTheoryClick?: () => void;
}

export const LeftPanel = ({ page, className, onTheoryClick }: Props): JSX.Element => {
  return (
    <div className={`left-panel ${className}`}>
      <div className="top">
        <img
          className="logo"
          alt="Logo"
          src="https://c.animaapp.com/HYZupsIx/img/logo-4@2x.png"
        />
        <div className="navigation">
          <div className={`selected ${page}`}>
            <div className="div" />
            <div className="rectangle" />
          </div>
          <Link to="/">
            <img
              className="img"
              alt="Fractals button" 
              src={
                page === "fractals"
                  ? "https://c.animaapp.com/HYZupsIx/img/fractals-button-4.svg"
                  : "https://c.animaapp.com/HYZupsIx/img/fractals-button-3.svg"
              }
            />
          </Link>
          <Link to="/colors">
            <img
              className="img-2"
              alt="Colors button"
              src={
                page === "page-2"
                  ? "https://c.animaapp.com/HYZupsIx/img/colors-button-1.svg"
                  : page === "page-3"
                  ? "https://c.animaapp.com/HYZupsIx/img/colors-button-2.svg"
                  : page === "page-4"
                  ? "https://c.animaapp.com/HYZupsIx/img/colors-button-3.svg"
                  : "https://c.animaapp.com/HYZupsIx/img/colors-button-4.svg"
              }
            />
          </Link>
          <Link to="/transformations">
            <img
              className="img-2"
              alt="Transform button"
              src={
                page === "page-2"
                  ? "https://c.animaapp.com/HYZupsIx/img/transform-button-1.svg"
                  : page === "page-3"
                  ? "https://c.animaapp.com/HYZupsIx/img/transform-button-2.svg"
                  : page === "page-4"
                  ? "https://c.animaapp.com/HYZupsIx/img/transform-button-3.svg"
                  : "https://c.animaapp.com/HYZupsIx/img/transform-button-4.svg"
              }
            />
          </Link>
          <Link to="/tests">
            <img
              className="img-2"
              alt="Tests button"
              src={
                page === "page-3"
                  ? "https://c.animaapp.com/HYZupsIx/img/tests-button-2.svg"
                  : page === "page-4"
                  ? "https://c.animaapp.com/HYZupsIx/img/tests-button-3.svg"
                  : "https://c.animaapp.com/HYZupsIx/img/tests-button-4.svg"
              }
            />
          </Link>
        </div>
      </div>
      <div className="bottom" onClick={() => onTheoryClick?.()}>
        {
          page !== "page-4" &&
          <>
            <div className="achievements" />
            <img
              className="img"
              alt="Help"
              src="https://c.animaapp.com/HYZupsIx/img/help-4.svg"
            />
          </>
        }
      </div>
    </div>
  );
};

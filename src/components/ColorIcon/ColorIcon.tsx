import "./style.css";

interface Props {
  className: string;
}

export const ColorIcon = ({ className }: Props): JSX.Element => {
  return <div className={`color-icon ${className}`} />;
};

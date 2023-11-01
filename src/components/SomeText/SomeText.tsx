import "./style.css";

interface Props {
  className: string;
  divClassName?: string;
  text: string;
}

export const SomeText = ({ className, divClassName, text = "Some text" }: Props): JSX.Element => {
  return (
    <div className={`some-text ${className}`}>
      <div className={`text-wrapper ${divClassName}`}>{text}</div>
    </div>
  );
};

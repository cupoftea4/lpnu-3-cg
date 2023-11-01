import { MouseEvent } from "react";

interface Props {
  color?: string;
  className: string;
  onClick?: (e: MouseEvent<HTMLOrSVGElement>) => void;
}

export const RightArrow = ({ color = "var(--main-color)", className, onClick }: Props): JSX.Element => {
  return (
    <svg
      onClick={onClick}
      className={`chevron-right-2 ${className}`}
      fill="none"
      height="25"
      viewBox="0 0 27 25"
      width="27"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        clipRule="evenodd"
        d="M11.9054 17.6C11.6286 17.6 11.3519 17.502 11.1411 17.307C10.7184 16.916 10.7184 16.284 11.1411 15.893L14.714 12.588L11.2762 9.29498C10.8621 8.89698 10.874 8.26398 11.3032 7.88098C11.7335 7.49798 12.4178 7.50898 12.8319 7.90498L17.007 11.905C17.4167 12.298 17.4113 12.921 16.994 13.307L12.6697 17.307C12.4589 17.502 12.1821 17.6 11.9054 17.6Z"
        fill={color}
        fillRule="evenodd"
      />
    </svg>
  );
};

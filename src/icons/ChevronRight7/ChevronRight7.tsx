interface Props {
  className: string;
}

export const ChevronRight7 = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`chevron-right-7 ${className}`}
      fill="none"
      height="25"
      viewBox="0 0 27 25"
      width="27"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        clipRule="evenodd"
        d="M15.1486 7.20001C15.4254 7.20001 15.7021 7.29801 15.913 7.49301C16.3357 7.88401 16.3357 8.51601 15.913 8.90701L12.34 12.212L15.7778 15.505C16.1919 15.903 16.18 16.536 15.7508 16.919C15.3205 17.302 14.6362 17.291 14.2221 16.895L10.047 12.895C9.63728 12.502 9.64268 11.879 10.06 11.493L14.3843 7.49301C14.5951 7.29801 14.8719 7.20001 15.1486 7.20001Z"
        fill="#F7F9FC"
        fillRule="evenodd"
      />
    </svg>
  );
};

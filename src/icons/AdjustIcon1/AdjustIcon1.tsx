interface Props {
  color: string;
  className: string;
}

export const AdjustIcon1 = ({ color = "#FFA34C", className }: Props): JSX.Element => {
  return (
    <svg
      className={`adjust-icon-1 ${className}`}
      fill="none"
      height="31"
      viewBox="0 0 30 31"
      width="30"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="path"
        d="M2.63923 14.3863C2.08088 14.7851 2.08088 15.6149 2.63923 16.0137L10.4188 21.5706C11.0806 22.0433 12 21.5702 12 20.7568V9.6432C12 8.82983 11.0806 8.3567 10.4188 8.82947L2.63923 14.3863ZM27.3608 16.0137C27.9191 15.6149 27.9191 14.7851 27.3608 14.3863L19.5812 8.82947C18.9194 8.35671 18 8.82983 18 9.6432V20.7568C18 21.5702 18.9194 22.0433 19.5812 21.5706L27.3608 16.0137Z"
        fill={color}
      />
    </svg>
  );
};

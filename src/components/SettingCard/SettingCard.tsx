import { FC } from 'react';
import './SettingCard.css';

type OwnProps = {
  color: string;
  children: React.ReactNode;
}

const SettingCard: FC<OwnProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (
  { color, children, ...divProps }
) => {
  return (
    <button  {...divProps} className={`setting-card ${color} ` + divProps.className}>
      {children}
    </button>
  );
};

export default SettingCard;

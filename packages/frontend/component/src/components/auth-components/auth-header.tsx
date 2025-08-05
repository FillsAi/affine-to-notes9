import clsx from 'clsx';
import type { FC } from 'react';

import notes9Logo from './notes9-logo.png';
import { authHeaderWrapper } from './share.css';

export const AuthHeader: FC<{
  title: string;
  subTitle?: string;
  className?: string;
}> = ({ title, subTitle, className }) => {
  return (
    <div className={clsx(authHeaderWrapper, className)}>
      <p>
        <img
          src={notes9Logo}
          alt="notes9"
          className="logo"
          style={{ width: '24px', height: '24px' }}
        />
        {title}
      </p>
      <p>{subTitle}</p>
    </div>
  );
};

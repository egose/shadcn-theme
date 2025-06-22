import React from 'react';

interface UnstyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function UnstyledButton({ className, ...props }: UnstyledButtonProps) {
  return (
    <button
      type="button"
      className={`appearance-none bg-none border-none p-0 m-0 text-inherit font-inherit ${className ?? ''}`}
      {...props}
    />
  );
}

interface LinkPlaceholderProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export function LinkPlaceholder({ children, onClick }: LinkPlaceholderProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();

        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </div>
  );
}

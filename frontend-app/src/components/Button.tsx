import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  ...props
}) => {
  const base =
    'px-5 py-3 rounded-md font-semibold transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    outline: 'border border-primary text-primary hover:bg-primary-muted',
    ghost: 'text-primary hover:underline',
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
};

import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className,
  ...props
}) => {
  const base = 'px-5 py-2 rounded-full font-semibold transition-all focus:outline-none';

  const variants = {
    primary: 'bg-green-dark text-white hover:bg-green',
    outline: 'border border-green-dark text-green-dark hover:bg-green-muted',
    ghost: 'text-green-dark hover:underline',
  };

  return <button className={clsx(base, variants[variant], className)} {...props} />;
};

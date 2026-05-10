import { ReactNode } from "react";

type ButtonVariant = "confirm" | "cancel" | "add" | "neutral";

interface ButtonProps {
  variant: ButtonVariant;
  onClick?: () => void;
  children: ReactNode;
}

export const Button = ({ variant, onClick, children }: ButtonProps) => {
  const classes: Record<ButtonVariant, string> = {
    confirm: "btn-confirm",
    cancel: "btn-cancel",
    add: "btn-add",
    neutral: "btn-neutral",
  };

  return (
    <button className={classes[variant]} onClick={onClick}>
      {children}
    </button>
  );
};

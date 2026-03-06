import { type ReactNode } from "react";

interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: ReactNode;
}

export const Toast = ({
  title,
  description,
  variant = "default",
}: ToastProps) => {
  const bgColor = variant === "destructive" ? "bg-red-500" : "bg-blue-500";
  return (
    <div className={`${bgColor} text-white p-4 rounded-md shadow-lg`}>
      <p className="font-semibold">{title}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
};

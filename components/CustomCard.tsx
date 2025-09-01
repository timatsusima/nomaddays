import { Card } from "./ui/card";
import { ReactNode } from "react";

interface CustomCardProps {
  children: ReactNode;
  variant?: "default" | "brand" | "warning" | "danger" | "success";
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function CustomCard({ 
  children, 
  variant = "default", 
  className = "", 
  onClick, 
  interactive = false 
}: CustomCardProps) {
  const variants = {
    default: "bg-surface border-border hover:bg-hover",
    brand: "bg-brand/5 border-brand/20 hover:bg-brand/10",
    warning: "bg-yellow/5 border-yellow/20 hover:bg-yellow/10",
    danger: "bg-red/5 border-red/20 hover:bg-red/10",
    success: "bg-green/5 border-green/20 hover:bg-green/10",
  };

  const cardClasses = `
    ${variants[variant]}
    ${interactive || onClick ? "cursor-pointer transition-colors" : ""}
    ${className}
  `;

  return (
    <Card className={cardClasses} onClick={onClick}>
      {children}
    </Card>
  );
}
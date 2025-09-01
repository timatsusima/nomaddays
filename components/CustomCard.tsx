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
    default: "bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--hover)]",
    brand: "bg-[var(--brand)]/5 border-[var(--brand)]/20 hover:bg-[var(--brand)]/10",
    warning: "bg-[var(--yellow)]/5 border-[var(--yellow)]/20 hover:bg-[var(--yellow)]/10",
    danger: "bg-[var(--red)]/5 border-[var(--red)]/20 hover:bg-[var(--red)]/10",
    success: "bg-[var(--green)]/5 border-[var(--green)]/20 hover:bg-[var(--green)]/10",
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
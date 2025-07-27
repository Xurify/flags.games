import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhaseContentProps {
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  title: string;
  description: string;
  actionButton?: {
    text: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link";
  };
  additionalContent?: React.ReactNode;
}

export default function PhaseContent({
  icon: Icon,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
  title,
  description,
  actionButton,
  additionalContent
}: PhaseContentProps) {
  return (
    <div className="text-center">
      <div className={`w-16 h-16 mx-auto mb-4 ${iconBgColor} rounded-full flex items-center justify-center`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4">{description}</p>
      
      {additionalContent}
      
      {actionButton && (
        <Button 
          onClick={actionButton.onClick}
          variant={actionButton.variant || "default"}
          className="mt-4"
        >
          {actionButton.icon && <actionButton.icon className="w-4 h-4 mr-2" />}
          {actionButton.text}
        </Button>
      )}
    </div>
  );
} 
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import SettingsButton from "./SettingsButton";

interface SettingsSelectProps<T extends string | number> {
  icon: React.ReactNode;
  label: string;
  value: T;
  options: {
    value: T;
    label: string;
    disabled?: boolean;
  }[];
  onValueChange: (value: T) => void;
  renderValue?: (value: T) => string;
  disabled?: boolean;
}

export function SettingsSelect<T extends string | number>({
  icon,
  label,
  value,
  options,
  onValueChange,
  renderValue,
  disabled,
}: SettingsSelectProps<T>) {
  const displayValue = renderValue ? renderValue(value) : String(value);

  return (
    <Select
      value={String(value)}
      onValueChange={(value) => {
        const isNumber = typeof value === "number";
        onValueChange((isNumber ? Number(value) : value) as T);
      }}
      disabled={disabled}
    >
      <SelectTrigger asChild>
        <SettingsButton icon={icon} label={label} value={displayValue} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
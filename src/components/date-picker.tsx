import { CalendarIcon } from "lucide-react";
import { ChangeEvent, JSX, KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";
import { cn, formatDate, isValidDate } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type IDatePickerProps = {
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  displayFormat?: string;
  initialValue?: Date;
  onChange?(value: string): void;
};

export const DatePicker = ({
  placeholder,
  disabled,
  className,
  initialValue = new Date(),
  displayFormat = "DD MMM YYYY",
  onChange,
}: Readonly<IDatePickerProps>): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(initialValue);
  const [month, setMonth] = useState<Date | undefined>(date);

  const handleSubmit = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // @ts-expect-error: Input type is not defined in the types
    const { value } = e.target;

    const date = new Date(value);

    if (isValidDate(date)) {
      setDate(date);
      setMonth(date);
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
    }
  }, []);

  const handleFocus = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const handleCalendarSelect = useCallback((date: Date) => {
    setDate(date);
    setOpen(false);
  }, []);

  const display = useMemo(() => {
    return formatDate(date, displayFormat);
  }, [date, displayFormat]);

  useEffect(() => {
    if (onChange) onChange(formatDate(date));
  }, [date, onChange]);

  return (
    <div className="relative flex gap-2">
      <Input
        id="date"
        value={display}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(className, "bg-background pr-10")}
        onFocus={handleFocus}
        onChange={handleSubmit}
        onKeyDown={handleKeyDown}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id="date-picker" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
          <Calendar mode="single" selected={date} captionLayout="dropdown" month={month} onMonthChange={setMonth} onSelect={handleCalendarSelect} />
        </PopoverContent>
      </Popover>
    </div>
  );
};

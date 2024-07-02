import React, { useState, useEffect } from 'react'

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange?: (startDate: Date, endDate: Date) => void;
}

const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const parseDateFromInput = (input: string): Date => {
  return new Date(input);
};

const DateRangePicker = (props: DateRangePickerProps) => {
  const [start, setStart] = useState<string>(formatDateForInput(props.startDate));
  const [end, setEnd] = useState<string>(formatDateForInput(props.endDate));

  useEffect(() => {
    if (props.onChange) {
      props.onChange(parseDateFromInput(start), parseDateFromInput(end));
    }
  }, [start, end, props.onChange]);

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStart(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnd(event.target.value);
  };

  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
      <div>
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={start}
          onChange={handleStartDateChange}
        />
      </div>
      <div>
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={end}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
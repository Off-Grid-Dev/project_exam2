import { startOfMonth, getDay, getDaysInMonth } from 'date-fns';
import { useEffect, useState, type FC, type MouseEvent } from 'react';

type DayProps = {
  date?: number;
  day?: string;
  fill: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: (date: number) => void;
};

type CalendarProps = {
  // called with UTC-midnight ISO strings when both start and end are selected
  onRangeSelect?: (dateFromISO: string, dateToISO: string) => void;
  // array of ISO date strings (UTC or local) representing disabled/booked dates
  disabledDates?: string[];
  initialMonth?: number;
  initialYear?: number;
};

function Calendar({
  onRangeSelect,
  disabledDates = [],
  initialMonth,
  initialYear,
}: CalendarProps) {
  const [month, setMonth] = useState<number>(() => {
    const saved = localStorage.getItem('calendarMonth');
    if (initialMonth !== undefined) return initialMonth;
    return saved !== null && saved !== '' ? Number(saved) : 7;
  });

  const [year, setYear] = useState<number>(() => {
    const saved = localStorage.getItem('calendarYear');
    if (initialYear !== undefined) return initialYear;
    return saved !== null && saved !== '' ? Number(saved) : 2025;
  });

  const weekDays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];

  const baseDate = new Date(year, month);
  const firstDayOfMonth = startOfMonth(baseDate);
  const offset = getDay(firstDayOfMonth);
  const calDays = getDaysInMonth(baseDate);

  const findRestDays = (val1: number, val2: number) => {
    let total = 0;
    const takenDays = val1 + val2;
    while (total < takenDays) {
      total += 7;
    }
    return total - takenDays;
  };
  const restDays = findRestDays(offset, calDays);

  const Day: FC<DayProps> = ({
    fill,
    date,
    day,
    isSelected,
    isDisabled,
    onClick,
  }) => {
    if (fill) {
      return <div className='aspect-square'></div>;
    }

    return (
      <button
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          if (isDisabled) return;
          if (onClick && date) onClick(date);
        }}
        disabled={isDisabled}
        className={`group grid aspect-square cursor-pointer border-2 text-center transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 ${
          isSelected
            ? 'border-green-300 hover:border-green-400'
            : 'border-slate-50/10 hover:border-slate-50/20'
        }`}
      >
        <span className='h-fit bg-slate-800 text-sm text-white'>{date}</span>
        <span className='text-xs text-transparent transition-all duration-200 group-hover:text-slate-200/30'>
          {day}
        </span>
      </button>
    );
  };

  // selection state: store day numbers (1-based)
  const [selectedStart, setSelectedStart] = useState<number | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<number | null>(null);

  // precompute disabled set for quick lookup (normalize to YYYY-MM-DD)
  const disabledSet = new Set(disabledDates || []);

  const normalizeToUTCDateISO = (y: number, m: number, d: number) => {
    // Date.UTC(year, monthIndex, day) returns ms at 00:00:00 UTC
    return new Date(Date.UTC(y, m, d)).toISOString();
  };

  const handleDayClick = (dayNum: number) => {
    // if no start selected, set start
    if (selectedStart === null) {
      setSelectedStart(dayNum);
      setSelectedEnd(null);
      return;
    }

    // if start exists and no end, and clicked day >= start => set end
    if (selectedStart !== null && selectedEnd === null) {
      if (dayNum >= selectedStart) {
        setSelectedEnd(dayNum);
        // notify parent with ISO strings
        if (onRangeSelect) {
          const fromISO = normalizeToUTCDateISO(year, month, selectedStart);
          const toISO = normalizeToUTCDateISO(year, month, dayNum);
          onRangeSelect(fromISO, toISO);
        }
        return;
      }
      // clicked before start -> make it the new start
      setSelectedStart(dayNum);
      setSelectedEnd(null);
      return;
    }

    // if both selected, start a new selection
    setSelectedStart(dayNum);
    setSelectedEnd(null);
  };

  const renderDays = (start: number, populated: number, end: number) => {
    const startDays = Array.from({ length: start });
    const populatedDays = Array.from({ length: populated });
    const endDays = Array.from({ length: end });

    const startEls = startDays.map((_, idx) => (
      <Day fill={true} key={`s${idx}`} />
    ));
    const populatedEls = populatedDays.map((_, idx) => {
      const weekDayIdx = (idx + start) % 7;
      const date = idx + 1;
      const iso = normalizeToUTCDateISO(year, month, date);
      const isDisabled = disabledSet.has(iso);
      const isSelected =
        (selectedStart !== null &&
          selectedEnd === null &&
          selectedStart === date) ||
        (selectedStart !== null &&
          selectedEnd !== null &&
          date >= selectedStart &&
          date <= selectedEnd);

      return (
        <Day
          fill={false}
          date={date}
          day={weekDays[weekDayIdx]}
          key={`p${idx}`}
          isSelected={isSelected}
          isDisabled={isDisabled}
          onClick={handleDayClick}
        />
      );
    });
    const endEls = endDays.map((_, idx) => <Day fill={true} key={`e${idx}`} />);

    return [startEls, populatedEls, endEls];
  };

  useEffect(() => {
    localStorage.setItem('calendarMonth', month.toString());
    localStorage.setItem('calendarYear', year.toString());
  }, [month, year]);

  return (
    <div className='flex min-h-screen bg-indigo-700'>
      <div className='mx-auto mt-8 mb-auto grid justify-center rounded-lg border-2 border-slate-200 bg-indigo-900 p-4'>
        <div className='mx-3 mb-2 flex justify-between'>
          <h1 className='text-3xl text-slate-100 text-shadow-amber-600 text-shadow-lg'>
            {months[month].slice(0, 1).toUpperCase() + months[month].slice(1)}
          </h1>
          <h2 className='text-3xl text-slate-100 text-shadow-amber-600 text-shadow-lg'>
            {year}
          </h2>
        </div>
        <div className='grid grid-cols-7 border-slate-50/10 p-2 shadow shadow-amber-300/20'>
          {weekDays.map((day, idx) => (
            <div className='bg-slate-800 text-center text-white' key={idx}>
              {day.slice(0, 1).toUpperCase() + day.slice(1, 3)}
            </div>
          ))}
          {renderDays(offset, calDays, restDays)}
        </div>

        <div className='my-4 grid gap-3'>
          <div className='group flex justify-center gap-3'>
            <button
              className='grid cursor-pointer place-content-center rounded-lg bg-white px-2 pb-1 font-semibold text-slate-800 group-hover:bg-slate-200'
              onClick={() => setMonth((prev) => prev - 1)}
            >
              prev
            </button>
            <span className='rounded-lg border border-white bg-slate-700 px-3 text-white group-hover:bg-slate-800'>
              MONTH
            </span>
            <button
              className='grid cursor-pointer place-content-center rounded-lg bg-white px-2 pb-1 font-semibold text-slate-800 group-hover:bg-slate-200'
              onClick={() => setMonth((prev) => prev + 1)}
            >
              next
            </button>
          </div>
          <div className='group flex justify-center gap-3'>
            <button
              className='grid cursor-pointer place-content-center rounded-lg bg-white px-2 pb-1 font-semibold text-slate-800 group-hover:bg-slate-200'
              onClick={() => setYear((prev) => prev - 1)}
            >
              prev
            </button>
            <span className='rounded-lg border border-white bg-slate-700 px-3 text-white group-hover:bg-slate-800'>
              YEAR
            </span>
            <button
              className='grid cursor-pointer place-content-center rounded-lg bg-white px-2 pb-1 font-semibold text-slate-800 group-hover:bg-slate-200'
              onClick={() => setYear((prev) => prev + 1)}
            >
              next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;

import { startOfMonth, getDay, getDaysInMonth } from 'date-fns';
import { useEffect, useState, useRef, type FC, type MouseEvent } from 'react';
import { useToast } from '../context/toast/useToast';
import { expandRangeToISODates } from '../utils/dates';

type DayProps = {
  date?: number;
  day?: string;
  fill: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isConflict?: boolean;
  onClick?: (date: number) => void;
};

type CalendarProps = {
  onRangeSelect?: (
    dateFromISO: string,
    dateToISO: string,
    conflicts?: string[],
  ) => void;
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
    isConflict,
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
          isConflict
            ? 'border-rose-400 bg-rose-600/30 hover:border-rose-500'
            : isSelected
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

  const [selectedStart, setSelectedStart] = useState<Date | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(null);
  const selectedStartRef = useRef<Date | null>(null);
  const selectedEndRef = useRef<Date | null>(null);

  const disabledSet = new Set(disabledDates || []);

  // toast helper — use the hook (component is wrapped by ToastProvider at app root)
  const { addToast } = useToast();

  const normalizeToUTCDateISO = (date: Date) => {
    // produce ISO at UTC midnight for given date
    return new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
    ).toISOString();
  };

  const handleDayClick = (dayNum: number) => {
    const clicked = new Date(Date.UTC(year, month, dayNum));
    if (selectedStartRef.current === null) {
      setSelectedStart(clicked);
      selectedStartRef.current = clicked;
      setSelectedEnd(null);
      selectedEndRef.current = null;
      return;
    }

    if (selectedStartRef.current !== null && selectedEndRef.current === null) {
      if (clicked.getTime() >= selectedStartRef.current.getTime()) {
        setSelectedEnd(clicked);
        selectedEndRef.current = clicked;
        if (onRangeSelect) {
          const fromISO = normalizeToUTCDateISO(selectedStartRef.current);
          const toISO = normalizeToUTCDateISO(clicked);
          const fullRange = expandRangeToISODates(fromISO, toISO);
          const conflicts = fullRange.filter((d) => disabledSet.has(d));
          if (conflicts.length > 0) {
            addToast({
              type: 'error',
              text: 'The dates you have chosen are not available',
            });
          }
          onRangeSelect(fromISO, toISO, conflicts);
        }
        return;
      }
      setSelectedStart(clicked);
      selectedStartRef.current = clicked;
      setSelectedEnd(null);
      selectedEndRef.current = null;
      return;
    }

    setSelectedStart(clicked);
    selectedStartRef.current = clicked;
    setSelectedEnd(null);
    selectedEndRef.current = null;
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
      const dayDate = new Date(Date.UTC(year, month, date));
      const iso = normalizeToUTCDateISO(dayDate);
      const isDisabled = disabledSet.has(iso);
      let isSelected = false;
      let isConflict = false;
      if (selectedStart && selectedEnd) {
        isSelected =
          dayDate.getTime() >= selectedStart.getTime() &&
          dayDate.getTime() <= selectedEnd.getTime();
        if (isSelected && isDisabled) isConflict = true;
      } else if (selectedStart && !selectedEnd) {
        isSelected = dayDate.getTime() === selectedStart.getTime();
      }

      return (
        <Day
          fill={false}
          date={date}
          day={weekDays[weekDayIdx]}
          key={`p${idx}`}
          isSelected={isSelected}
          isDisabled={isDisabled}
          isConflict={isConflict}
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
          <h2 className='text-3xl text-slate-100 text-shadow-amber-600 text-shadow-lg'>
            {months[month].slice(0, 1).toUpperCase() + months[month].slice(1)}
          </h2>
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

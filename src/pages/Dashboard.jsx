import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ContractDetailModal from '../components/ContractDetailModal';
import { listContracts, updateContract } from '../api/contracts';

const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const STATUS_DOT_COLORS = {
  Loaded: 'bg-blue-500',
  'Unl. & New Loading Point': 'bg-red-500',
  Unloading: 'bg-green-500',
  'Load/Unload': 'bg-amber-500',
  Problems: 'bg-red-500',
  'Cross the Border': 'bg-teal-500',
  'Still no info': 'bg-purple-500',
  Unloaded: 'bg-emerald-500',
};

function getWeekStart(d) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getWeekDates(aroundDate) {
  const start = getWeekStart(aroundDate);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatWeekRange(monday) {
  const fri = addDays(monday, 4);
  return `${monday.getDate()} ${MONTHS[monday.getMonth()]} – ${fri.getDate()} ${MONTHS[fri.getMonth()]} ${fri.getFullYear()}`;
}

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--color-primary)" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const FilterIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="white" stroke="#485CFF" strokeWidth="1.5"/>
    <path d="M19.1084 11.75L15 18.3333M14.5 11.75H25.5C26.4167 11.75 27.1667 12.5 27.1667 13.4167V15.25C27.1667 15.9167 26.75 16.75 26.3334 17.1667L22.75 20.3333C22.25 20.75 21.9167 21.5833 21.9167 22.25V25.8333C21.9167 26.3333 21.5834 27 21.1667 27.25L20 28C18.9167 28.6667 17.4167 27.9167 17.4167 26.5833V22.1667C17.4167 21.5833 17.0834 20.8333 16.75 20.4167L13.5834 17.0833C13.1667 16.6667 12.8334 15.9167 12.8334 15.4167V13.5C12.8334 12.5 13.5834 11.75 14.5 11.75Z" stroke="#485CFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="white" stroke="#485CFF" strokeWidth="1.5"/>
    <path d="M16.6667 11.6666V14.1666M23.3333 11.6666V14.1666M12.9167 17.575H27.0833M23.0792 21.4166H23.0867M23.0792 23.9166H23.0867M19.9958 21.4166H20.0042M19.9958 23.9166H20.0042M16.9117 21.4166H16.92M16.9117 23.9166H16.92M27.5 17.0833V24.1666C27.5 26.6666 26.25 28.3333 23.3333 28.3333H16.6667C13.75 28.3333 12.5 26.6666 12.5 24.1666V17.0833C12.5 14.5833 13.75 12.9166 16.6667 12.9166H23.3333C26.25 12.9166 27.5 14.5833 27.5 17.0833Z" stroke="#485CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);
const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ContractsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="5" fill="#485CFF"/>
    <g clipPath="url(#clip0_contracts)">
      <path d="M17.5 24.1666V19.1666M17.5 19.1666L15.8333 20.8333M17.5 19.1666L19.1666 20.8333M28.3333 18.3333V22.5C28.3333 26.6666 26.6666 28.3333 22.5 28.3333H17.5C13.3333 28.3333 11.6666 26.6666 11.6666 22.5V17.5C11.6666 13.3333 13.3333 11.6666 17.5 11.6666H21.6666M28.3333 18.3333H25C22.5 18.3333 21.6666 17.5 21.6666 15V11.6666M28.3333 18.3333L21.6666 11.6666" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_contracts">
        <rect width="20" height="20" fill="white" transform="translate(10 10)"/>
      </clipPath>
    </defs>
  </svg>
);

export default function Dashboard() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Detail modal
  const [selectedContract, setSelectedContract] = useState(null);

  // Drag state
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const didDragRef = useRef(false);

  const goToPreviousWeek = () => setWeekStart((prev) => addDays(prev, -7));
  const goToNextWeek = () => setWeekStart((prev) => addDays(prev, 7));
  const goToThisWeek = () => { setWeekStart(getWeekStart(new Date())); setCalendarOpen(false); };

  const weekDates = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const dateStrings = useMemo(() => weekDates.map(toDateString), [weekDates]);

  const fetchContracts = useCallback(() => {
    setLoading(true);
    listContracts()
      .then((list) => setContracts(list))
      .catch(() => setContracts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchContracts(); }, [fetchContracts]);

  const contractsByDay = useMemo(() => {
    const byDay = [[], [], [], [], []];
    contracts.forEach((c) => {
      const dateStr = typeof c.loadingDate === 'string' ? c.loadingDate.slice(0, 10) : '';
      const idx = dateStrings.indexOf(dateStr);
      if (idx >= 0) byDay[idx].push(c);
    });
    return byDay;
  }, [contracts, dateStrings]);

  const formatDayHeader = (d) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

  // ─── Drag handlers ────────────────────────────────────────────────────────

  const handleDragStart = (e, contract) => {
    didDragRef.current = true;
    setDraggingId(contract.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(contract.id));
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverDay(null);
    // give click handler a chance to read the flag before resetting
    setTimeout(() => { didDragRef.current = false; }, 50);
  };

  const handleDragOver = (e, dayIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDay(dayIndex);
  };

  const handleDragLeave = (e, dayIndex) => {
    // only clear if leaving the column entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDay((prev) => (prev === dayIndex ? null : prev));
    }
  };

  const handleDrop = async (e, targetDayIndex) => {
    e.preventDefault();
    setDragOverDay(null);

    const id = Number(e.dataTransfer.getData('text/plain'));
    const contract = contracts.find((c) => c.id === id);
    if (!contract) return;

    const newLoadingDate = toDateString(weekDates[targetDayIndex]);
    if (newLoadingDate === String(contract.loadingDate).slice(0, 10)) return;

    // shift unloading date by the same delta to keep it valid
    const oldLoad = new Date(contract.loadingDate);
    const oldUnload = new Date(contract.unloadingDate);
    const deltaDays = Math.round((new Date(newLoadingDate) - oldLoad) / 86400000);
    const newUnloadingDate = toDateString(addDays(oldUnload, deltaDays));

    // optimistic update
    setContracts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, loadingDate: newLoadingDate, unloadingDate: newUnloadingDate } : c
      )
    );

    try {
      await updateContract(id, {
        contractNr: contract.contractNr,
        clientName: contract.clientName,
        carrierName: contract.carrierName,
        loadingDate: newLoadingDate,
        unloadingDate: newUnloadingDate,
        status: contract.status,
        loadingReference: contract.loadingReference,
        unloadingReference: contract.unloadingReference,
        quantity: contract.quantity,
        quantityUnit: contract.quantityUnit,
        itemType: contract.itemType,
        price: contract.price,
        comment: contract.comment,
      });
    } catch {
      // revert on error
      setContracts((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, loadingDate: contract.loadingDate, unloadingDate: contract.unloadingDate }
            : c
        )
      );
    }
  };

  const handleCardClick = (c) => {
    if (didDragRef.current) return;
    setSelectedContract(c);
  };

  return (
    <DashboardLayout>
      {(openUploadModal) => (
        <div className="space-y-4">
          {/* Header bar */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <ChartIcon />
              <h1 className="text-xl font-semibold text-[var(--color-primary)]">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 relative">
              <button className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity" aria-label="Filter">
                <FilterIcon />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCalendarOpen((o) => !o)}
                  className={`rounded-lg overflow-hidden hover:opacity-90 transition-opacity ${calendarOpen ? 'ring-2 ring-[var(--color-primary)] ring-offset-2' : ''}`}
                  aria-label="Choose week"
                  aria-expanded={calendarOpen}
                >
                  <CalendarIcon />
                </button>
                {calendarOpen && (
                  <>
                    <div className="fixed inset-0 z-10" aria-hidden onClick={() => setCalendarOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 z-20 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-4">
                      <p className="text-sm font-medium text-gray-800 mb-3">{formatWeekRange(weekStart)}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={goToPreviousWeek}
                          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                        >
                          <ChevronLeftIcon /> Previous week
                        </button>
                        <button
                          type="button"
                          onClick={goToNextWeek}
                          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium"
                        >
                          Next week <ChevronRightIcon />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={goToThisWeek}
                        className="w-full mt-2 py-2 rounded-lg border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 text-sm font-medium"
                      >
                        Go to this week
                      </button>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={openUploadModal}
                className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                aria-label="Upload contract"
              >
                <ContractsIcon />
              </button>
            </div>
          </div>

          {/* Weekly board */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-5 divide-x divide-gray-200">
              {DAY_LABELS.map((dayLabel, dayIndex) => {
                const isOver = dragOverDay === dayIndex;
                return (
                  <div
                    key={dayLabel}
                    className={`min-h-[500px] flex flex-col transition-colors duration-150 ${isOver ? 'bg-[var(--color-primary)]/5' : ''}`}
                    onDragOver={(e) => handleDragOver(e, dayIndex)}
                    onDragLeave={(e) => handleDragLeave(e, dayIndex)}
                    onDrop={(e) => handleDrop(e, dayIndex)}
                  >
                    {/* Day header */}
                    <div className={`flex items-center justify-between p-4 border-b border-gray-200 transition-colors ${isOver ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20' : 'bg-gray-50'}`}>
                      <span className="font-medium text-gray-800 text-sm">
                        {dayLabel}{' '}
                        {weekDates[dayIndex] && (
                          <span className="text-gray-500 font-normal">({formatDayHeader(weekDates[dayIndex])})</span>
                        )}
                      </span>
                      <span className="text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {contractsByDay[dayIndex].length}
                      </span>
                    </div>

                    {/* Drop zone + cards */}
                    <div className={`flex-1 p-3 space-y-1.5 ${isOver ? 'ring-2 ring-inset ring-[var(--color-primary)]/30' : ''}`}>
                      {loading ? (
                        <p className="text-sm text-gray-400 pt-2">Loading…</p>
                      ) : contractsByDay[dayIndex].length === 0 ? (
                        <div className={`h-full min-h-[60px] flex items-center justify-center rounded-lg border-2 border-dashed transition-colors ${isOver ? 'border-[var(--color-primary)]/50 bg-[var(--color-primary)]/5' : 'border-gray-100'}`}>
                          {isOver
                            ? <p className="text-xs text-[var(--color-primary)] font-medium">Drop here</p>
                            : <p className="text-xs text-gray-300">No contracts</p>
                          }
                        </div>
                      ) : (
                        <>
                          {contractsByDay[dayIndex].map((c) => {
                            const isDragging = draggingId === c.id;
                            return (
                              <div
                                key={c.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, c)}
                                onDragEnd={handleDragEnd}
                                onClick={() => handleCardClick(c)}
                                className={`
                                  group flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
                                  cursor-grab active:cursor-grabbing select-none
                                  transition-all duration-150
                                  ${isDragging
                                    ? 'opacity-40 border-[var(--color-primary)] bg-[var(--color-primary)]/5 scale-95'
                                    : 'border-gray-200 bg-white hover:border-[var(--color-primary)]/40 hover:shadow-sm hover:bg-gray-50'
                                  }
                                `}
                              >
                                <span
                                  className={`shrink-0 w-2 h-2 rounded-full ${STATUS_DOT_COLORS[c.status] ?? 'bg-gray-400'}`}
                                  aria-hidden
                                />
                                <span className="flex-1 truncate text-gray-800">{c.contractNr}</span>
                                <svg className="w-3 h-3 text-gray-300 group-hover:text-gray-400 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>
                              </div>
                            );
                          })}
                          {/* Drop indicator when dragging over a populated column */}
                          {isOver && draggingId !== null && (
                            <div className="h-1 rounded-full bg-[var(--color-primary)]/40 mx-1" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contract detail modal */}
          {selectedContract && (
            <ContractDetailModal
              contract={selectedContract}
              onClose={() => setSelectedContract(null)}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

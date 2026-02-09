import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="var(--color-primary)" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const EllipsisIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

// Filter button - blue border, white bg
const FilterIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="white" stroke="#485CFF" strokeWidth="1.5"/>
    <path d="M19.1084 11.75L15 18.3333M14.5 11.75H25.5C26.4167 11.75 27.1667 12.5 27.1667 13.4167V15.25C27.1667 15.9167 26.75 16.75 26.3334 17.1667L22.75 20.3333C22.25 20.75 21.9167 21.5833 21.9167 22.25V25.8333C21.9167 26.3333 21.5834 27 21.1667 27.25L20 28C18.9167 28.6667 17.4167 27.9167 17.4167 26.5833V22.1667C17.4167 21.5833 17.0834 20.8333 16.75 20.4167L13.5834 17.0833C13.1667 16.6667 12.8334 15.9167 12.8334 15.4167V13.5C12.8334 12.5 13.5834 11.75 14.5 11.75Z" stroke="#485CFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Calendar button - blue border, white bg
const CalendarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
    <rect x="0.5" y="0.5" width="39" height="39" rx="4.5" fill="white" stroke="#485CFF" strokeWidth="1.5"/>
    <path d="M16.6667 11.6666V14.1666M23.3333 11.6666V14.1666M12.9167 17.575H27.0833M23.0792 21.4166H23.0867M23.0792 23.9166H23.0867M19.9958 21.4166H20.0042M19.9958 23.9166H20.0042M16.9117 21.4166H16.92M16.9117 23.9166H16.92M27.5 17.0833V24.1666C27.5 26.6666 26.25 28.3333 23.3333 28.3333H16.6667C13.75 28.3333 12.5 26.6666 12.5 24.1666V17.0833C12.5 14.5833 13.75 12.9166 16.6667 12.9166H23.3333C26.25 12.9166 27.5 14.5833 27.5 17.0833Z" stroke="#485CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Contracts/Upload button - solid blue
const ContractsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
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
  return (
    <DashboardLayout>
      {(openUploadModal) => (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ChartIcon />
            <h1 className="text-xl font-semibold text-[var(--color-primary)]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity" aria-label="Filter">
              <FilterIcon />
            </button>
            <button className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity" aria-label="Calendar">
              <CalendarIcon />
            </button>
            <button
              onClick={openUploadModal}
              className="rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
              aria-label="Upload contract"
            >
              <ContractsIcon />
            </button>
          </div>
        </div>

        {/* Weekly schedule - days only, no cells */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 divide-x divide-gray-200">
            {DAYS.map((day) => (
              <div key={day} className="min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                  <span className="font-medium text-gray-800">{day}</span>
                  <button className="p-1 rounded hover:bg-gray-200 text-gray-500">
                    <EllipsisIcon />
                  </button>
                </div>
                <div className="flex-1 min-h-[360px] bg-white" />
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </DashboardLayout>
  );
}

interface AOICollapsedButtonProps {
  count: number;
  onClick: () => void;
}

export function AOICollapsedButton({ count, onClick }: AOICollapsedButtonProps) {
  return (
    <button
      onClick={onClick}
      className="mx-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center gap-2"
      aria-label="Open AOI list"
      aria-expanded="false"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
      AOIs ({count})
    </button>
  );
}

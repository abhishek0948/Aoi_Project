interface AOIHeaderProps {
  count: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function AOIHeader({ count, onToggle }: AOIHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
      <h3 className="text-lg font-semibold text-gray-800">
        Areas of Interest ({count})
      </h3>
      <button
        onClick={onToggle}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Close AOI list"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

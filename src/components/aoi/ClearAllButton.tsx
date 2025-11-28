interface ClearAllButtonProps {
  onClick: () => void;
}

export function ClearAllButton({ onClick }: ClearAllButtonProps) {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <button
        onClick={onClick}
        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        aria-label="Clear all AOIs"
      >
        Clear All AOIs
      </button>
    </div>
  );
}

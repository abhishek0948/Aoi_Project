interface AOIEmptyStateProps {}

export function AOIEmptyState({}: AOIEmptyStateProps) {
  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <p className="text-gray-500 text-center py-8">
        No AOIs created yet. Use the drawing tools to create one.
      </p>
    </div>
  );
}

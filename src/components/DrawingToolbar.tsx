import type { DrawingMode } from '../types';

interface DrawingToolbarProps {
  drawingMode: DrawingMode;
  onModeChange: (mode: DrawingMode) => void;
}

export default function DrawingToolbar({ drawingMode, onModeChange }: DrawingToolbarProps) {
  const tools = [
    { mode: 'point' as const, label: 'Point', icon: '📍' },
    { mode: 'polygon' as const, label: 'Polygon', icon: '⬠' },
    { mode: 'rectangle' as const, label: 'Rectangle', icon: '▭' },
    { mode: 'edit' as const, label: 'Edit', icon: '✏️' },
    { mode: 'delete' as const, label: 'Delete', icon: '🗑️' },
  ];

  return (
    <div className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 z-1000">
      <div className="flex flex-col gap-1.5 md:gap-2 items-stretch p-2 md:p-3 bg-white rounded-lg shadow-lg border border-gray-200" role="toolbar" aria-label="Drawing tools">
        <div className="flex flex-col gap-1.5 md:gap-2">
          {tools.map((tool) => (
            <button
              key={tool.mode}
              className={`px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-base rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                drawingMode === tool.mode
                  ? tool.mode === 'delete'
                    ? 'bg-red-600 text-white'
                    : tool.mode === 'edit'
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onModeChange(drawingMode === tool.mode ? null : tool.mode)}
              aria-pressed={drawingMode === tool.mode}
              aria-label={`${tool.label} mode`}
              title={`${tool.label} mode`}
            >
              <span className="mr-1 md:mr-2" aria-hidden="true">
                {tool.icon}
              </span>
              <span className="hidden sm:inline">{tool.label}</span>
            </button>
          ))}
          {drawingMode && (
            <button
              onClick={() => onModeChange(null)}
              className="px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-base rounded-md font-medium transition-all duration-200 bg-red-600 text-white hover:bg-red-700 whitespace-nowrap"
              aria-label="Cancel drawing"
              title="Cancel drawing"
            >
              <span className="hidden sm:inline">Cancel</span>
              <span className="sm:hidden">✕</span>
            </button>
          )}
        </div>
        {drawingMode === 'polygon' && (
          <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2 hidden md:block">
            Click to add points, double-click to finish
          </p>
        )}
        {drawingMode === 'rectangle' && (
          <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2 hidden md:block">Click two corners to draw rectangle</p>
        )}
        {drawingMode === 'edit' && (
          <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2 hidden md:block">Click a shape to edit it</p>
        )}
        {drawingMode === 'delete' && (
          <p className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2 hidden md:block">Click a shape to delete it</p>
        )}
      </div>
    </div>
  );
}

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
    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-1000">
      <div className="flex flex-col gap-2 items-stretch p-3 bg-white rounded-lg shadow-lg border border-gray-200" role="toolbar" aria-label="Drawing tools">
        <div className="flex flex-col gap-2">
          {tools.map((tool) => (
            <button
              key={tool.mode}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
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
              <span className="mr-2" aria-hidden="true">
                {tool.icon}
              </span>
              {tool.label}
            </button>
          ))}
          {drawingMode && (
            <button
              onClick={() => onModeChange(null)}
              className="px-4 py-2 rounded-md font-medium transition-all duration-200 bg-red-600 text-white hover:bg-red-700"
              aria-label="Cancel drawing"
              title="Cancel drawing"
            >
              Cancel
            </button>
          )}
        </div>
        {drawingMode === 'polygon' && (
          <p className="text-sm text-gray-600 mt-2">
            Click to add points, double-click to finish
          </p>
        )}
        {drawingMode === 'rectangle' && (
          <p className="text-sm text-gray-600 mt-2">Click two corners to draw rectangle</p>
        )}
        {drawingMode === 'edit' && (
          <p className="text-sm text-gray-600 mt-2">Click a shape to edit it</p>
        )}
        {drawingMode === 'delete' && (
          <p className="text-sm text-gray-600 mt-2">Click a shape to delete it</p>
        )}
      </div>
    </div>
  );
}

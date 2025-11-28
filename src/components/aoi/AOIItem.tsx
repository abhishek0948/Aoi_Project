import type { AOIFeature } from '../../types';

interface AOIItemProps {
  feature: AOIFeature;
  isEditing: boolean;
  editName: string;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onNameChange: (name: string) => void;
  onRemove: () => void;
  onFeatureClick?: () => void;
}

export function AOIItem({
  feature,
  isEditing,
  editName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onNameChange,
  onRemove,
  onFeatureClick,
}: AOIItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 mb-2 transition-all hover:shadow-md">
      <div className="flex items-start gap-3 flex-1">
        <div
          className="w-4 h-4 rounded-full mt-1 shrink-0"
          style={{ backgroundColor: feature.color }}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => onNameChange(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Edit AOI name"
              />
              <button
                onClick={onSaveEdit}
                className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                aria-label="Save"
              >
                ✓
              </button>
              <button
                onClick={onCancelEdit}
                className="px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                aria-label="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onFeatureClick}
                className="font-medium text-gray-800 hover:text-blue-600 text-left w-full"
              >
                {feature.name}
              </button>
              <AOIItemDetails feature={feature} />
            </>
          )}
        </div>
        {!isEditing && (
          <AOIItemActions onEdit={onStartEdit} onRemove={onRemove} />
        )}
      </div>
    </div>
  );
}

function AOIItemDetails({ feature }: { feature: AOIFeature }) {
  const formatArea = (area: number) => {
    if (area > 1000000) {
      return `${(area / 1000000).toFixed(2)} km²`;
    }
    return `${area.toFixed(2)} m²`;
  };

  return (
    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
      <span className="capitalize">{feature.type}</span>
      {feature.area && <span>{formatArea(feature.area)}</span>}
      <span>{new Date(feature.createdAt).toLocaleDateString()}</span>
    </div>
  );
}

function AOIItemActions({ onEdit, onRemove }: { onEdit: () => void; onRemove: () => void }) {
  return (
    <div className="flex gap-1">
      <button
        onClick={onEdit}
        className="p-1 text-gray-500 hover:text-blue-600"
        aria-label="Edit AOI name"
        title="Edit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
      </button>
      <button
        onClick={onRemove}
        className="p-1 text-gray-500 hover:text-red-600"
        aria-label="Delete AOI"
        title="Delete"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

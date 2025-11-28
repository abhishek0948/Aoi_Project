import type { AOIFeature } from '../../types';
import { AOIItem } from './AOIItem';

interface AOIListContentProps {
  features: AOIFeature[];
  editingId: string | null;
  editName: string;
  onStartEdit: (feature: AOIFeature) => void;
  onSaveEdit: (id: string) => void;
  onCancelEdit: () => void;
  onNameChange: (name: string) => void;
  onRemove: (id: string) => void;
  onFeatureClick?: (feature: AOIFeature) => void;
}

export function AOIListContent({
  features,
  editingId,
  editName,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onNameChange,
  onRemove,
  onFeatureClick,
}: AOIListContentProps) {
  return (
    <div className="p-4 flex-1 overflow-y-auto">
      <div className="space-y-2">
        {features.map((feature) => (
          <AOIItem
            key={feature.id}
            feature={feature}
            isEditing={editingId === feature.id}
            editName={editName}
            onStartEdit={() => onStartEdit(feature)}
            onSaveEdit={() => onSaveEdit(feature.id)}
            onCancelEdit={onCancelEdit}
            onNameChange={onNameChange}
            onRemove={() => onRemove(feature.id)}
            onFeatureClick={() => onFeatureClick?.(feature)}
          />
        ))}
      </div>
    </div>
  );
}

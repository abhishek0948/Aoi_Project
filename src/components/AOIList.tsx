import { useState } from 'react';
import type { AOIFeature } from '../types';
import { AOIHeader } from './aoi/AOIHeader';
import { AOICollapsedButton } from './aoi/AOICollapsedButton';
import { AOIEmptyState } from './aoi/AOIEmptyState';
import { AOIListContent } from './aoi/AOIListContent';
import { ClearAllButton } from './aoi/ClearAllButton';

interface AOIListProps {
  features: AOIFeature[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<AOIFeature>) => void;
  onClearAll: () => void;
  onFeatureClick?: (feature: AOIFeature) => void;
}

export default function AOIList({
  features,
  onRemove,
  onUpdate,
  onClearAll,
  onFeatureClick,
}: AOIListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleStartEdit = (feature: AOIFeature) => {
    setEditingId(feature.id);
    setEditName(feature.name);
  };

  const handleSaveEdit = (id: string) => {
    onUpdate(id, { name: editName });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="h-full flex flex-col">
      <p className="text-sm text-black  mb-1 mx-4">Area of Interests: </p>
      {!isOpen ? (
        <AOICollapsedButton count={features.length} onClick={() => setIsOpen(true)} />
      ) : (
        <div
          className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden h-full flex flex-col m-4"
          role="region"
          aria-label="Area of Interest list"
        >
          <AOIHeader count={features.length} isOpen={isOpen} onToggle={() => setIsOpen(false)} />

          {features.length === 0 ? (
            <AOIEmptyState />
          ) : (
            <>
              <AOIListContent
                features={features}
                editingId={editingId}
                editName={editName}
                onStartEdit={handleStartEdit}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onNameChange={setEditName}
                onRemove={onRemove}
                onFeatureClick={onFeatureClick}
              />
              <ClearAllButton onClick={onClearAll} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

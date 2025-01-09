import { Database } from 'lucide-react';
import { useEntity } from '@/context/EntityContext';
import { EmptyState } from './EmptyState';
import { EntityTable } from './EntityTable';

export function EntityList() {
  const { entities, handleEdit, handleDelete } = useEntity();

  return (
    <div className="overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Database className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Entities List</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your entities here</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        {entities.length === 0 ? (
          <EmptyState />
        ) : (
          <EntityTable entities={entities} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
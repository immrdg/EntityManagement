import { Edit2, Trash2 } from 'lucide-react';
import { Entity } from '@/types';

interface EntityTableProps {
  entities: Entity[];
  onEdit: (entity: Entity) => void;
  onDelete: (entityId: string) => void;
}

export function EntityTable({ entities, onEdit, onDelete }: EntityTableProps) {
  return (
    <div className="min-w-[800px]">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity ID</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Code</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency/Card Type</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GL Number</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geo</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Career</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {entities.map((entity) => (
            <tr key={entity.entityId} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{entity.entityId}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{entity.companyCode}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {entity.type === 'N' ? entity.currency : entity.cardType}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{entity.glNumber}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{entity.geo}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{entity.career || '-'}</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex gap-3">
                  <button
                    onClick={() => onEdit(entity)}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                    title="Edit entity"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(entity.entityId)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                    title="Delete entity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
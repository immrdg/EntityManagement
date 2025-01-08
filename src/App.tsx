import { useState } from 'react';
import { Edit2, Trash2, Plus, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FormData {
  type: 'N' | 'C';
  id: string;
  companyCode: string;
  currency?: string;
  cardType?: string;
  glNumber: string;
  geo: string;
  career?: string;
}

interface Entity extends FormData {
  entityId: string;
}

export default function App() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [formData, setFormData] = useState<FormData>({
    type: 'N',
    id: '',
    companyCode: '',
    currency: '',
    glNumber: '',
    geo: '',
    career: '',
    cardType: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entityId = `${formData.type}${formData.id}`;
    
    if (editingId) {
      setEntities(prev => 
        prev.map(entity => 
          entity.entityId === editingId 
            ? { ...formData, entityId }
            : entity
        )
      );
      setEditingId(null);
      toast.success('Entity updated successfully');
    } else {
      if (entities.some(entity => entity.entityId === entityId)) {
        toast.error('Entity ID must be unique!', {
          icon: <AlertCircle className="h-5 w-5" />
        });
        return;
      }
      setEntities(prev => [...prev, { ...formData, entityId }]);
      toast.success('Entity added successfully');
    }
    
    handleClear();
  };

  const handleClear = () => {
    setFormData({
      type: 'N',
      id: '',
      companyCode: '',
      currency: '',
      glNumber: '',
      geo: '',
      career: '',
      cardType: ''
    });
    setEditingId(null);
  };

  const handleEdit = (entity: Entity) => {
    setFormData({
      type: entity.type,
      id: entity.id,
      companyCode: entity.companyCode,
      currency: entity.currency,
      cardType: entity.cardType,
      glNumber: entity.glNumber,
      geo: entity.geo,
      career: entity.career
    });
    setEditingId(entity.entityId);
  };

  const handleDelete = (entityId: string) => {
    setEntities(prev => prev.filter(entity => entity.entityId !== entityId));
    toast.success('Entity deleted successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen grid grid-cols-[450px_1fr]">
        {/* Form Section */}
        <div className="p-6 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="sticky top-0 bg-white pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {editingId ? 'Edit Entity' : 'Add New Entity'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {editingId ? 'Update the entity details below' : 'Fill in the details to add a new entity'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(value) => handleInputChange({ target: { name: 'type', value }} as never)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="N">Normal</SelectItem>
                    <SelectItem value="C">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="Enter ID"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Code</label>
                <input
                  type="text"
                  name="companyCode"
                  value={formData.companyCode}
                  onChange={handleInputChange}
                  maxLength={4}
                  placeholder="4 digits"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              {formData.type === 'N' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    type="text"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    maxLength={3}
                    placeholder="3 chars"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
                  <input
                    type="text"
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleInputChange}
                    maxLength={4}
                    placeholder="4 chars"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GL Number</label>
                <input
                  type="text"
                  name="glNumber"
                  value={formData.glNumber}
                  onChange={handleInputChange}
                  placeholder="Enter GL number"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geo</label>
                <input
                  type="text"
                  name="geo"
                  value={formData.geo}
                  onChange={handleInputChange}
                  placeholder="Enter geo"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
            </div>

            {formData.type === 'C' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Career</label>
                <input
                  type="text"
                  name="career"
                  value={formData.career}
                  onChange={handleInputChange}
                  placeholder="Enter career"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                {editingId ? (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Update Entity
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Entity
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <X className="w-4 h-4" />
                Clear Form
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-semibold text-gray-900">Entities List</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your entities here</p>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Code</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Currency/Card Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GL Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Geo</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Career</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {entities.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No entities added yet. Start by adding a new entity.
                    </td>
                  </tr>
                ) : (
                  entities.map((entity) => (
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
                            onClick={() => handleEdit(entity)}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                            title="Edit entity"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entity.entityId)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete entity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
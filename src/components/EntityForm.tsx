import { useState, useEffect } from 'react';
import { Edit2, Plus, X, Building2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData } from '@/types';
import { FormField } from './FormField';
import { useEntity } from '@/context/EntityContext';

export function EntityForm() {
  const { editingId, formData: initialData, handleSubmit: onSubmit, handleClear: onClear } = useEntity();
  const [formData, setFormData] = useState<FormData>(initialData);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setHasChanges(false);
  }, [initialData]);

  useEffect(() => {
    if (editingId) {
      const hasFormChanges = Object.entries(formData).some(([key, value]) => {
        // Skip empty string comparison for optional fields if they're undefined in initial data
        if (value === '' && initialData[key as keyof FormData] === undefined) {
          return false;
        }
        return value !== initialData[key as keyof FormData];
      });
      setHasChanges(hasFormChanges);
    }
  }, [formData, initialData, editingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: 'N' | 'C') => {
    if (!editingId) {
      setFormData(prev => ({ ...prev, type: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6 bg-white border-b lg:border-r border-gray-200 overflow-y-auto">
      <div className="sticky top-0 bg-white pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {editingId ? 'Edit Entity' : 'Add New Entity'}
          </h2>
        </div>
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
              onValueChange={handleTypeChange}
              disabled={!!editingId}
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
          <FormField
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            placeholder="Enter ID"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Company Code"
            name="companyCode"
            value={formData.companyCode}
            onChange={handleInputChange}
            maxLength={4}
            placeholder="4 digits"
            required
          />

          {formData.type === 'N' ? (
            <FormField
              label="Currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              maxLength={3}
              placeholder="3 chars"
              required
            />
          ) : (
            <FormField
              label="Card Type"
              name="cardType"
              value={formData.cardType}
              onChange={handleInputChange}
              maxLength={4}
              placeholder="4 chars"
              required
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="GL Number"
            name="glNumber"
            value={formData.glNumber}
            onChange={handleInputChange}
            placeholder="Enter GL number"
            required
          />

          <FormField
            label="Geo"
            name="geo"
            value={formData.geo}
            onChange={handleInputChange}
            placeholder="Enter geo"
            required
          />
        </div>

        {formData.type === 'C' && (
          <FormField
            label="Career"
            name="career"
            value={formData.career}
            onChange={handleInputChange}
            placeholder="Enter career"
            required
          />
        )}

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            className={`flex-1 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
              editingId
                ? hasChanges
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={editingId && !hasChanges}
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
            onClick={onClear}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
          >
            <X className="w-4 h-4" />
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
import { useState } from 'react';
import { toast } from 'sonner';
import { EntityForm } from '@/components/EntityForm';
import { EntityList } from '@/components/EntityList';
import { FormData, Entity } from '@/types';

const initialFormData: FormData = {
  type: 'N',
  id: '',
  companyCode: '',
  currency: '',
  glNumber: '',
  geo: '',
  career: '',
  cardType: ''
};

export default function App() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleSubmit = (data: FormData) => {
    const entityId = `${data.type}${data.id}`;

    if (editingId) {
      setEntities(prev =>
          prev.map(entity =>
              entity.entityId === editingId
                  ? { ...data, entityId }
                  : entity
          )
      );
      setEditingId(null);
      toast.success('Entity updated successfully');
    } else {
      if (entities.some(entity => entity.entityId === entityId)) {
        toast.error('Entity ID must be unique!');
        return;
      }
      setEntities(prev => [...prev, { ...data, entityId }]);
      toast.success('Entity added successfully');
    }

    handleClear();
  };

  const handleClear = () => {
    setFormData({ ...initialFormData });
    setEditingId(null);
  };

  const handleEdit = (entity: Entity) => {
    setFormData({
      type: entity.type,
      id: entity.id,
      companyCode: entity.companyCode,
      currency: entity.currency || '',
      cardType: entity.cardType || '',
      glNumber: entity.glNumber,
      geo: entity.geo,
      career: entity.career || ''
    });
    setEditingId(entity.entityId);
  };

  const handleDelete = (entityId: string) => {
    setEntities(prev => prev.filter(entity => entity.entityId !== entityId));
    toast.success('Entity deleted successfully');
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-screen grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]">
          <EntityForm
              onSubmit={handleSubmit}
              onClear={handleClear}
              editingId={editingId}
              initialData={formData}
          />
          <EntityList
              entities={entities}
              onEdit={handleEdit}
              onDelete={handleDelete}
          />
        </div>
      </div>
  );
}
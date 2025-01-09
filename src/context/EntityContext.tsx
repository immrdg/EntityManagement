import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { Entity, FormData } from '@/types';

interface EntityContextType {
  entities: Entity[];
  editingId: string | null;
  formData: FormData;
  handleSubmit: (data: FormData) => void;
  handleClear: () => void;
  handleEdit: (entity: Entity) => void;
  handleDelete: (entityId: string) => void;
}

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

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export function EntityProvider({ children }: { children: ReactNode }) {
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
    <EntityContext.Provider
      value={{
        entities,
        editingId,
        formData,
        handleSubmit,
        handleClear,
        handleEdit,
        handleDelete
      }}
    >
      {children}
    </EntityContext.Provider>
  );
}

export function useEntity() {
  const context = useContext(EntityContext);
  if (context === undefined) {
    throw new Error('useEntity must be used within an EntityProvider');
  }
  return context;
}
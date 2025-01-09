import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { Entity, FormData } from '@/types';
import { useNotifications } from './NotificationContext';

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

const STORAGE_KEY = 'entityhub_entities';

const EntityContext = createContext<EntityContextType | undefined>(undefined);

export function EntityProvider({ children }: { children: ReactNode }) {
  const [entities, setEntities] = useState<Entity[]>(() => {
    const savedEntities = localStorage.getItem(STORAGE_KEY);
    return savedEntities ? JSON.parse(savedEntities) : [];
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { addNotification } = useNotifications();

  // Persist entities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
  }, [entities]);

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
      toast.success('Entity updated successfully', {
        description: `Entity ${entityId} has been updated.`,
        duration: 4000,
      });
      addNotification({
        title: 'Entity Updated',
        description: `Entity ${entityId} has been updated successfully.`,
        type: 'success'
      });
    } else {
      if (entities.some(entity => entity.entityId === entityId)) {
        toast.error('Entity creation failed', {
          description: 'An entity with this ID already exists.',
          duration: 5000,
        });
        addNotification({
          title: 'Entity Creation Failed',
          description: 'An entity with this ID already exists.',
          type: 'error'
        });
        return;
      }
      setEntities(prev => [...prev, { ...data, entityId }]);
      toast.success('Entity created successfully', {
        description: `Entity ${entityId} has been created.`,
        duration: 4000,
      });
      addNotification({
        title: 'Entity Created',
        description: `Entity ${entityId} has been created successfully.`,
        type: 'success'
      });
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
    toast.info('Editing entity', {
      description: `Now editing entity ${entity.entityId}`,
      duration: 3000,
    });
    addNotification({
      title: 'Editing Entity',
      description: `Now editing entity ${entity.entityId}`,
      type: 'info'
    });
  };

  const handleDelete = (entityId: string) => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setEntities(prev => prev.filter(entity => entity.entityId !== entityId));
          resolve(true);
        }, 500);
      }),
      {
        loading: 'Deleting entity...',
        success: `Entity ${entityId} has been deleted`,
        error: 'Failed to delete entity',
        duration: 4000,
      }
    );
    addNotification({
      title: 'Entity Deleted',
      description: `Entity ${entityId} has been deleted successfully.`,
      type: 'success'
    });
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
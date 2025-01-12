import { EntityForm } from '@/components/EntityForm';
import { EntityList } from '@/components/EntityList';
import { EntityProvider } from '@/context/EntityContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SuperNav } from '@/components/SuperNav';
import { ExpressionEvaluator } from '@/components/ExpressionEvaluator';
import { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState<'entities' | 'evaluator'>('entities');

  return (
    <NotificationProvider>
      <EntityProvider>
        <div className="min-h-screen bg-gray-50">
          <SuperNav onViewChange={setCurrentView} currentView={currentView} />
          {currentView === 'entities' ? (
            <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]">
              <EntityForm />
              <EntityList />
            </div>
          ) : (
            <ExpressionEvaluator />
          )}
        </div>
      </EntityProvider>
    </NotificationProvider>
  );
}
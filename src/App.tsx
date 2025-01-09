import { EntityForm } from '@/components/EntityForm';
import { EntityList } from '@/components/EntityList';
import { EntityProvider } from '@/context/EntityContext';
import { SuperNav } from '@/components/SuperNav';

export default function App() {
  return (
    <EntityProvider>
      <div className="min-h-screen bg-gray-50">
        <SuperNav />
        <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]">
          <EntityForm />
          <EntityList />
        </div>
      </div>
    </EntityProvider>
  );
}
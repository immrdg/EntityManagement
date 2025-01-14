import { EntityForm } from '@/components/EntityForm';
import { EntityList } from '@/components/EntityList';
import { EntityProvider } from '@/context/EntityContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SuperNav } from '@/components/SuperNav';
import { ExpressionEvaluator } from '@/components/ExpressionEvaluator';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <NotificationProvider>
        <EntityProvider>
          <div className="min-h-screen bg-gray-50">
            <SuperNav />
            <Routes>
              <Route path="/" element={
                <div className="h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr]">
                  <EntityForm />
                  <EntityList />
                </div>
              } />
              <Route path="/evaluator" element={<ExpressionEvaluator />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </EntityProvider>
      </NotificationProvider>
    </Router>
  );
}
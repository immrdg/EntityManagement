import { CircleDashed } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <CircleDashed className="w-8 h-8 text-gray-400 animate-spin-slow" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No entities yet</h3>
      <p className="text-sm text-gray-500 mb-4 max-w-sm">
        Start by adding a new entity using the form on the left. Your entities will appear here.
      </p>
    </div>
  );
}
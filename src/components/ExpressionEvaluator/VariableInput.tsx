import { useState, useEffect } from 'react';
import { Variable } from 'lucide-react';

interface VariableInputProps {
  variables: string[];
  onEvaluate: (values: Record<string, string>) => void;
}

export function VariableInput({ variables, onEvaluate }: VariableInputProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const initialValues = variables.reduce((acc, variable) => {
      acc[variable] = '';
      return acc;
    }, {} as Record<string, string>);
    setValues(initialValues);
  }, [variables]);

  const handleInputChange = (variable: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleEvaluate = () => {
    onEvaluate(values);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Variable className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Variable Values</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter values for the variables in your expression
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {variables.map(variable => (
          <div key={variable} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              {variable}
            </label>
            <input
              type="text"
              value={values[variable] || ''}
              onChange={(e) => handleInputChange(variable, e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder={`Enter value for ${variable}`}
            />
          </div>
        ))}

        <button
          onClick={handleEvaluate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Evaluate Expression
        </button>
      </div>
    </div>
  );
}
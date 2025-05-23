import { useState, useEffect } from 'react';
import { Variable } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VariableInputProps {
  variables: string[];
  onEvaluate: (values: Record<string, string | null>) => void;
}

export function VariableInput({ variables, onEvaluate }: VariableInputProps) {
  const [values, setValues] = useState<Record<string, string | null>>({});
  const [inputTypes, setInputTypes] = useState<Record<string, 'text' | 'null'>>({});

  useEffect(() => {
    const initialValues = variables.reduce((acc, variable) => {
      acc[variable] = '';
      return acc;
    }, {} as Record<string, string | null>);

    const initialInputTypes = variables.reduce((acc, variable) => {
      acc[variable] = 'text';
      return acc;
    }, {} as Record<string, 'text' | 'null'>);

    setValues(initialValues);
    setInputTypes(initialInputTypes);
  }, [variables]);

  const handleInputChange = (variable: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleInputTypeChange = (variable: string, type: 'text' | 'null') => {
    setInputTypes(prev => ({
      ...prev,
      [variable]: type
    }));

    setValues(prev => ({
      ...prev,
      [variable]: type === 'null' ? null : ''
    }));
  };

  const handleEvaluate = () => {
    const processedValues = Object.entries(values).reduce((acc, [key, value]) => {
      acc[key] = inputTypes[key] === 'null' ? null : value;
      return acc;
    }, {} as Record<string, string | null>);

    onEvaluate(processedValues);
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
            For each variable, choose whether to provide a text value or set it as null
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {variables.map(variable => (
          <div key={variable} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {variable}
            </label>
            <div className="flex gap-3">
              <Select
                value={inputTypes[variable]}
                onValueChange={(value: 'text' | 'null') => handleInputTypeChange(variable, value)}
              >
                <SelectTrigger className="w-[140px] bg-blue-50 border-blue-200 hover:bg-blue-100 transition-colors">
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Value</SelectItem>
                  <SelectItem value="null">Set as Null</SelectItem>
                </SelectContent>
              </Select>

              {inputTypes[variable] === 'text' ? (
                <input
                  type="text"
                  value={values[variable] || ''}
                  onChange={(e) => handleInputChange(variable, e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder={`Enter value for ${variable}`}
                />
              ) : (
                <div className="flex-1 px-3 py-2 rounded-lg border border-blue-200 bg-blue-50 flex items-center justify-between">
                  <span className="font-mono text-blue-600">null</span>
                  <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded">Variable will be null in evaluation</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={handleEvaluate}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
          Evaluate Expression
        </button>
      </div>
    </div>
  );
}

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
            Enter values for the variables in your expression or set them as null
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
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Input</SelectItem>
                  <SelectItem value="null">Null</SelectItem>
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
                <div className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500">
                  null
                </div>
              )}
            </div>
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
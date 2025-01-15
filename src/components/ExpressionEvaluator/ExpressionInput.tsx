import { useState } from 'react';
import { Code2, AlertCircle, Info } from 'lucide-react';

interface ExpressionInputProps {
  onValidExpression: (expression: string, variables: string[]) => void;
}

export function ExpressionInput({ onValidExpression }: ExpressionInputProps) {
  const [expression, setExpression] = useState('');
  const [error, setError] = useState<string | null>(null);

  const validateExpression = () => {
    try {
      // Extract variable names from get() functions
      const getPattern = /get\(['"]([^'"]+)['"]\)/g;
      const variables: string[] = [];
      let match;

      while ((match = getPattern.exec(expression)) !== null) {
        variables.push(match[1]);
      }

      // Basic syntax validation
      // Convert get() to actual function calls for validation
      const validationCode = expression
          .replace(/get\(['"](.*?)['"]\)/g, '"dummy"') // Replace get() with a dummy string
          .replace(/\band\b/g, '&&')
          .replace(/\bor\b/g, '||');


      console.log(validationCode)

      // Try parsing the expression
      new Function(`return ${validationCode}`);

      setError(null);
      onValidExpression(expression, [...new Set(variables)]);
    } catch (err) {
      setError('Invalid expression syntax'+err);
    }
  };

  return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Code2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Expression Evaluator</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter your expression using Java-like and Python-like syntax
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            Available Methods and Operators
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-600 mb-1">String Methods:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>get('variableName')</li>
                <li>.concat('string')</li>
                <li>.substring(startIndex, endIndex)</li>
                <li>.equals('string')</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
        <textarea
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            rows={5}
            className="w-full p-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your expression"
        />

          <div className="flex justify-between">
            {error && (
                <div className="flex items-center text-sm text-red-500 gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
            )}

            <button
                onClick={validateExpression}
                disabled={!expression || error !== null}
                className="bg-purple-600 text-white px-6 py-2 rounded-md disabled:bg-gray-400"
            >
              Validate Expression
            </button>
          </div>
        </div>
      </div>
  );
}

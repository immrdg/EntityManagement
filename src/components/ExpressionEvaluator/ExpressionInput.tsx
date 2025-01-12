import { useState } from 'react';
import { Code2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

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
        .replace(/\.concat\(/g, '+')
        .replace(/\.substring\(/g, '.slice(')
        .replace(/\.equals\(/g, '===')
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||');
      
      // Try parsing the expression
      new Function(`return ${validationCode}`);
      
      setError(null);
      onValidExpression(expression, [...new Set(variables)]);
    } catch (err) {
      setError('Invalid expression syntax');
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
            <ul className="list-disc list-inside text-gray-500 space-y-1">
              <li><code className="text-purple-600">.concat(str)</code> - Concatenate strings</li>
              <li><code className="text-purple-600">.substring(start, end)</code> - Extract substring</li>
              <li><code className="text-purple-600">.equals(str)</code> - Compare strings (returns boolean)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-600 mb-1">Logical Operators:</p>
            <ul className="list-disc list-inside text-gray-500 space-y-1">
              <li><code className="text-purple-600">and</code> - Logical AND (for boolean values)</li>
              <li><code className="text-purple-600">or</code> - Logical OR (for boolean values)</li>
              <li><code className="text-purple-600">get('var')</code> - Get variable value (returns string)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g., get('str1').equals('test') and get('str2').equals('value')"
          className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none font-mono text-sm"
        />
        
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        
        <button
          onClick={validateExpression}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          Validate Expression
        </button>
      </div>
    </div>
  );
}
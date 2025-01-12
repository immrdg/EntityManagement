import { useState } from 'react';
import { Code2, AlertCircle, CheckCircle2 } from 'lucide-react';

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
        .replace(/get\(['"](.*?)['"]\)/g, '(get("$1")||null)');
      
      // Try parsing the expression
      new Function('get', `return ${validationCode}`);
      
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
            Enter your expression using get('variableName') syntax
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <textarea
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g., get('CompanyCode')!=null?get('GlAccount')!=null?get('CompanyCode').concat(get('GlAccount')):'':''"
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
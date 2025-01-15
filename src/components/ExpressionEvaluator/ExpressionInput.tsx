import React, { useState, useCallback } from 'react';

import { Code2, Info, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ExpressionInputProps {
  onValidExpression: (expression: string, variables: string[]) => void;
}

export function ExpressionInput({ onValidExpression }: ExpressionInputProps) {
  const [expression, setExpression] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const validateExpression = useCallback(() => {
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

      // Try parsing the expression
      new Function(`return ${validationCode}`);

      setError(null);
      onValidExpression(expression, [...new Set(variables)]);
    } catch (err) {
      setError(`Invalid expression syntax: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [expression, onValidExpression]);

  const handleExpressionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setExpression(newValue);
    setIsTyping(true);
    setError(null);

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set new timeout for validation
    const timeout = setTimeout(() => {
      setIsTyping(false);
      if (newValue.trim()) {
        validateExpression();
      }
    }, 500);

    setTypingTimeout(timeout);
  }, [typingTimeout, validateExpression]);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Code2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Expression Evaluator</h2>
            <p className="text-sm text-gray-500 mt-1">
              Build and evaluate complex string expressions with our intuitive tools
            </p>
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 w-full p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 flex-1 text-left">
            Available Methods and Operators
          </span>
            {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">String Methods</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <code className="text-sm text-purple-600">get('variableName')</code>
                    <p className="text-sm text-gray-600 mt-1">Retrieves a variable's value</p>
                    <p className="text-xs text-gray-500 mt-1">Example: get('name')</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <code className="text-sm text-purple-600">.length()</code>
                    <p className="text-sm text-gray-600 mt-1">Returns string length</p>
                    <p className="text-xs text-gray-500 mt-1">Example: get('name').length()</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <code className="text-sm text-purple-600">.equals('string')</code>
                    <p className="text-sm text-gray-600 mt-1">Compares strings</p>
                    <p className="text-xs text-gray-500 mt-1">Example: get('type').equals('admin')</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <code className="text-sm text-purple-600">.concat('string')</code>
                    <p className="text-sm text-gray-600 mt-1">Joins strings</p>
                    <p className="text-xs text-gray-500 mt-1">Example: get('first').concat(' ').concat(get('last'))</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <code className="text-sm text-purple-600">.substring(start, end)</code>
                    <p className="text-sm text-gray-600 mt-1">Extracts string portion</p>
                    <p className="text-xs text-gray-500 mt-1">Example: get('text').substring(0, 5)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="font-medium text-gray-900">Logical Operators</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <code className="text-sm text-purple-600">and</code>
                    <p className="text-sm text-gray-600 mt-1">Logical AND</p>
                    <p className="text-xs text-gray-500 mt-1">Example: condition1 and condition2</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <code className="text-sm text-purple-600">or</code>
                    <p className="text-sm text-gray-600 mt-1">Logical OR</p>
                    <p className="text-xs text-gray-500 mt-1">Example: condition1 or condition2</p>
                  </div>
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <code className="text-sm text-purple-600">? :</code>
                    <p className="text-sm text-gray-600 mt-1">Ternary operator</p>
                    <p className="text-xs text-gray-500 mt-1">Example: condition ? 'yes' : 'no'</p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="space-y-4">
          <div className="relative">
          <textarea
              value={expression}
              onChange={handleExpressionChange}
              rows={5}
              className={`w-full p-4 rounded-lg border ${
                  error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200'
              } focus:outline-none focus:ring-2 transition-colors`}
              placeholder="Enter your expression (e.g., get('name').length() > 0 ? get('name') : 'Anonymous')"
          />
            {isTyping && (
                <div className="absolute top-3 right-3">
                  <div className="text-xs text-gray-500">Validating...</div>
                </div>
            )}
          </div>

          {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  <p className="text-sm text-red-600 mt-1">
                    Please check your expression syntax and try again.
                  </p>
                </div>
              </div>
          )}

          <button
              onClick={validateExpression}
              disabled={!expression.trim() || isTyping}
              className={`w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${
                  !expression.trim() || isTyping
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            {isTyping ? 'Validating...' : 'Validate Expression'}
          </button>
        </div>
      </div>
  );
}
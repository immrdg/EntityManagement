import { useState } from 'react';
import { ExpressionInput } from './ExpressionInput';
import { VariableInput } from './VariableInput';
import { EvaluationVisualizer } from './EvaluationVisualizer';

export function ExpressionEvaluator() {
  const [step, setStep] = useState(1);
  const [expression, setExpression] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<{
    values: Record<string, string>;
    result: string;
  } | null>(null);

  const handleValidExpression = (expr: string, vars: string[]) => {
    setExpression(expr);
    setVariables(vars);
    setStep(2);
  };

  const handleEvaluate = (values: Record<string, string>) => {
    try {
      // Create get function for evaluation
      const get = (key: string) => values[key] || null;
      
      // Evaluate the expression
      const result = new Function('get', `return ${expression
        .replace(/get\(['"](.*?)['"]\)/g, '(get("$1")||null)')
      }`)(get);

      setEvaluationResult({
        values,
        result: result?.toString() || ''
      });
      setStep(3);
    } catch (error) {
      console.error('Evaluation error:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6">
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
            step !== 1 ? 'opacity-60' : ''
          }`}>
            <ExpressionInput onValidExpression={handleValidExpression} />
          </div>

          {step >= 2 && (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${
              step !== 2 ? 'opacity-60' : ''
            }`}>
              <VariableInput
                variables={variables}
                onEvaluate={handleEvaluate}
              />
            </div>
          )}

          {step === 3 && evaluationResult && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <EvaluationVisualizer
                expression={expression}
                variables={evaluationResult.values}
                result={evaluationResult.result}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
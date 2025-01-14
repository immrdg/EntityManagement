import { useState } from 'react';
import { ExpressionInput } from './ExpressionInput';
import { VariableInput } from './VariableInput';
import { EvaluationVisualizer } from './EvaluationVisualizer';

interface EvaluationStep {
  operation: string;
  input: string[];
  output: string;
  description: string;
}

export function ExpressionEvaluator() {
  const [step, setStep] = useState(1);
  const [expression, setExpression] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<{
    values: Record<string, string>;
    result: string;
    steps: EvaluationStep[];
  } | null>(null);

  const handleValidExpression = (expr: string, vars: string[]) => {
    setExpression(expr);
    setVariables(vars);
    setStep(2);
  };

  const evaluateExpression = (expr: string, values: Record<string, string>): [string, EvaluationStep[]] => {
    const steps: EvaluationStep[] = [];
    let currentExpr = expr;

    // Helper function to add a step
    const addStep = (operation: string, input: string[], output: string, description: string) => {
      steps.push({ operation, input, output, description });
      return output;
    };

    // Create get function for evaluation that always returns a string
    const get = (key: string) => {
      const value = values[key] || '';
      return addStep(
        'Variable Access',
        [`get('${key}')`],
        `"${value}"`,
        `Retrieved value for variable '${key}'`
      );
    };

    // Process string operations
    const processStringOps = (str: string) => {
      // Replace concat operations
      str = str.replace(/(.+?)\.concat\((.+?)\)/g, (match, str1, str2) => {
        const result = str1.replace(/^"(.*)"$/, '$1') + str2.replace(/^"(.*)"$/, '$1');
        return addStep(
          'String Concatenation',
          [str1, str2],
          `"${result}"`,
          `Concatenated '${str1}' with '${str2}'`
        );
      });

      // Replace substring operations
      str = str.replace(/(".*?")\.substring\((\d+),\s*(\d+)\)/g, (match, str, start, end) => {
        const actualStr = str.replace(/^"(.*)"$/, '$1');
        const result = actualStr.slice(parseInt(start), parseInt(end));
        return addStep(
          'Substring',
          [str, `start: ${start}`, `end: ${end}`],
          `"${result}"`,
          `Extracted substring from index ${start} to ${end}`
        );
      });

      // Replace equals operations
      str = str.replace(/(".*?")\.equals\((".*?")\)/g, (match, str1, str2) => {
        const actualStr1 = str1.replace(/^"(.*)"$/, '$1');
        const actualStr2 = str2.replace(/^"(.*)"$/, '$1');
        const result = actualStr1 === actualStr2;
        return addStep(
          'String Comparison',
          [str1, str2],
          result.toString(),
          `Compared if '${str1}' equals '${str2}'`
        );
      });

      return str;
    };

    // Process logical operators
    const processLogicalOps = (str: string) => {
      // Replace 'and' with '&&' but only between boolean expressions
      str = str.replace(/(\btrue\b|\bfalse\b)\s+and\s+(\btrue\b|\bfalse\b)/g, '$1 && $2');
      // Replace 'or' with '||' but only between boolean expressions
      str = str.replace(/(\btrue\b|\bfalse\b)\s+or\s+(\btrue\b|\bfalse\b)/g, '$1 || $2');
      return str;
    };

    // Process the expression
    try {
      // Replace get() calls first
      currentExpr = currentExpr.replace(/get\(['"](.*?)['"]\)/g, (match, key) => get(key));

      // Process string operations
      currentExpr = processStringOps(currentExpr);

      // Process logical operators
      currentExpr = processLogicalOps(currentExpr);

      // Evaluate final expression
      const result = new Function(`return ${currentExpr}`)();
      
      addStep(
        'Final Evaluation',
        [currentExpr],
        result?.toString() || '',
        'Evaluated the final expression'
      );

      return [result?.toString() || '', steps];
    } catch (error) {
      console.error('Evaluation error:', error);
      return ['Error', steps];
    }
  };

  const handleEvaluate = (values: Record<string, string>) => {
    const [result, steps] = evaluateExpression(expression, values);
    
    setEvaluationResult({
      values,
      result,
      steps
    });
    setStep(3);
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
                steps={evaluationResult.steps}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
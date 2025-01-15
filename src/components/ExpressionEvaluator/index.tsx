import { useState } from 'react';
import { ExpressionInput } from './ExpressionInput';
import { VariableInput } from './VariableInput';
import { EvaluationVisualizer } from './EvaluationVisualizer';
import { StringClass } from './types/StringClass.ts';
import { BooleanClass } from './types/BooleanClass.ts';
import { createTernaryTree, evaluateTernaryTree } from './types/TernaryNode';

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
      const value = values[key] || ''; // Empty string for missing values
      return addStep(
        'Variable Access',
        [`get('${key}')`],
        `"${value}"`,
        `Retrieved value for variable '${key}'`
      );
    };

    // Process string operations (e.g., equals, concat, substring, length)
    const processStringOps = (str: string) => {
      // Handle `.length()` method using StringClass
      str = str.replace(/(".*?")\.length\(\)/g, (match, strValue) => {
        const actualStr = strValue.replace(/^"(.*)"$/, '$1');
        const stringObj = new StringClass(actualStr);
        const result = stringObj.length();
        return addStep(
          'String Length',
          [strValue],
          result.toString(),
          `Calculated length of string '${strValue}'`
        );
      });

      // Handle `.concat()` method using StringClass
      str = str.replace(/["'](.*?)["']\.concat\(["'](.*?)["']\)/g, (match, str1, str2) => {
        const stringObj1 = new StringClass(str1);
        const result = stringObj1.concat(str2);
        return addStep(
          'String Concatenation',
          [str1, str2],
          `"${result}"`,
          `Concatenated strings '${str1}' and '${str2}'`
        );
      });

      // Handle `.substring()` method using StringClass
      str = str.replace(/(".*?")\.substring\((\d+),\s*(\d+)\)/g, (match, strValue, start, end) => {
        const stringObj = new StringClass(strValue.replace(/^"(.*)"$/, '$1'));
        const result = stringObj.substring(parseInt(start), parseInt(end));
        return addStep(
          'String Substring',
          [strValue, start, end],
          `"${result}"`,
          `Extracted substring from '${strValue}' between indices ${start} and ${end}`
        );
      });

      // Handle `.equals()` method for string literals
      str = str.replace(/["'](.*?)["']\.equals\(["'](.*?)["']\)/g, (match, str1, str2) => {
        const stringObj1 = new StringClass(str1);
        const stringObj2 = new StringClass(str2);
        const result = stringObj1.equals(stringObj2);
        return addStep(
          'String Equality',
          [str1, str2],
          result.toString(),
          `Compared strings '${str1}' and '${str2}' for equality`
        );
      });

      return str;
    };

    // Process logical operators (and/or) using BooleanClass
    const processLogicalOps = (str: string) => {
      // Process 'and' operator
      str = str.replace(/(.+?)\s+and\s+(.+?)(?=\s*\?|$)/g, (match, left, right) => {
        const leftValue = new BooleanClass(left === 'true');
        const rightValue = new BooleanClass(right === 'true');
        const result = leftValue.and(rightValue.value);
        return addStep(
          'Logical AND',
          [left, right],
          result.toString(),
          `Evaluated logical AND between '${left}' and '${right}'`
        );
      });

      // Process 'or' operator
      str = str.replace(/(.+?)\s+or\s+(.+?)(?=\s*\?|$)/g, (match, left, right) => {
        const leftValue = new BooleanClass(left === 'true');
        const rightValue = new BooleanClass(right === 'true');
        const result = leftValue.or(rightValue.value);
        return addStep(
          'Logical OR',
          [left, right],
          result.toString(),
          `Evaluated logical OR between '${left}' and '${right}'`
        );
      });

      return str;
    };

    // Handle null comparisons
    const processNullComparisons = (str: string) => {
      str = str.replace(/(["'])(.*?)\1\s*!=\s*null/g, (match, quote, value) => {
        return `"${value}" !== ''`;  // Treat null as an empty string for string comparison
      });

      return str;
    };

    try {
      // Replace get() calls first
      currentExpr = currentExpr.replace(/get\(['"](.*?)['"]\)/g, (match, key) => get(key));

      // Process string operations
      currentExpr = processStringOps(currentExpr);

      // Handle null comparisons
      currentExpr = processNullComparisons(currentExpr);

      // Process logical operators
      currentExpr = processLogicalOps(currentExpr);

      // Create and evaluate ternary expression tree
      const ternaryTree = createTernaryTree(currentExpr);
      currentExpr = evaluateTernaryTree(ternaryTree, addStep);

      // Clean up the final result
      let result = currentExpr;
      if (result.startsWith('"') && result.endsWith('"')) {
        result = result.slice(1, -1);
      }

      addStep(
        'Final Evaluation',
        [currentExpr],
        result,
        'Final result after all evaluations'
      );

      return [result, steps];
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
          <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${step !== 1 ? 'opacity-60' : ''}`}>
            <ExpressionInput onValidExpression={handleValidExpression} />
          </div>

          {step >= 2 && (
            <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${step !== 2 ? 'opacity-60' : ''}`}>
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
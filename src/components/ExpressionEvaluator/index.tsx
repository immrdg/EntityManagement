import { useState } from 'react';
import { ExpressionInput } from './ExpressionInput';
import { VariableInput } from './VariableInput';
import { EvaluationVisualizer } from './EvaluationVisualizer';
import { StringClass } from './types/StringClass';
import { BooleanClass } from './types/BooleanClass';
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
    values: Record<string, string | null>;
    result: string;
    steps: EvaluationStep[];
  } | null>(null);

  const handleValidExpression = (expr: string, vars: string[]) => {
    setExpression(expr);
    setVariables(vars);
    setStep(2);
  };

  const evaluateExpression = (expr: string, values: Record<string, string | null>): [string, EvaluationStep[]] => {
    const steps: EvaluationStep[] = [];
    let currentExpr = expr;

    const addStep = (operation: string, input: string[], output: string, description: string) => {
      steps.push({ operation, input, output, description });
      return output;
    };

    const get = (key: string) => {
      const value = values[key];
      if (value === null) {
        return addStep(
          'Variable Access',
          [`get('${key}')`],
          'null',
          `Retrieved null value for variable '${key}'`
        );
      }
      return addStep(
        'Variable Access',
        [`get('${key}')`],
        `"${value || ''}"`,
        `Retrieved value for variable '${key}'`
      );
    };

    const processStringOps = (str: string) => {
      // Handle null checks first
      str = str.replace(/(["'].*?["']|null)\s*(==|!=)\s*null/g, (match, value, operator) => {
        const isNull = value === 'null';
        const result = operator === '==' ? isNull : !isNull;
        return addStep(
          'Null Check',
          [value, operator, 'null'],
          result.toString(),
          `Checked if ${value} is${operator === '!=' ? ' not' : ''} null`
        );
      });

      // Handle string equality comparisons
      str = str.replace(/(["'].*?["'])\s*(==|!=)\s*(["'].*?["'])/g, (match, left, operator, right) => {
        if (left === 'null' || right === 'null') {
          const result = operator === '==' ? (left === right) : (left !== right);
          return addStep(
            'String Comparison',
            [left, operator, right],
            result.toString(),
            `Compared ${left} ${operator} ${right}`
          );
        }

        const leftStr = left.replace(/^["'](.*?)["']$/, '$1');
        const rightStr = right.replace(/^["'](.*?)["']$/, '$1');
        const result = operator === '==' ? (leftStr === rightStr) : (leftStr !== rightStr);

        return addStep(
          'String Comparison',
          [left, operator, right],
          result.toString(),
          `Compared ${left} ${operator} ${right}`
        );
      });

      // Handle other string operations only if the value is not null
      str = str.replace(/(".*?")\.length\(\)/g, (match, strValue) => {
        if (strValue === 'null') return '0';
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

      str = str.replace(/["'](.*?)["']\.concat\(["'](.*?)["']\)/g, (match, str1, str2) => {
        if (str1 === 'null' || str2 === 'null') return 'null';
        const stringObj1 = new StringClass(str1);
        const result = stringObj1.concat(str2);
        return addStep(
          'String Concatenation',
          [str1, str2],
          `"${result}"`,
          `Concatenated strings '${str1}' and '${str2}'`
        );
      });

      str = str.replace(/(".*?")\.equals\((".*?")\)/g, (match, str1, str2) => {
        if (str1 === 'null' || str2 === 'null') return 'false';
        const stringObj1 = new StringClass(str1.replace(/^"(.*)"$/, '$1'));
        const stringObj2 = new StringClass(str2.replace(/^"(.*)"$/, '$1'));
        const result = stringObj1.equals(stringObj2);
        return addStep(
          'String Equality',
          [str1, str2],
          result.toString(),
          `Compared strings ${str1} and ${str2} for equality`
        );
      });

      // Handle substring method
      str = str.replace(/(".*?")\.substring\((\d+),\s*(\d+)\)/g, (match, strValue, start, end) => {
        if (strValue === 'null') return 'null';
        const actualStr = strValue.replace(/^"(.*)"$/, '$1');
        const stringObj = new StringClass(actualStr);
        const result = stringObj.substring(parseInt(start), parseInt(end));
        return addStep(
          'String Substring',
          [strValue, start, end],
          `"${result}"`,
          `Extracted substring from ${strValue} from index ${start} to ${end}`
        );
      });

      return str;
    };

    const processNumericOps = (str: string) => {
      // Handle numeric comparisons
      str = str.replace(/(\d+)\s*(==|!=|>|<|>=|<=)\s*(\d+)/g, (match, left, operator, right) => {
        let result: boolean;
        const leftNum = parseInt(left);
        const rightNum = parseInt(right);

        switch (operator) {
          case '==': result = leftNum === rightNum; break;
          case '!=': result = leftNum !== rightNum; break;
          case '>': result = leftNum > rightNum; break;
          case '<': result = leftNum < rightNum; break;
          case '>=': result = leftNum >= rightNum; break;
          case '<=': result = leftNum <= rightNum; break;
          default: result = false;
        }

        return addStep(
          'Numeric Comparison',
          [left, operator, right],
          result.toString(),
          `Compared ${left} ${operator} ${right}`
        );
      });

      return str;
    };

    try {
      // Replace get() calls first
      currentExpr = currentExpr.replace(/get\(['"](.*?)['"]\)/g, (match, key) => get(key));

      // Process numeric operations
      currentExpr = processNumericOps(currentExpr);

      // Process string operations and null checks
      currentExpr = processStringOps(currentExpr);

      // Process logical operators
      currentExpr = currentExpr.replace(/(.+?)\s+and\s+(.+?)(?=\s*\?|$)/g, (match, left, right) => {
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

      currentExpr = currentExpr.replace(/(.+?)\s+or\s+(.+?)(?=\s*\?|$)/g, (match, left, right) => {
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

  const handleEvaluate = (values: Record<string, string | null>) => {
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

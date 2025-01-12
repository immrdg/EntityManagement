import { Share2, ArrowRight, ArrowDown } from 'lucide-react';

interface EvaluationStep {
  operation: string;
  input: string[];
  output: string;
  description: string;
}

interface EvaluationVisualizerProps {
  expression: string;
  variables: Record<string, string>;
  result: string;
  steps: EvaluationStep[];
}

export function EvaluationVisualizer({ expression, variables, result, steps }: EvaluationVisualizerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-50 rounded-lg">
          <Share2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Evaluation Flow</h2>
          <p className="text-sm text-gray-500 mt-1">
            Visual representation of the expression evaluation process
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Input Expression */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">Input Expression</h3>
          </div>
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap text-gray-800">
            {expression}
          </pre>
        </div>

        {/* Variables */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <h3 className="font-medium text-gray-700">Variable Values</h3>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(variables).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg">
                <code className="text-sm font-mono">
                  <span className="text-purple-600">get('{key}')</span> → {value || 'null'}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index > 0 && (
                <div className="absolute left-1/2 -top-4 transform -translate-x-1/2">
                  <ArrowDown className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-medium text-gray-700">Step {index + 1}: {step.operation}</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">Input:</p>
                      <div className="space-y-2">
                        {step.input.map((inp, i) => (
                          <code key={i} className="block text-sm font-mono bg-gray-50 p-2 rounded">
                            {inp}
                          </code>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">Output:</p>
                      <code className="block text-sm font-mono bg-gray-50 p-2 rounded">
                        {step.output}
                      </code>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Final Result */}
        <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
          <div className="px-4 py-2 bg-green-50 border-b border-green-200">
            <h3 className="font-medium text-green-700">Final Result</h3>
          </div>
          <div className="p-4">
            <code className="text-lg font-mono text-green-600">{result}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
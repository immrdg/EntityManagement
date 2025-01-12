import { Share2 } from 'lucide-react';

interface EvaluationVisualizerProps {
  expression: string;
  variables: Record<string, string>;
  result: string;
}

export function EvaluationVisualizer({ expression, variables, result }: EvaluationVisualizerProps) {
  const evaluationSteps = [
    {
      title: 'Input Expression',
      content: expression,
    },
    {
      title: 'Variable Values',
      content: Object.entries(variables).map(([key, value]) => (
        `get('${key}') → ${value || 'null'}`
      )).join('\n'),
    },
    {
      title: 'Result',
      content: result,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-green-50 rounded-lg">
          <Share2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Evaluation Map</h2>
          <p className="text-sm text-gray-500 mt-1">
            Visualization of the expression evaluation process
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {evaluationSteps.map((step, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-700">{step.title}</h3>
            </div>
            <pre className="p-4 text-sm font-mono whitespace-pre-wrap text-gray-800">
              {step.content}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
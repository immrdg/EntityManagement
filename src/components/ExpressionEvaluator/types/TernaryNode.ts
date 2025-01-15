export interface TernaryNode {
  condition: string;
  trueValue: string | TernaryNode;
  falseValue: string | TernaryNode;
}

export function createTernaryTree(expression: string): TernaryNode | string {
  // If no question mark, this is a leaf node
  if (!expression.includes('?')) {
    return expression.trim();
  }

  let depth = 0;
  let questionMarkIndex = -1;
  let colonIndex = -1;

  // Find the outermost ternary operator
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') depth++;
    else if (expression[i] === ')') depth--;
    else if (depth === 0 && expression[i] === '?') {
      questionMarkIndex = i;
      // Find the corresponding colon
      depth = 0;
      for (let j = i + 1; j < expression.length; j++) {
        if (expression[j] === '(') depth++;
        else if (expression[j] === ')') depth--;
        else if (depth === 0 && expression[j] === ':') {
          colonIndex = j;
          break;
        }
      }
      break;
    }
  }

  if (questionMarkIndex === -1 || colonIndex === -1) {
    return expression.trim();
  }

  const condition = expression.substring(0, questionMarkIndex).trim();
  const trueExpr = expression.substring(questionMarkIndex + 1, colonIndex).trim();
  const falseExpr = expression.substring(colonIndex + 1).trim();

  return {
    condition,
    trueValue: createTernaryTree(trueExpr),
    falseValue: createTernaryTree(falseExpr)
  };
}

export function evaluateTernaryTree(
  node: TernaryNode | string,
  addStep: (operation: string, input: string[], output: string, description: string) => string
): string {
  // If node is a string, it's a leaf node
  if (typeof node === 'string') {
    return node;
  }

  // Evaluate condition
  const conditionResult = new Function(`return ${node.condition}`)();
  
  // Recursively evaluate the chosen branch
  const trueResult = typeof node.trueValue === 'string' 
    ? node.trueValue 
    : evaluateTernaryTree(node.trueValue, addStep);
    
  const falseResult = typeof node.falseValue === 'string'
    ? node.falseValue
    : evaluateTernaryTree(node.falseValue, addStep);

  const result = conditionResult ? trueResult : falseResult;

  // Add evaluation step
  return addStep(
    'Ternary Evaluation',
    [node.condition, String(trueResult), String(falseResult)],
    result,
    `Evaluated condition '${node.condition}' to ${conditionResult}, choosing '${result}'`
  );
}
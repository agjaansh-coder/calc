// Simple calculator logic
// Select elements
const display = document.getElementById('display');
const keys = document.querySelector('.keys');

let current = ''; // expression shown in display

function updateDisplay(){
  display.textContent = current === '' ? '0' : current;
}

// Append a value (digit, operator, dot, parentheses)
function appendValue(val){
  // prevent multiple dots in a single number segment
  if(val === '.'){
    // split by operators to get current number segment
    const segments = current.split(/[\+\-\*\/\(\)]/);
    const last = segments[segments.length - 1];
    if(last.includes('.')) return;
  }
  current += val;
  updateDisplay();
}

// Clear everything
function clearAll(){
  current = '';
  updateDisplay();
}

// Backspace
function backspace(){
  if(current.length === 0) return;
  current = current.slice(0, -1);
  updateDisplay();
}

// Safe evaluate: allow only digits, operators, parentheses, decimal point and spaces
function safeEvaluate(expr){
  // Replace display-friendly symbols with JS operators
  expr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  // Validate allowed characters
  if(!/^[0-9+\-*/().\s]+$/.test(expr)) throw new Error('Invalid characters');

  // Basic check to avoid expressions like '2/**/3' (Function will throw in that case)
  // Use Function instead of eval for marginally better scoping
  // Still be cautious: input is validated by regex above.
  // Evaluate
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${expr})`)();
}

// Compute result
function calculate(){
  if(current.trim() === '') return;
  try{
    const result = safeEvaluate(current);
    // Format result: remove trailing .0 for integers
    current = (Number.isFinite(result) && Number.isInteger(result)) ? String(result) : String(result);
    updateDisplay();
  }catch(e){
    display.textContent = 'Error';
    setTimeout(updateDisplay, 1000);
    current = '';
  }
}

// Handle clicks
keys.addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if(!button) return;
  const action = button.dataset.action;
  const value = button.dataset.value;

  if(action === 'clear') clearAll();
  else if(action === 'backspace') backspace();
  else if(action === 'equals') calculate();
  else if(value) {
    // convert display-friendly operator symbols to JS-friendly if needed
    if(value === '×') appendValue('*');
    else if(value === '÷') appendValue('/');
    else appendValue(value);
  }
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  const key = e.key;

  if((/^[0-9]$/).test(key)) appendValue(key);
  else if(key === '.') appendValue('.');
  else if(key === '+' || key === '-' || key === '*' || key === '/') appendValue(key);
  else if(key === 'Enter' || key === '='){ e.preventDefault(); calculate(); }
  else if(key === 'Backspace') backspace();
  else if(key === 'Escape') clearAll();
  else if(key === '(' || key === ')') appendValue(key);
});

// Initialize
updateDisplay();
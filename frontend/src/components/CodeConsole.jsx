import { useState } from 'react'
import '../styles/CodeConsole.css'

function CodeConsole() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [hintIndex, setHintIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [shownHints, setShownHints] = useState([]);  // New state to track shown hints


  // Hard-coded challenge data (you can move this to a separate file later)
  const dailyChallenge = {
    prompt: "Write a function that takes an array of numbers and returns the sum of all positive numbers.",
    expectedOutput: "8",
    testCase: "[1, -4, 7, -2]",
    hints: [
      "Remember to filter the numbers first",
      "You can use array methods like filter() and reduce()",
      "Check if each number is greater than 0, use 'function' for your function type  ",
      "Try: array.filter(num => num > 0)",
      "Final hint: array.filter(num => num > 0).reduce((sum, num) => sum + num, 0)"
    ],
    solution: `function sumPositive(arr) {
  return arr.filter(num => num > 0)
            .reduce((sum, num) => sum + num, 0);
}`
  }
  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault(); // Prevent the default tab behavior
      // Insert a tab character or spaces
      const { selectionStart, selectionEnd } = event.target;
      const value = event.target.value;
      const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);
      event.target.value = newValue;
      // Move the cursor to the right position
      event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
    }
  };
  const checkSolution = () => {
    try {
      const testFunction = new Function('return ' + input)();
      const testArray = eval(dailyChallenge.testCase);
      const result = testFunction(testArray).toString();

      if (result === dailyChallenge.expectedOutput) {
        setOutput('Congratulations! Your solution is correct! 🎉');
        setShowHint(false);
      } else {
        setOutput(`Expected: ${dailyChallenge.expectedOutput}\nGot: ${result}`);
        if (hintIndex < dailyChallenge.hints.length) {
          setShowHint(true);
          setShownHints(prev => [...prev, dailyChallenge.hints[hintIndex]]);
          setHintIndex(prev => prev + 1);
        }
      }
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
      if (hintIndex < dailyChallenge.hints.length) {
        setShowHint(true);
        setShownHints(prev => [...prev, dailyChallenge.hints[hintIndex]]);
        setHintIndex(prev => prev + 1);
      }
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setShowHint(false);
    setShownHints([]);
    setHintIndex(0);
  };

  const showSolution = () => {
    setInput(dailyChallenge.solution);
    setShowHint(false);
  }

  const showHintPopup = (e) => {
    e.preventDefault();
    const buttonRect = e.target.getBoundingClientRect();
    setHintPosition({
      x: buttonRect.left,
      y: buttonRect.bottom + window.scrollY + 10
    });
    setShowHint(true);
  };

  return (
    <div className="console-container">
      <div className="code-console">
        <div className="challenge-section">
          <h2>Daily Code Challenge</h2>
          <p>{dailyChallenge.prompt}</p>
          <p className="test-case">Test case: {dailyChallenge.testCase}</p>
        </div>

        <div className="input-section">
          <h3>Your Solution</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your code here..."
            className="code-input"
          />
        </div>
        
        <div className="output-section">
          <h3>Output</h3>
          <div className="code-output">
            {output || 'Output will appear here...'}
          </div>
        </div>

        {showHint && (
          <div className="hints-container">
            {shownHints.map((hint, index) => (
              <div key={index} className="hint-popup">
                <div className="hint-content">
                  <h3>Hint {index + 1}</h3>
                  <p>{hint}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="button-container">
          <button onClick={checkSolution}>Submit</button>
          <button onClick={handleClear}>Clear</button>
          {hintIndex >= dailyChallenge.hints.length && (
            <button onClick={showSolution}>Show Solution</button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodeConsole
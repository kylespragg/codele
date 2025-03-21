import { useState, useEffect } from 'react'
import '../styles/CodeConsole.css'

function CodeConsole() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [hintIndex, setHintIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [shownHints, setShownHints] = useState([])
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('python');

  // Fetch challenge when component mounts
  useEffect(() => {
    fetchDailyChallenge();
  }, []);

  const fetchDailyChallenge = async () => {
    try {
      const response = await fetch('/api/challenges/daily');
      if (!response.ok) {
        throw new Error('Failed to fetch challenge');
      }
      const challenge = await response.json();
      setDailyChallenge(challenge);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      // Fallback to hardcoded challenge if fetch fails
      setDailyChallenge({
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
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const { selectionStart, selectionEnd } = event.target;
      const value = event.target.value;
      const newValue = value.substring(0, selectionStart) + '\t' + value.substring(selectionEnd);
      event.target.value = newValue;
      event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
    }
  };

  const checkSolution = async () => {
    try {
        const response = await fetch('/api/challenges/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: input,
                language: selectedLanguage,
                challengeId: dailyChallenge._id
            }),
        });

        const result = await response.json();

        if (response.ok) {
            setOutput(result.output); // Set the output from the backend
            if (result.success) {
                // Optionally handle success (e.g., show a success message)
            }
        } else {
            setOutput('Error: ' + result.error); // Handle errors
        }
    } catch (error) {
        setOutput('Error executing code: ' + error.message);
    }
};

  const handleClear = () => {
    setInput('');
    setOutput('');
    setShowHint(false);
    setShownHints([]);
    setHintIndex(0);
  };

  if (isLoading) {
    return <div className="console-container">Loading challenge...</div>;
  }

  if (!dailyChallenge) {
    return <div className="console-container">No challenge available</div>;
  }

  return (
    <div className="console-container">
      <div className="code-console">
        <div className="challenge-section">
          <h2>Daily Code Challenge</h2>
          <p>{dailyChallenge.prompt}</p>
          <p className="test-case">Test case: {dailyChallenge.testCase}</p>
        </div>
        <div className="language-selector">
          <button 
              className={selectedLanguage === 'javascript' ? 'active' : ''}
              onClick={() => setSelectedLanguage('javascript')}
          >
              JavaScript
          </button>
          <button 
              className={selectedLanguage === 'python' ? 'active' : ''}
              onClick={() => setSelectedLanguage('python')}
          >
              Python
          </button>
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
          {hintIndex >= (dailyChallenge.hints?.length || 0) && (
            <button onClick={showSolution}>Show Solution</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeConsole;
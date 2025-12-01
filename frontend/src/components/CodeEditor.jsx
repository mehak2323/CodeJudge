// Monaco Editor component
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, value, onChange, onRun }) => {
  const [output, setOutput] = useState('');

  const handleRun = async () => {
    // Call API for run (sample test case)
    const response = await fetch('/api/execute', {  // Placeholder; integrate with backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: value, language, input: 'sample input' }),
    });
    const data = await response.json();
    setOutput(data.output || data.error);
  };

  return (
    <div className="space-y-4">
      <Editor
        height="400px"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{ minimap: { enabled: false } }}
      />
      <button onClick={handleRun} className="bg-green-500 px-4 py-2 text-white rounded">Run</button>
      <pre className="bg-black text-white p-4">{output}</pre>
    </div>
  );
};

export default CodeEditor;
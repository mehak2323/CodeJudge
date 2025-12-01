// Problem page with editor
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import SubmissionResult from '../components/SubmissionResult';

const Problem = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`/api/problems/${id}`).then(res => res.json()).then(setProblem);
  }, [id]);

  const handleSubmit = async () => {
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problemId: id, code, language }),
    });
    const submission = await response.json();
    // Poll for result or use WebSocket in prod
    setTimeout(() => {
      fetch(`/api/submissions/${submission._id}`).then(res => res.json()).then(setResult);
    }, 5000);
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{problem.title}</h1>
      <div className="prose max-w-none">
        <p dangerouslySetInnerHTML={{ __html: problem.description }} />
        <h3>Input Format</h3>
        <pre>{problem.inputFormat}</pre>
        <h3>Sample Input</h3>
        <pre>{problem.sampleInput}</pre>
        <h3>Sample Output</h3>
        <pre>{problem.sampleOutput}</pre>
      </div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)} className="border p-2">
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="javascript">JavaScript</option>
      </select>
      <CodeEditor language={language} value={code} onChange={setCode} />
      <div className="flex space-x-4">
        <button onClick={handleSubmit} className="bg-blue-500 px-4 py-2 text-white rounded">Submit</button>
      </div>
      {result && <SubmissionResult result={result} />}
    </div>
  );
};

export default Problem;
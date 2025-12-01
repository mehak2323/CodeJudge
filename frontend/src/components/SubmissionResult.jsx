// Display submission results
import React from 'react';

const SubmissionResult = ({ result }) => {
  return (
    <div className="border p-4 mt-4">
      <h3 className="font-bold">Status: {result.status}</h3>
      <p>Time: {result.executionTime}ms | Memory: {result.memoryUsed}MB</p>
      <ul>
        {result.testResults?.map((test, i) => (
          <li key={i} className={test.passed ? 'text-green-500' : 'text-red-500'}>
            Test {i+1}: {test.passed ? 'Pass' : 'Fail'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmissionResult;
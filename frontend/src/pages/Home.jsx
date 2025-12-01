// Home page with problem list
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubmissions } from '../redux/submissionsSlice';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const dispatch = useDispatch();
  const { list: submissions } = useSelector((state) => state.submissions);

  useEffect(() => {
    // Fetch problems
    fetch('/api/problems').then(res => res.json()).then(setProblems);
    dispatch(fetchSubmissions());
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Problems</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {problems.map((problem) => (
          <div key={problem._id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{problem.title}</h2>
            <p className="text-gray-600">Difficulty: {problem.difficulty}</p>
            <Link to={`/problem/${problem._id}`} className="text-blue-500">Solve</Link>
          </div>
        ))}
      </div>
      {/* Leaderboard placeholder */}
      <div className="mt-8">
        <h2>Leaderboard</h2>
        {/* Implement based on solved counts */}
      </div>
    </div>
  );
};

export default Home;
// User profile page
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { list: submissions } = useSelector((state) => state.submissions);

  if (!user) return <div>Please log in</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Solved: {user.solvedProblems?.length || 0}</p>
      <h2 className="text-xl mt-4">Submissions History</h2>
      <ul className="space-y-2">
        {submissions.map((sub) => (
          <li key={sub._id} className="bg-white p-2 rounded">
            {sub.problemId?.title}: {sub.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
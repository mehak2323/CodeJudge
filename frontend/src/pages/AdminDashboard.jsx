// Admin dashboard for problem management
import React, { useState } from 'react';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({ title: '', description: '', /* other fields */ });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    // Refresh list
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-2 w-full"
        />
        {/* Add other inputs for description, etc. */}
        <button type="submit" className="bg-green-500 px-4 py-2 text-white rounded">Add Problem</button>
      </form>
      {/* List and edit/delete buttons for existing problems */}
    </div>
  );
};

export default AdminDashboard;
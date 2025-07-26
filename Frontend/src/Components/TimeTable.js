import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function TimeTable() {
  const { user } = useAuth();
  const role = localStorage.getItem('userRole');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editForm, setEditForm] = useState({
    day: '',
    subject: '',
    time: '',
    room: '',
    instructor: '',
    type: 'Lecture',
    status: 'active'
  });
  const [newClass, setNewClass] = useState({
    day: '',
    subject: '',
    time: '',
    room: '',
    instructor: '',
    type: 'Lecture',
    status: 'active'
  });
  const [dayFilter, setDayFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const classTypes = ['Lecture', 'Lab', 'Tutorial', 'Seminar', 'Workshop'];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/timetable/timetable/${user?.uid || 'default'}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls => {
    const matchesDay = dayFilter === 'all' || cls.day === dayFilter;
    const matchesSearch = cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDay && matchesSearch;
  });

  const handleAddClass = async (e) => {
    e.preventDefault();
    
    if (!newClass.day || !newClass.subject || !newClass.time || !newClass.room || !newClass.instructor) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/timetable/timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...newClass,
          userId: user?.uid || 'default'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add class: ${response.status}`);
      }

      const data = await response.json();
      setClasses([data, ...classes]);
      setNewClass({
        day: '',
        subject: '',
        time: '',
        room: '',
        instructor: '',
        type: 'Lecture',
        status: 'active'
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding class:', error);
      setError(error.message || 'Failed to add class');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    if (role !== 'admin') return;
    
    const cls = classes[index];
    setEditIndex(index);
    setEditForm({
      day: cls.day,
      subject: cls.subject,
      time: cls.time,
      room: cls.room,
      instructor: cls.instructor,
      type: cls.type,
      status: cls.status
    });
  };

  const handleEditSave = async (index) => {
    if (role !== 'admin') return;

    try {
      const response = await fetch(`http://localhost:3000/api/timetable/timetable/${classes[index]._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updated = [...classes];
        updated[index] = { ...updated[index], ...editForm };
        setClasses(updated);
        setEditIndex(null);
      } else {
        setError('Failed to update class');
      }
    } catch (error) {
      console.error('Error updating class:', error);
      setError('Failed to update class');
    }
  };

  const handleDelete = async (index) => {
    if (role !== 'admin') return;

    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/timetable/timetable/${classes[index]._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const updated = classes.filter((_, i) => i !== index);
          setClasses(updated);
        } else {
          setError('Failed to delete class');
        }
      } catch (error) {
        console.error('Error deleting class:', error);
        setError('Failed to delete class');
      }
    }
  };

  const getDayColor = (day) => {
    const colors = {
      'Monday': '#ff6b6b',
      'Tuesday': '#4ecdc4',
      'Wednesday': '#45b7d1',
      'Thursday': '#96ceb4',
      'Friday': '#feca57',
      'Saturday': '#ff9ff3',
      'Sunday': '#54a0ff'
    };
    return colors[day] || '#63636b';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Lecture': '#a259ff',
      'Lab': '#22c55e',
      'Tutorial': '#f59e42',
      'Seminar': '#06b6d4',
      'Workshop': '#f43f5e'
    };
    return colors[type] || '#63636b';
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#fff', minHeight: '100vh', color: '#18181b' }}>
      <Navigation />
      
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
              Class Timetable
            </h1>
            {role === 'admin' && (
              <button
                onClick={() => setShowAddForm(true)}
                style={{
                  background: '#a259ff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Add Class
              </button>
            )}
        </div>

          {/* Search and Filter */}
          <div style={{ marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                marginBottom: '12px'
              }}
            />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setDayFilter('all')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  background: dayFilter === 'all' ? '#a259ff' : '#f1f1f1',
                  color: dayFilter === 'all' ? 'white' : 'black',
                  cursor: 'pointer'
                }}
              >
                All Days
          </button>
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setDayFilter(day)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    background: dayFilter === day ? '#a259ff' : '#f1f1f1',
                    color: dayFilter === day ? 'white' : 'black',
                    cursor: 'pointer'
                  }}
                >
                  {day}
          </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ 
            padding: '16px',
            margin: '0 0 24px 0',
            background: '#fee2e2',
            color: '#ef4444',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            {error}
            <button 
              onClick={() => setError(null)}
              style={{
                marginLeft: 'auto',
                padding: '8px 16px',
                background: '#fecaca',
                border: 'none',
                borderRadius: '6px',
                color: '#ef4444',
                cursor: 'pointer'
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Add Class Form */}
        {showAddForm && (
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5' }}>
            <h3 style={{ marginBottom: '16px' }}>Add New Class</h3>
            <form onSubmit={handleAddClass}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Day: *</label>
                  <select
                    value={newClass.day}
                    onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                  >
                    <option value="">Select Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Subject: *</label>
                  <input
                    type="text"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                    placeholder="Enter subject name"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Time: *</label>
                  <input
                    type="text"
                    value={newClass.time}
                    onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                    placeholder="e.g., 9:00 AM - 10:30 AM"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Room: *</label>
                  <input
                    type="text"
                    value={newClass.room}
                    onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                    placeholder="e.g., Room 101"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Instructor: *</label>
                  <input
                    type="text"
                    value={newClass.instructor}
                    onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                    placeholder="Enter instructor name"
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                    required
                  />
                </div>
          <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Type:</label>
                  <select
                    value={newClass.type}
                    onChange={(e) => setNewClass({ ...newClass, type: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  >
                    {classTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#ccc' : '#a259ff',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {loading ? 'Adding...' : 'Add Class'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    background: '#f1f1f1',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
              </button>
              </div>
            </form>
          </div>
        )}

        {/* Classes Grid */}
        {loading ? (
          <div style={{ 
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>
            Loading classes...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#63636b',
            background: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e5e5e5'
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '16px', opacity: 0.5 }}>
              <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 2V6" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2V6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <h3 style={{ margin: '0 0 8px 0' }}>No classes found</h3>
            <p style={{ margin: 0 }}>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {filteredClasses.map((cls, index) => (
              <div key={cls._id || index} style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ 
                        background: getDayColor(cls.day), 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        fontSize: '14px', 
                        fontWeight: 600 
                      }}>
                        {editIndex === index ? (
                          <select
                            value={editForm.day}
                            onChange={(e) => setEditForm({ ...editForm, day: e.target.value })}
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              color: 'white', 
                              fontWeight: 600,
                              fontSize: '14px'
                            }}
                          >
                            {days.map(day => (
                              <option key={day} value={day} style={{ color: '#000' }}>{day}</option>
                            ))}
                          </select>
                        ) : (
                          cls.day
                        )}
                      </span>
                      <span style={{ 
                        background: getTypeColor(cls.type), 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '16px', 
                        fontSize: '14px', 
                        fontWeight: 600 
                      }}>
                        {editIndex === index ? (
                          <select
                            value={editForm.type}
                            onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              color: 'white', 
                              fontWeight: 600,
                              fontSize: '14px'
                            }}
                          >
                            {classTypes.map(type => (
                              <option key={type} value={type} style={{ color: '#000' }}>{type}</option>
                            ))}
                          </select>
                        ) : (
                          cls.type
                        )}
                      </span>
                    </div>
                    {editIndex === index ? (
                      <input
                        value={editForm.subject}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                        style={{ 
                          fontSize: '24px', 
                          fontWeight: 'bold', 
                          margin: '0 0 8px 0', 
                          width: '100%',
                          border: 'none',
                          background: 'transparent'
                        }}
                      />
                    ) : (
                      <h3 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>{cls.subject}</h3>
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '8px' }}>
                      <div>
                        <strong>Time:</strong> {editIndex === index ? (
                          <input
                            value={editForm.time}
                            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                            style={{ marginLeft: '8px', border: 'none', background: 'transparent' }}
                          />
                        ) : (
                          <span style={{ marginLeft: '8px' }}>{cls.time}</span>
                        )}
                      </div>
                      <div>
                        <strong>Room:</strong> {editIndex === index ? (
                          <input
                            value={editForm.room}
                            onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
                            style={{ marginLeft: '8px', border: 'none', background: 'transparent' }}
                          />
                        ) : (
                          <span style={{ marginLeft: '8px' }}>{cls.room}</span>
                        )}
                      </div>
                      <div>
                        <strong>Instructor:</strong> {editIndex === index ? (
                          <input
                            value={editForm.instructor}
                            onChange={(e) => setEditForm({ ...editForm, instructor: e.target.value })}
                            style={{ marginLeft: '8px', border: 'none', background: 'transparent' }}
                          />
                        ) : (
                          <span style={{ marginLeft: '8px' }}>{cls.instructor}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {role === 'admin' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {editIndex === index ? (
                        <>
                          <button
                            onClick={() => handleEditSave(index)}
                            style={{
                              padding: '6px 12px',
                              background: '#22c55e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditIndex(null)}
                            style={{
                              padding: '6px 12px',
                              background: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(index)}
                            style={{
                              padding: '6px 12px',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            style={{
                              padding: '6px 12px',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeTable;

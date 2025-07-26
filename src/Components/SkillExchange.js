import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function SkillExchange() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([
    {
      id: 1,
      title: 'Web Development with React',
      instructor: 'John Doe',
      category: 'Programming',
      description: 'Learn modern React.js development from scratch',
      duration: '1 hour',
      availability: ['Monday 4-6pm', 'Wednesday 3-5pm'],
      tags: ['React', 'JavaScript', 'Web Dev'],
      status: 'available'
    },
    {
      id: 2,
      title: 'UI/UX Design Basics',
      instructor: 'Jane Smith',
      category: 'Design',
      description: 'Introduction to user interface and experience design',
      duration: '45 minutes',
      availability: ['Tuesday 5-7pm', 'Friday 2-4pm'],
      tags: ['Figma', 'Design', 'UI/UX'],
      status: 'available'
    }
  ]);

  const [skillForm, setSkillForm] = useState({
    title: '',
    category: 'Programming',
    description: '',
    duration: '',
    availability: [],
    tags: []
  });

  const [showSkillForm, setShowSkillForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingData, setBookingData] = useState(null);

  const categories = [
    'Programming',
    'Design',
    'Languages',
    'Music',
    'Academic',
    'Other'
  ];

  const handleAddSkill = (e) => {
    e.preventDefault();
    const newSkill = {
      ...skillForm,
      id: Date.now(),
      instructor: user?.name || 'Anonymous',
      status: 'available',
      tags: skillForm.tags.length ? skillForm.tags : [skillForm.category]
    };
    setSkills([newSkill, ...skills]);
    setSkillForm({
      title: '',
      category: 'Programming',
      description: '',
      duration: '',
      availability: [],
      tags: []
    });
    setShowSkillForm(false);
  };

  const handleBookSession = (skill) => {
    setBookingData(skill);
  };

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Skills Exchange</h1>
        <button
          onClick={() => setShowSkillForm(true)}
          style={{
            background: '#a259ff',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Share Your Skills
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search skills..."
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
            onClick={() => setCategoryFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: categoryFilter === 'all' ? '#a259ff' : '#f1f1f1',
              color: categoryFilter === 'all' ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: categoryFilter === category ? '#a259ff' : '#f1f1f1',
                color: categoryFilter === category ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {showSkillForm && (
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: '16px' }}>Share Your Skills</h2>
          <form onSubmit={handleAddSkill}>
            <input
              type="text"
              placeholder="Skill title"
              value={skillForm.title}
              onChange={(e) => setSkillForm({ ...skillForm, title: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <select
              value={skillForm.category}
              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={skillForm.description}
              onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
            />
            <input
              type="text"
              placeholder="Duration (e.g., 1 hour)"
              value={skillForm.duration}
              onChange={(e) => setSkillForm({ ...skillForm, duration: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  background: '#a259ff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Share Skill
              </button>
              <button
                type="button"
                onClick={() => setShowSkillForm(false)}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {filteredSkills.map(skill => (
          <div key={skill.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '8px', fontSize: '20px' }}>{skill.title}</h3>
            <p style={{ color: '#666', marginBottom: '12px' }}>by {skill.instructor}</p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {skill.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    background: '#f1f1f1',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}

>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ marginBottom: '12px' }}>{skill.description}</p>
            <p style={{ color: '#666', marginBottom: '16px' }}>Duration: {skill.duration}</p>
            <button
              onClick={() => handleBookSession(skill)}
              style={{
                width: '100%',
                background: '#a259ff',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Book Session
            </button>
          </div>
        ))}
      </div>

      {bookingData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '16px' }}>Book Session: {bookingData.title}</h2>
            <p style={{ marginBottom: '16px' }}>Instructor: {bookingData.instructor}</p>
            <p style={{ marginBottom: '16px' }}>Duration: {bookingData.duration}</p>
            <div style={{ marginBottom: '16px' }}>
              <h4>Available Times:</h4>
              {bookingData.availability.map((time, index) => (
                <div key={index} style={{ margin: '8px 0' }}>
                  <label>
                    <input type="radio" name="timeSlot" value={time} />
                    <span style={{ marginLeft: '8px' }}>{time}</span>
                  </label>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setBookingData(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f1f1f1',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#a259ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillExchange;

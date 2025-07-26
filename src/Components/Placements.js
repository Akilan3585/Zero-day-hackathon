import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Placements() {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'Software Developer Intern',
      company: 'TechCorp',
      type: 'Internship',
      deadline: '2024-02-15',
      description: 'Summer internship opportunity for CS students',
      requirements: ['React', 'Node.js', 'JavaScript'],
      location: 'Remote',
      status: 'Active'
    },
    {
      id: 2,
      title: 'Global Hackathon 2024',
      company: 'DevCommunity',
      type: 'Hackathon',
      deadline: '2024-03-01',
      description: '48-hour virtual hackathon',
      requirements: ['Open to all', 'Team size: 2-4'],
      location: 'Virtual',
      status: 'Upcoming'
    }
  ]);

  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title: 'New AI Research Lab Opening',
      source: 'TechDaily',
      date: '2024-01-20',
      category: 'Industry News',
      content: 'Major tech company announces new AI research facility'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedItems, setSavedItems] = useState([]);

  const categories = ['Internships', 'Jobs', 'Hackathons', 'Competitions', 'Workshops'];

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesFilter = filter === 'all' || opp.type.toLowerCase() === filter;
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSaveItem = (item) => {
    setSavedItems([...savedItems, item]);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
          Tech Opportunities & News
        </h1>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: filter === 'all' ? '#a259ff' : '#f1f1f1',
              color: filter === 'all' ? 'white' : 'black',
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category.toLowerCase())}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filter === category.toLowerCase() ? '#a259ff' : '#f1f1f1',
                color: filter === category.toLowerCase() ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Opportunities Section */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Latest Opportunities</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredOpportunities.map(opp => (
              <div
                key={opp.id}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{opp.title}</h3>
                    <p style={{ color: '#666' }}>{opp.company}</p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '16px',
                    background: '#f1f5f9',
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    {opp.type}
                  </span>
                </div>
                <p style={{ marginBottom: '12px' }}>{opp.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {opp.requirements.map((req, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 8px',
                          background: '#f1f1f1',
                          borderRadius: '4px',
                          fontSize: '14px'
                        }}
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleSaveItem(opp)}
                    style={{
                      background: '#a259ff',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News Feed Section */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Tech News</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {newsItems.map(news => (
              <div
                key={news.id}
                style={{
                  background: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{news.title}</h3>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                  {news.source} · {news.date}
                </p>
                <p style={{ fontSize: '14px' }}>{news.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Placements;

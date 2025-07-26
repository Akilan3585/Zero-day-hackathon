import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function PollAndFeedback() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([
    {
      id: 1,
      question: 'Do you prefer offline exams?',
      options: ['Yes', 'No', 'No preference'],
      votes: [15, 25, 10],
      totalVotes: 50,
      status: 'active',
      createdBy: 'Admin',
      createdAt: '2024-01-20',
      type: 'poll'
    },
    {
      id: 2,
      question: 'Workshop Feedback: React.js Basics',
      options: ['Excellent', 'Good', 'Average', 'Poor'],
      votes: [20, 15, 5, 2],
      totalVotes: 42,
      status: 'closed',
      createdBy: 'Admin',
      createdAt: '2024-01-15',
      type: 'feedback'
    }
  ]);

  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    type: 'poll'
  });

  const [userVotes, setUserVotes] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [showResults, setShowResults] = useState({});

  const handleAddOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, '']
    });
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!user?.role === 'admin') return;

    const poll = {
      id: Date.now(),
      question: newPoll.question,
      options: newPoll.options,
      votes: new Array(newPoll.options.length).fill(0),
      totalVotes: 0,
      status: 'active',
      createdBy: user.name,
      createdAt: new Date().toISOString().split('T')[0],
      type: newPoll.type
    };

    setPolls([poll, ...polls]);
    setNewPoll({
      question: '',
      options: ['', ''],
      type: 'poll'
    });
  };

  const handleVote = async (pollId, optionIndex) => {
    if (userVotes[pollId]) return;

    const updatedPolls = polls.map(poll => {
      if (poll.id === pollId) {
        const newVotes = [...poll.votes];
        newVotes[optionIndex]++;
        return {
          ...poll,
          votes: newVotes,
          totalVotes: poll.totalVotes + 1
        };
      }
      return poll;
    });

    setPolls(updatedPolls);
    setUserVotes({ ...userVotes, [pollId]: true });
    setShowResults({ ...showResults, [pollId]: true });
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px' }}>
        Polls & Feedback
      </h1>

      {user?.role === 'admin' && (
        <div style={{ marginBottom: '32px', background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Create New Poll</h2>
          <form onSubmit={handleCreatePoll}>
            <input
              type="text"
              value={newPoll.question}
              onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
              placeholder="Enter your question"
              style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd' }}
            />
            
            <select
              value={newPoll.type}
              onChange={(e) => setNewPoll({ ...newPoll, type: e.target.value })}
              style={{ width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd' }}
            >
              <option value="poll">Poll</option>
              <option value="feedback">Feedback</option>
            </select>

            {newPoll.options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...newPoll.options];
                  newOptions[index] = e.target.value;
                  setNewPoll({ ...newPoll, options: newOptions });
                }}
                placeholder={`Option ${index + 1}`}
                style={{ width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleAddOption}
                style={{ padding: '12px 24px', background: '#f1f1f1', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Add Option
              </button>
              <button
                type="submit"
                style={{ padding: '12px 24px', background: '#a259ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >
                Create {newPoll.type === 'poll' ? 'Poll' : 'Feedback'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '24px' }}>
        {polls.map(poll => (
          <div key={poll.id} style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{poll.question}</h3>
              <span style={{
                padding: '4px 12px',
                borderRadius: '16px',
                background: poll.status === 'active' ? '#f0fdf4' : '#fee2e2',
                color: poll.status === 'active' ? '#22c55e' : '#ef4444',
                fontSize: '14px'
              }}>
                {poll.status}
              </span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              {poll.options.map((option, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  {showResults[poll.id] ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span>{option}</span>
                          <span>{Math.round((poll.votes[index] / poll.totalVotes) * 100)}%</span>
                        </div>
                        <div style={{ height: '8px', background: '#f1f1f1', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${(poll.votes[index] / poll.totalVotes) * 100}%`,
                              height: '100%',
                              background: '#a259ff',
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleVote(poll.id, index)}
                      disabled={userVotes[poll.id] || poll.status === 'closed'}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: userVotes[poll.id] === index ? '#a259ff' : '#f1f1f1',
                        color: userVotes[poll.id] === index ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        opacity: poll.status === 'closed' ? 0.5 : 1
                      }}
                    >
                      {option}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '14px' }}>
              <span>Total votes: {poll.totalVotes}</span>
              <span>Created: {poll.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PollAndFeedback;

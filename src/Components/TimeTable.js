import React, { useState } from 'react';

function TimeTable() {
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const [timetable, setTimetable] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    room: '',
    day: '',
    time: ''
  });

  const handleSlotClick = (day, time) => {
    setSelectedSlot({ day, time });
    setFormData({
      ...formData,
      day,
      time,
      ...(timetable[`${day}-${time}`] || {})
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slotKey = `${formData.day}-${formData.time}`;
    setTimetable(prev => ({
      ...prev,
      [slotKey]: {
        subject: formData.subject,
        teacher: formData.teacher,
        room: formData.room
      }
    }));
    setShowForm(false);
    setSelectedSlot(null);
    setFormData({ subject: '', teacher: '', room: '', day: '', time: '' });
  };

  const deleteSlot = (day, time) => {
    const slotKey = `${day}-${time}`;
    const newTimetable = { ...timetable };
    delete newTimetable[slotKey];
    setTimetable(newTimetable);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>Class Timetable</h1>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px #f3f3f3' }}>
          <thead>
            <tr>
              <th style={{ padding: '15px', background: '#f7f7fa', borderBottom: '2px solid #eee' }}>Time</th>
              {days.map(day => (
                <th key={day} style={{ padding: '15px', background: '#f7f7fa', borderBottom: '2px solid #eee' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: '500' }}>{time}</td>
                {days.map(day => {
                  const slot = timetable[`${day}-${time}`];
                  return (
                    <td 
                      key={`${day}-${time}`} 
                      style={{ 
                        padding: '15px', 
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                        background: slot ? '#f8f4ff' : 'transparent'
                      }}
                      onClick={() => handleSlotClick(day, time)}
                    >
                      {slot ? (
                        <div>
                          <div style={{ fontWeight: '600', color: '#a259ff' }}>{slot.subject}</div>
                          <div style={{ fontSize: '14px', color: '#63636b' }}>{slot.teacher}</div>
                          <div style={{ fontSize: '14px', color: '#63636b' }}>Room {slot.room}</div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSlot(day, time);
                            }}
                            style={{ 
                              background: 'none',
                              border: 'none',
                              color: '#f43f5e',
                              cursor: 'pointer',
                              fontSize: '12px',
                              padding: '4px 8px',
                              marginTop: '4px'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div style={{ color: '#63636b', fontSize: '14px' }}>Click to add class</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h2 style={{ marginBottom: '24px' }}>
              {timetable[`${selectedSlot?.day}-${selectedSlot?.time}`] ? 'Edit Class' : 'Add New Class'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Teacher"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="Room Number"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
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
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedSlot(null);
                  }}
                  style={{ 
                    flex: 1,
                    padding: '12px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeTable;

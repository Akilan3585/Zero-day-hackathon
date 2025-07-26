// Test script for announcement functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/announcement';

async function testAnnouncementAPI() {
  console.log('🧪 Testing Announcement API...\n');

  // Test 1: Get announcements
  console.log('1. Testing GET /announcements');
  try {
    const response = await fetch(`${BASE_URL}/announcements`);
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    console.log('✅ GET announcements test completed\n');
  } catch (error) {
    console.error('❌ GET announcements test failed:', error.message);
  }

  // Test 2: Create announcement (this will fail without proper auth, but we can see the error)
  console.log('2. Testing POST /announcements');
  try {
    const testAnnouncement = {
      title: 'Test Announcement',
      description: 'This is a test announcement',
      tag: 'General',
      userRole: 'admin',
      author: 'Admin',
      date: new Date().toISOString().split('T')[0]
    };

    const response = await fetch(`${BASE_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify(testAnnouncement)
    });

    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Response:', data);
    console.log('✅ POST announcement test completed\n');
  } catch (error) {
    console.error('❌ POST announcement test failed:', error.message);
  }

  console.log('🎯 Test completed!');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    console.log('✅ Backend server is running');
    return true;
  } catch (error) {
    console.log('❌ Backend server is not running. Please start it with: npm start');
    return false;
  }
}

async function runTests() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testAnnouncementAPI();
  }
}

runTests(); 
(async () => {
  try {
    const base = 'http://localhost:5000/api';

    // Register (may fail if user exists)
    let res = await fetch(base + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test+auto@example.com', password: 'password123' })
    });
    console.log('register status:', res.status);
    console.log(await res.text());

    // Login
    res = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test+auto@example.com', password: 'password123' })
    });
    console.log('login status:', res.status);
    const loginText = await res.text();
    console.log(loginText);
    let token = null;
    try { token = JSON.parse(loginText).token; } catch(e) { }

    if (!token) {
      console.error('No token received; aborting interview start.');
      process.exit(1);
    }

    // Start interview
    res = await fetch(base + '/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ role: 'Frontend Developer', type: 'Technical', difficulty: 'Medium' })
    });
    console.log('start interview status:', res.status);
    console.log(await res.text());
  } catch (err) {
    console.error('Error in test script:', err);
    process.exit(2);
  }
})();

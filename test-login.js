// Using built-in fetch in Node.js

async function testLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'sari.parent@email.com',
        password: 'password'
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Login berhasil!');
      console.log('User:', data.user.name);
      console.log('Role:', data.user.role);
      console.log('Token:', data.token.substring(0, 50) + '...');
    } else {
      console.log('❌ Login gagal:', data.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

testLogin();

const http = require('http');

const data = JSON.stringify({
  email: 'sari.parent@email.com',
  password: 'password'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      if (res.statusCode === 200 && result.success) {
        console.log('✅ Login berhasil!');
        console.log('User:', result.user.name);
        console.log('Role:', result.user.role);
        console.log('Token:', result.token.substring(0, 50) + '...');
      } else {
        console.log('❌ Login gagal:', result.error);
      }
    } catch (error) {
      console.log('❌ Error parsing response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Request error:', error.message);
});

req.write(data);
req.end();

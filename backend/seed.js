const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./models/User');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  
  await User.create([
    { name: 'Admin User', email: 'admin@test.com', password: 'Admin1234!', role: 'admin' },
    { name: 'Manager User', email: 'manager@test.com', password: 'Manager1234!', role: 'manager' },
    { name: 'Viewer User', email: 'viewer@test.com', password: 'Viewer1234!', role: 'viewer' }
  ]);
  
  console.log('Seed complete! Users created.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });

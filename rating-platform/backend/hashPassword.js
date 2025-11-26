import bcrypt from 'bcryptjs';

const password = 'Admin@123';
const hashedPassword = await bcrypt.hash(password, 10);

console.log('Hashed Password:', hashedPassword);
console.log('\nRun this SQL in MySQL Workbench:');
console.log(`
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator Account', 'admin@platform.com', '${hashedPassword}', '123 Admin Street, Admin City, AC 12345', 'admin');
`);
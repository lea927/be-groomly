// Register module aliases first
import './register-aliases';

// Now you can use path aliases in your imports
import { UserRole } from '@/types';

console.log('Starting application...');
console.log(`Available user roles: ${Object.values(UserRole)}`);

// Here you would typically import and start your Express app
// import app from './app';
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

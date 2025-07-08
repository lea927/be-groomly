// Register module aliases first
import './register-aliases';

// Import the server
import { startServer } from './server';

// Start the server
startServer();

// Here you would typically import and start your Express app
// import app from './app';
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

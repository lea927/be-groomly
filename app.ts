import { startServer } from './src/server';

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  startServer();
}

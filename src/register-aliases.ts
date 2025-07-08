// This file is used to register module aliases for Node.js runtime
import moduleAlias from 'module-alias';
import path from 'path';

// Calculate base directory (dist is one level up from current file in dist/src)
const baseDir = path.join(__dirname, '..');

// Register aliases
moduleAlias.addAliases({
  '@': path.join(baseDir, 'src'),
  '@controllers': path.join(baseDir, 'src/controllers'),
  '@middleware': path.join(baseDir, 'src/middleware'),
  '@routes': path.join(baseDir, 'src/routes'),
  '@services': path.join(baseDir, 'src/services'),
  '@config': path.join(baseDir, 'src/config'),
  '@libs': path.join(baseDir, 'src/libs'),
  '@errors': path.join(baseDir, 'src/errors'),
  '@validations': path.join(baseDir, 'src/validations'),
  '@tests': path.join(baseDir, 'tests'),
});

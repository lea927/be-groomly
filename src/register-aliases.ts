// This file is used to register module aliases for Node.js runtime
import moduleAlias from 'module-alias';
import path from 'path';

// Calculate base directory (dist is one level up from current file in dist/src)
const baseDir = path.join(__dirname, '..');

// Register aliases
moduleAlias.addAliases({
  '@': path.join(baseDir, 'src'),
  '@config': path.join(baseDir, 'src/config'),
  '@controllers': path.join(baseDir, 'src/controllers'),
  '@errors': path.join(baseDir, 'src/errors'),
  '@libs': path.join(baseDir, 'src/libs'),
  '@middleware': path.join(baseDir, 'src/middleware'),
  '@routes': path.join(baseDir, 'src/routes'),
  '@services': path.join(baseDir, 'src/services'),
  '@tests': path.join(baseDir, 'tests'),
  '@validations': path.join(baseDir, 'src/validations'),
});

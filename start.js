#!/usr/bin/env node

// This file is needed in the project root to simplify module alias registration
// It will be used when running the compiled JS code
require('./dist/src/register-aliases');
require('./dist/app');

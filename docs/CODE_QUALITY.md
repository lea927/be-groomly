# Code Quality Gates 🛡️

## 🚫 **Commit Will Be BLOCKED If:**

### **1. Linting Errors**
- Any ESLint errors (not warnings)
- `--max-warnings 0` means even warnings block commits
- Unused variables, syntax errors, style violations

### **2. Formatting Issues**
- Code not formatted with Prettier
- Inconsistent spacing, quotes, or indentation

### **3. Test Failures**
- Any failing unit tests
- Test coverage below threshold (if configured)

### **4. Invalid Commit Messages**
- Not following conventional commit format
- Missing type (feat, fix, docs, etc.)

## ✅ **How to Fix Before Committing:**

### **Quick Fix Commands:**
```bash
# Fix linting and formatting issues
pnpm run lint:fix && pnpm run format

# Run all quality checks manually
pnpm run pre-commit
```

### **Step-by-Step Fix:**
```bash
# 1. Check what's wrong
pnpm run lint:strict
pnpm run format:check
pnpm test

# 2. Fix automatically fixable issues
pnpm run lint:fix
pnpm run format

# 3. Fix remaining issues manually
# (Edit files to fix logic errors, unused variables, etc.)

# 4. Verify everything passes
pnpm run pre-commit

# 5. Commit with conventional format
git add .
git commit -m "feat: your feature description"
```

## 🔒 **Branch Protection Rules:**

### **Main Branch:**
- ❌ **No direct pushes** allowed
- ✅ **Pull requests required**
- ✅ **CI must pass** before merge
- ✅ **Code review required**

### **Develop Branch:**
- ✅ **Direct pushes** allowed
- ✅ **All quality gates** must pass

## 🚀 **Bypass Options (Emergency Only):**

### **Skip Pre-commit Hooks:**
```bash
git commit -m "emergency fix" --no-verify
```

⚠️ **Warning:** Only use `--no-verify` for emergency hotfixes!

### **Force Push (Admin Only):**
```bash
git push --force-with-lease
```

⚠️ **Warning:** Never force push to shared branches!

## 📋 **Quality Checklist:**

Before committing, ensure:
- [ ] No linting errors (`pnpm run lint:strict`)
- [ ] Code properly formatted (`pnpm run format:check`)
- [ ] All tests pass (`pnpm test`)
- [ ] Conventional commit message
- [ ] No sensitive data in code
- [ ] Updated documentation if needed

## 🎯 **Benefits for Your Startup:**

- ✅ **Consistent Code Quality** - All code follows same standards
- ✅ **Reduced Bugs** - Catch issues before they reach production
- ✅ **Team Efficiency** - Less time spent on code review
- ✅ **Professional Standards** - Industry-standard development practices
- ✅ **Easier Debugging** - Clean, consistent codebase
- ✅ **Faster Onboarding** - New developers follow established patterns

## 🛠️ **IDE Setup (Recommended):**

Configure your editor to:
- Show ESLint errors in real-time
- Auto-format on save with Prettier
- Highlight unused variables
- Auto-fix simple issues

This prevents issues before you even commit! 🎉

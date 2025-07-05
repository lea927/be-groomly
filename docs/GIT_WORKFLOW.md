# Git Workflow & Conventional Commits

## 📋 **Branch Strategy**

### **Main Branches:**
- **`main`** - Production-ready code (stable, deployable)
- **`develop`** - Integration branch for ongoing development

### **Feature Branches:**
- **`feature/feature-name`** - New features
- **`fix/bug-description`** - Bug fixes
- **`docs/documentation-update`** - Documentation updates
- **`chore/maintenance-task`** - Maintenance tasks

## 🎯 **Conventional Commit Format**

```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Commit Types:**
- **`feat`** - New feature
- **`fix`** - Bug fix
- **`docs`** - Documentation changes
- **`style`** - Code style changes (formatting, etc.)
- **`refactor`** - Code refactoring
- **`test`** - Adding or updating tests
- **`chore`** - Maintenance tasks
- **`perf`** - Performance improvements
- **`ci`** - CI/CD changes
- **`build`** - Build system changes
- **`revert`** - Revert previous commit

### **Examples:**
```bash
feat: add user authentication system
fix: resolve login form validation issue
docs: update API documentation
style: format code with prettier
refactor: extract user service into separate module
test: add unit tests for authentication
chore: update dependencies
```

## 🚀 **Workflow Commands**

### **Easy Commit (Guided):**
```bash
pnpm run commit
```

### **Manual Commit:**
```bash
git add .
git commit -m "feat: add new feature description"
```

### **Feature Development:**
```bash
# Create feature branch from develop
git checkout develop
git checkout -b feature/user-authentication

# Make changes and commit
git add .
git commit -m "feat: add user authentication endpoints"

# Push feature branch
git push origin feature/user-authentication

# Create pull request to develop
# After review, merge to develop
```

### **Release Process:**
```bash
# When ready to release from develop
git checkout main
git merge develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

## 🔧 **Git Hooks**

### **Pre-commit Hook:**
- Runs ESLint to check code quality
- Runs Prettier to format code
- Prevents commits with linting errors

### **Commit-msg Hook:**
- Validates commit message format
- Ensures conventional commit standard
- Prevents invalid commit messages

## 📝 **Best Practices**

1. **Keep commits atomic** - One logical change per commit
2. **Write descriptive commit messages** - Explain what and why
3. **Use present tense** - "Add feature" not "Added feature"
4. **Reference issues** - Include issue numbers when relevant
5. **Test before committing** - Ensure tests pass
6. **Keep branches short-lived** - Merge quickly to avoid conflicts

## 🎯 **For Your Startup**

### **Development Flow:**
1. **Feature development** happens on `develop` branch
2. **Hotfixes** can be branched from `main`
3. **Releases** are merged from `develop` to `main`
4. **Deployments** happen from `main` branch

### **Deployment Strategy:**
- **`develop`** → Staging environment
- **`main`** → Production environment

This setup ensures clean history, easy rollbacks, and professional development practices that scale with your startup!

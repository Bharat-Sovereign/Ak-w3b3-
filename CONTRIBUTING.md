# Contributing to AK Governor DAO

Thank you for your interest in contributing to the AK Governor DAO project! We appreciate your help in making this a better decentralized governance system.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Coding Standards](#coding-standards)
- [Security](#security)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment for all contributors.

### Our Standards

- **Be respectful** - Treat all contributors with respect
- **Be inclusive** - Welcome contributors from all backgrounds
- **Be constructive** - Provide helpful feedback and suggestions
- **Communicate clearly** - Explain your ideas and suggestions clearly
- **Report issues** - Report Code of Conduct violations privately to maintainers

## How to Contribute

We welcome contributions in the following areas:

### ✅ We Welcome

1. **Bug Fixes** - Fix issues with clear reproduction steps
2. **Security Improvements** - Enhance contract security and access controls
3. **Test Coverage** - Add tests for existing functionality
4. **Documentation** - Improve guides, examples, and comments
5. **Performance Optimizations** - Optimize gas usage and efficiency
6. **Deployment Scripts** - Add scripts for different networks
7. **Monitoring Tools** - Create tools for tracking governance activities
8. **Frontend Integration** - Build UIs for governance interaction

### ❌ We're Not Currently Looking For

1. **Architectural Changes** - Major rewrites without discussion
2. **New Governance Models** - Different voting mechanisms (discuss first)
3. **Unaudited Contracts** - New contract code without security review
4. **External Dependencies** - Adding unnecessary third-party libraries
5. **Breaking Changes** - Changes that break existing deployments

## Getting Started

### Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **npm** v9+ or **yarn**
- **Git** ([download](https://git-scm.com/))
- **Solidity** knowledge (for contract contributions)
- **TypeScript/Hardhat** experience (for deployment scripts)

### Clone the Repository

```bash
git clone https://github.com/your-org/ak-governor-dao.git
cd ak-governor-dao
```

### Install Dependencies

```bash
npm install
```

### Verify Installation

```bash
npx hardhat compile
npm test
```

## Development Workflow

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch (use descriptive names)
git checkout -b feature/governor-upgrade
git checkout -b fix/voting-delay-bug
git checkout -b docs/deployment-guide
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions
- `refactor/` - Code refactoring
- `security/` - Security improvements

### 2. Make Changes

```bash
# Make your changes
# Edit files, add features, fix bugs

# Compile contracts
npx hardhat compile

# Run tests (see Testing section)
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### 3. Commit Changes

Write clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "feat: Add proposal cancellation mechanism"
git commit -m "fix: Correct voting delay calculation for Arbitrum"
git commit -m "test: Add edge case tests for quorum requirements"
git commit -m "docs: Update deployment guide with gas estimates"

# Avoid vague messages
git commit -m "Update stuff"
git commit -m "Fix bugs"
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Tests
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `security` - Security fix

**Scope:**
- `governor` - Governor contract
- `timelock` - TimelockController
- `deploy` - Deployment scripts
- `test` - Test suite
- `docs` - Documentation

**Subject:**
- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period at the end
- Limit to 50 characters

**Body:**
- Explain what and why, not how
- Reference related issues
- Wrap at 72 characters

**Footer:**
- Reference issue: `Closes #123`
- Breaking changes: `BREAKING CHANGE: description`

### Example

```
feat(governor): Add proposal expiration mechanism

- Expired proposals cannot be executed after timelock duration
- Reduces storage bloat from old proposals
- Improves governance efficiency

Closes #42
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npx hardhat test test/deploy.test.ts
```

### Run Tests with Gas Reporter

```bash
npm run gas-report
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Writing Tests

When adding features, write tests that cover:

1. **Happy Path** - Normal operation
2. **Edge Cases** - Boundary conditions
3. **Error Cases** - Invalid inputs
4. **Security Cases** - Potential exploits

```typescript
describe('NewFeature', function () {
  // Happy path
  it('should work correctly with valid input', async function () {
    // Arrange
    const input = 'valid';
    
    // Act
    const result = await contract.newFeature(input);
    
    // Assert
    expect(result).to.equal(expectedValue);
  });

  // Edge case
  it('should handle edge case values', async function () {
    const result = await contract.newFeature(0);
    expect(result).to.not.be.null;
  });

  // Error case
  it('should revert with invalid input', async function () {
    await expect(
      contract.newFeature(invalidInput)
    ).to.be.revertedWithCustomError(contract, 'InvalidInput');
  });

  // Security case
  it('should not allow unauthorized access', async function () {
    await expect(
      contract.connect(unauthorized).sensitiveFunction()
    ).to.be.revertedWithCustomError(contract, 'Unauthorized');
  });
});
```

### Test Coverage Requirements

- Aim for >80% coverage
- All public functions must be tested
- All critical paths must be tested
- Security-sensitive code must be thoroughly tested

## Coding Standards

### Solidity Style Guide

Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html):

```solidity
// ✅ Good
pragma solidity ^0.8.27;

contract MyContract {
  uint256 public constant MAX_VALUE = 1000;
  
  event ProposalCreated(uint256 indexed proposalId, address indexed proposer);
  
  function createProposal(
    address[] calldata targets,
    uint256[] calldata values,
    string memory description
  ) external returns (uint256) {
    require(targets.length > 0, "Invalid targets");
    return _createProposal(targets, values, description);
  }
  
  function _createProposal(
    address[] calldata targets,
    uint256[] calldata values,
    string memory description
  ) private returns (uint256) {
    // Implementation
  }
}

// ❌ Avoid
contract mycontract{
function Create_Proposal(address[]targets,uint[]values,string desc)public{
// Bad formatting and naming
}
}
```

### TypeScript/JavaScript Standards

```typescript
// ✅ Good
interface DeploymentConfig {
  votingTokenAddress: string;
  minDelay: number;
}

async function deployGovernor(config: DeploymentConfig): Promise<string> {
  const governor = await GovernorFactory.deploy(config);
  return await governor.getAddress();
}

// ❌ Avoid
async function deployGovernor(config: any): Promise<any> {
  const governor = await GovernorFactory.deploy(config);
  return governor;
}
```

### Documentation Standards

- Add JSDoc comments to functions
- Document constructor parameters
- Explain complex logic with comments
- Update README with new features

```typescript
/**
 * Deploys the AK Governor contract
 * 
 * @param votingToken - Address of ERC20Votes token
 * @param timelock - Address of TimelockController
 * @returns Governor contract address
 * @throws Error if deployment fails
 */
async function deployGovernor(
  votingToken: string,
  timelock: string
): Promise<string> {
  // Implementation
}
```

## Security

### Security Considerations

1. **Audit First** - Have significant changes audited
2. **Test Thoroughly** - Write comprehensive tests
3. **Document Assumptions** - Explain security models
4. **Minimize Changes** - Small, focused PRs are easier to review
5. **Review Process** - All code needs peer review

### Reporting Security Issues

**Do not open public issues for security vulnerabilities!**

Email: `security@example.com` with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We'll acknowledge within 48 hours and work on a fix.

### Security Checklist

Before submitting PRs with security implications:

- [ ] No hardcoded secrets or private keys
- [ ] No unchecked external calls
- [ ] Proper access control checks
- [ ] No integer overflows/underflows
- [ ] Reentrancy guards where needed
- [ ] Time-based logic is sound
- [ ] All paths tested

## Pull Request Process

### 1. Before Submitting

- [ ] Fork the repository
- [ ] Create feature branch
- [ ] Make changes and add tests
- [ ] Run tests: `npm test`
- [ ] Run linter: `npm run lint`
- [ ] Format code: `npm run format`
- [ ] Update documentation
- [ ] Commit with clear messages

### 2. Create Pull Request

**PR Title Format:**

```
[TYPE] Short description of changes

Examples:
[FEATURE] Add proposal cancellation mechanism
[FIX] Correct voting delay calculation
[DOCS] Update deployment guide
[TEST] Add edge case tests
```

**PR Description Template:**

```markdown
## Description
Brief explanation of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Security improvement

## Related Issues
Closes #123

## Testing
- [ ] Added tests
- [ ] All tests pass
- [ ] Tested on testnet
- [ ] Tested locally

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes
- [ ] Tested on: [network/environment]

## Gas Impact
- [ ] No significant gas changes
- [ ] Gas optimized (by ~X%)
- [ ] Gas increased (see explanation)
```

### 3. Review Process

1. **Automated Checks** - Tests, linting, coverage
2. **Code Review** - Peers review code quality
3. **Security Review** - For security-sensitive changes
4. **Maintainer Approval** - Final approval from maintainers

### 4. After Approval

- [ ] Merge PR to main
- [ ] Delete feature branch
- [ ] Celebrate! 🎉

### PR Review Checklist

Reviewers will check:

- ✅ Code quality and standards
- ✅ Test coverage
- ✅ Security implications
- ✅ Documentation clarity
- ✅ Performance impact
- ✅ Breaking changes
- ✅ Compatibility

## Reporting Bugs

### Before Reporting

- [ ] Check existing issues
- [ ] Try to reproduce the bug
- [ ] Note reproduction steps
- [ ] Check if it's a documentation issue

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Reproduction Steps
1. Step 1
2. Step 2
3. Expected behavior vs actual behavior

## Environment
- OS: [Windows/macOS/Linux]
- Node version: [version]
- Hardhat version: [version]
- Network: [mainnet/sepolia/local]

## Logs/Error Messages
```
Error message here
```

## Additional Context
Screenshots, links, or other relevant info
```

## Suggesting Features

### Before Suggesting

- [ ] Check existing issues/discussions
- [ ] Ensure it aligns with project goals
- [ ] Consider governance implications

### Feature Request Template

```markdown
## Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should this feature work?

## Alternatives
Have you considered alternatives?

## Additional Context
Examples, related features, external links
```

## Community

### Getting Help

- **Questions**: [GitHub Discussions](https://github.com/your-org/ak-governor-dao/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/your-org/ak-governor-dao/issues)
- **Security Issues**: security@example.com
- **General Chat**: [Discord Community](https://discord.gg)

### Maintainers

- [@username1](https://github.com/username1) - Project Lead
- [@username2](https://github.com/username2) - Smart Contracts
- [@username3](https://github.com/username3) - DevOps

### Recognition

We recognize all contributions! Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Recognized in community channels

## Additional Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Solidity Best Practices](https://docs.soliditylang.org/en/v0.8.27/security-considerations.html)
- [OpenZeppelin Governor Guide](https://docs.openzeppelin.com/contracts/latest/governance)

## License

By contributing to this project, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to AK Governor DAO! 🙏
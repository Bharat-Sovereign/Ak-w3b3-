# AK Governor DAO

A decentralized autonomous organization (DAO) built with OpenZeppelin Governor contracts on Ethereum and EVM-compatible blockchains.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Testing](#testing)
- [Usage](#usage)
- [Governance Workflow](#governance-workflow)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AK Governor is a fully decentralized governance system that allows token holders to:
- Create proposals for protocol changes
- Vote on proposals using their token balance
- Execute approved proposals after a time delay
- Manage smart contract operations through on-chain governance

The system uses OpenZeppelin's battle-tested Governor contracts combined with a TimelockController to ensure safe, time-locked execution of governance decisions.

## ✨ Features

- **Token-Based Voting**: Governance power proportional to token holdings
- **Time-Locked Execution**: 2-day delay between approval and execution
- **Simple Vote Counting**: For/Against/Abstain voting mechanism
- **Quorum Requirements**: 4% minimum participation threshold
- **Access Control**: Role-based permissions via TimelockController
- **Multi-Chain Support**: Deploy to Ethereum, Polygon, Arbitrum, Optimism, and more
- **Comprehensive Testing**: Full test suite with edge cases

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────────────────────────┐
│                    AK Governor                          │
│  (Manages proposals, voting, and proposal lifecycle)    │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
┌──────────────────┐  ┌──────────────────────┐
│  ERC20Votes      │  │ TimelockController   │
│  (Governance     │  │ (Time-locked         │
│   Token)         │  │  execution)          │
└──────────────────┘  └──────────────────────┘
```

### Key Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| **Voting Delay** | 7,200 blocks (~1 day) | Time before voting starts after proposal |
| **Voting Period** | 50,400 blocks (~1 week) | Duration of voting |
| **Proposal Threshold** | 0 tokens | Minimum tokens needed to create proposal |
| **Quorum** | 4% | Minimum participation required |
| **Timelock Delay** | 2 days | Waiting period before execution |

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** v18+ installed
- **npm** v9+ or **yarn**
- **Git** installed
- An Ethereum wallet with:
  - ETH for gas fees
  - ERC20Votes governance tokens (optional for testing)

### Recommended Tools

- [MetaMask](https://metamask.io/) - Wallet management
- [Etherscan](https://etherscan.io/) - Contract verification
- [Hardhat](https://hardhat.org/) - Development environment

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ak-governor-dao.git
cd ak-governor-dao
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment File

```bash
cp .env.example .env
```

### 4. Verify Installation

```bash
npx hardhat compile
```

## ⚙️ Configuration

### Environment Variables

Edit `.env` with your settings:

```bash
# Network RPC URL
RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# Deployment Account (PRIVATE_KEY without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Governance Token Address (must be ERC20Votes compatible)
VOTING_TOKEN_ADDRESS=0x...

# (Optional) Block Explorer API Key for contract verification
ETHERSCAN_API_KEY=YOUR_API_KEY
```

### Governance Parameters

To modify governance parameters, edit the AK Governor constructor in `contracts/AK.sol`:

```solidity
GovernorSettings(
  7200,    // votingDelay (blocks)
  50400,   // votingPeriod (blocks)
  0        // proposalThreshold (wei)
)
GovernorVotesQuorumFraction(4)  // 4% quorum
```

## 📦 Deployment

### 1. Test on Local Network

```bash
# Start local Hardhat node
npx hardhat node

# In another terminal, deploy
npx hardhat run scripts/deploy.ts --network hardhat
```

### 2. Deploy to Testnet (Sepolia)

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

Expected output:
```
Deploying contracts with account: 0x...

Deploying TimelockController...
✓ TimelockController deployed at: 0xabc123...

Deploying AK Governor...
✓ AK Governor deployed at: 0xdef456...

Setting up roles...
✓ Granted PROPOSER_ROLE to Governor
✓ Granted EXECUTOR_ROLE to Governor

Verifying deployment...
Governor Configuration:
  - Voting Delay: 7200 blocks
  - Voting Period: 50400 blocks
  - Proposal Threshold: 0 tokens
  - Quorum: 4%
  - Timelock: 0xabc123...

========================================
DEPLOYMENT COMPLETE
========================================

Save these addresses:

VOTING_TOKEN_ADDRESS=0x...
TIMELOCK_ADDRESS=0xabc123...
GOVERNOR_ADDRESS=0xdef456...
```

### 3. Deploy to Mainnet

```bash
# ⚠️ This will spend real gas fees!
npx hardhat run scripts/deploy.ts --network mainnet
```

### 4. Verify Contract on Block Explorer

After deployment, verify your contracts on Etherscan:

```bash
npx hardhat verify --network sepolia GOVERNOR_ADDRESS "0xTOKEN_ADDRESS" "0xTIMELOCK_ADDRESS"
```

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
npx hardhat test test/deploy.test.ts
```

### Generate Coverage Report

```bash
npm run test:coverage
```

### Test with Gas Reporter

```bash
npm run gas-report
```

## 💡 Usage

### Creating a Proposal

```typescript
const targets = [contractAddress];
const values = [0]; // ETH value to send (0 for most proposals)
const calldatas = [
  contract.interface.encodeFunctionData('functionName', [param1, param2])
];
const description = 'Proposal #1: Update governance parameter';

const tx = await governor.propose(targets, values, calldatas, description);
const receipt = await tx.wait();
const proposalId = receipt.events[0].args.proposalId;
```

### Voting on a Proposal

```typescript
// Vote support: 0 = Against, 1 = For, 2 = Abstain
const tx = await governor.connect(voter).castVote(proposalId, 1);
await tx.wait();
```

### Queueing a Proposal

After voting period ends and proposal succeeds:

```typescript
const descriptionHash = ethers.id(description);
const tx = await governor.queue(targets, values, calldatas, descriptionHash);
await tx.wait();
```

### Executing a Proposal

After timelock delay (2 days):

```typescript
const tx = await governor.execute(targets, values, calldatas, descriptionHash);
await tx.wait();
```

## 📊 Governance Workflow

### Complete Proposal Lifecycle

```
1. PROPOSE
   └─ Community member submits proposal
   └─ Proposal enters "Pending" state
   └─ Voting delay begins (7,200 blocks)

2. VOTE (after voting delay)
   └─ Token holders cast votes
   └─ Proposal in "Active" state
   └─ Voting period: 50,400 blocks (~1 week)

3. QUEUE (after voting period, if approved)
   └─ Proposal moves to "Queued" state
   └─ Timelock counter starts (2 days)

4. EXECUTE (after timelock delay)
   └─ Approved transaction executes
   └─ Proposal moves to "Executed" state
   └─ Changes take effect on-chain
```

### Proposal States

| State | Description |
|-------|-------------|
| **Pending** | Awaiting voting delay |
| **Active** | Voting in progress |
| **Canceled** | Proposal was canceled |
| **Defeated** | Voting failed (insufficient votes) |
| **Succeeded** | Voting passed |
| **Queued** | Ready for execution (in timelock) |
| **Expired** | Queued proposal expired |
| **Executed** | Successfully executed on-chain |

## 🔒 Security

### Best Practices

1. **Never share private keys** - Store securely in `.env` (never commit)
2. **Use testnets first** - Always test on Sepolia before mainnet
3. **Multi-sig for admin** - Consider multi-sig wallet for deployer
4. **Audit before mainnet** - Have contracts audited by security firm
5. **Gradual rollout** - Start with small proposals

### Security Considerations

- ✅ TimelockController prevents flash loan attacks
- ✅ 2-day delay allows community to respond to malicious proposals
- ✅ Quorum requirement ensures broad participation
- ✅ Time-based voting prevents voter manipulation

### Known Risks

⚠️ **Proposal threshold of 0** - Anyone can create proposals (may cause spam)

**Mitigation:** Modify proposal threshold in constructor:
```solidity
GovernorSettings(7200, 50400, 1000e18) // Require 1000 tokens
```

## 🐛 Troubleshooting

### Issue: "VOTING_TOKEN_ADDRESS environment variable not set"

**Solution:** Add token address to `.env`:
```bash
VOTING_TOKEN_ADDRESS=0x... # Your ERC20Votes token
```

### Issue: "Insufficient gas"

**Solution:** Ensure wallet has enough ETH:
```bash
# Check balance
npx hardhat run -c "await ethers.provider.getBalance('YOUR_ADDRESS')"
```

### Issue: "Contract not found at address"

**Solution:** 
1. Verify deployment succeeded
2. Check you're using correct network
3. Verify address from deployment output

### Issue: "Cannot vote before voting delay"

**Solution:** Wait for voting delay blocks to pass:
```typescript
// Current block + voting delay
const currentBlock = await ethers.provider.getBlockNumber();
const votingStartBlock = currentBlock + votingDelay;
console.log(`Voting starts at block ${votingStartBlock}`);
```

### Issue: "TimelockUnexecutedOperation"

**Solution:** Wait for timelock delay (2 days) after queueing:
```bash
# Check queue
npx hardhat run scripts/checkQueue.ts --network mainnet
```

## 📚 Additional Resources

- [OpenZeppelin Governor Docs](https://docs.openzeppelin.com/contracts/latest/governance)
- [TimelockController Guide](https://docs.openzeppelin.com/contracts/latest/api/governance#TimelockController)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and add tests
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For issues and questions:

- **Bug Reports**: [GitHub Issues](https://github.com/your-org/ak-governor-dao/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/ak-governor-dao/discussions)
- **Security Issues**: security@example.com (private disclosure)

## 📞 Contact

- **Twitter**: [@YourHandle](https://twitter.com)
- **Discord**: [Join Community](https://discord.gg)
- **Email**: team@example.com

---

**Made with ❤️ by the AK DAO Team**

Last updated: June 2026
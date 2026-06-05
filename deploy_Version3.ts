import { ethers } from 'hardhat';
import { TimelockController, AK } from '../typechain-types';

/**
 * Deployment script for AK Governor DAO
 * 
 * Prerequisites:
 * 1. ERC20Votes token must be deployed
 * 2. Ensure you have sufficient gas funds
 * 3. Set RPC_URL and PRIVATE_KEY environment variables
 */

interface DeploymentConfig {
  votingTokenAddress: string;
  minDelay: number; // In seconds
  proposers: string[];
  executors: string[];
  adminAddress: string;
}

async function deployTimelock(config: DeploymentConfig): Promise<TimelockController> {
  console.log('Deploying TimelockController...');
  
  const TimelockFactory = await ethers.getContractFactory('TimelockController');
  const timelock = await TimelockFactory.deploy(
    config.minDelay,
    config.proposers,
    config.executors,
    config.adminAddress
  );

  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  
  console.log(`✓ TimelockController deployed at: ${timelockAddress}`);
  return timelock;
}

async function deployGovernor(
  votingToken: string,
  timelockAddress: string
): Promise<AK> {
  console.log('Deploying AK Governor...');
  
  const AKFactory = await ethers.getContractFactory('AK');
  const governor = await AKFactory.deploy(votingToken, timelockAddress);

  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();
  
  console.log(`✓ AK Governor deployed at: ${governorAddress}`);
  return governor;
}

async function setupRoles(
  timelock: TimelockController,
  governorAddress: string,
  deployer: string
): Promise<void> {
  console.log('\nSetting up roles...');

  // Get role IDs
  const PROPOSER_ROLE = await timelock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timelock.EXECUTOR_ROLE();
  const DEFAULT_ADMIN_ROLE = await timelock.DEFAULT_ADMIN_ROLE();

  // Grant PROPOSER_ROLE to Governor
  let tx = await timelock.grantRole(PROPOSER_ROLE, governorAddress);
  await tx.wait();
  console.log(`✓ Granted PROPOSER_ROLE to Governor`);

  // Grant EXECUTOR_ROLE to Governor (usually already granted to address(0) for "anyone")
  tx = await timelock.grantRole(EXECUTOR_ROLE, governorAddress);
  await tx.wait();
  console.log(`✓ Granted EXECUTOR_ROLE to Governor`);

  // Optional: Renounce admin role for true decentralization
  // This makes the timelock fully governed by the DAO
  // WARNING: This is irreversible!
  // tx = await timelock.renounceRole(DEFAULT_ADMIN_ROLE, deployer);
  // await tx.wait();
  // console.log(`✓ Renounced DEFAULT_ADMIN_ROLE from deployer (DAO is now fully decentralized)`);
}

async function verifyDeployment(
  governor: AK,
  timelockAddress: string
): Promise<void> {
  console.log('\nVerifying deployment...');

  // Check governor settings
  const votingDelay = await governor.votingDelay();
  const votingPeriod = await governor.votingPeriod();
  const proposalThreshold = await governor.proposalThreshold();
  const quorumNumerator = await governor.quorumNumerator();

  console.log(`Governor Configuration:`);
  console.log(`  - Voting Delay: ${votingDelay} blocks`);
  console.log(`  - Voting Period: ${votingPeriod} blocks`);
  console.log(`  - Proposal Threshold: ${proposalThreshold.toString()} tokens`);
  console.log(`  - Quorum: ${quorumNumerator}%`);
  console.log(`  - Timelock: ${timelockAddress}`);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  console.log(`Deploying contracts with account: ${deployerAddress}\n`);

  // ==========================================
  // CONFIGURATION - MODIFY AS NEEDED
  // ==========================================
  const config: DeploymentConfig = {
    votingTokenAddress: process.env.VOTING_TOKEN_ADDRESS || '',
    minDelay: 2 * 24 * 60 * 60, // 2 days in seconds
    proposers: [], // Will be set to [governorAddress] after deployment
    executors: [ethers.ZeroAddress], // Anyone can execute
    adminAddress: deployerAddress,
  };

  if (!config.votingTokenAddress) {
    throw new Error('VOTING_TOKEN_ADDRESS environment variable not set');
  }

  // ==========================================
  // DEPLOYMENT
  // ==========================================

  // Step 1: Deploy TimelockController
  const timelock = await deployTimelock(config);
  const timelockAddress = await timelock.getAddress();

  // Step 2: Deploy AK Governor
  const governor = await deployGovernor(
    config.votingTokenAddress,
    timelockAddress
  );
  const governorAddress = await governor.getAddress();

  // Step 3: Setup roles
  config.proposers = [governorAddress];
  await setupRoles(timelock, governorAddress, deployerAddress);

  // Step 4: Verify deployment
  await verifyDeployment(governor, timelockAddress);

  // ==========================================
  // OUTPUT
  // ==========================================
  console.log('\n========================================');
  console.log('DEPLOYMENT COMPLETE');
  console.log('========================================');
  console.log(`\nSave these addresses:\n`);
  console.log(`VOTING_TOKEN_ADDRESS=${config.votingTokenAddress}`);
  console.log(`TIMELOCK_ADDRESS=${timelockAddress}`);
  console.log(`GOVERNOR_ADDRESS=${governorAddress}`);
  console.log('\n========================================');

  return {
    votingToken: config.votingTokenAddress,
    timelock: timelockAddress,
    governor: governorAddress,
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
import {
  createWalletClient,
  createPublicClient,
  http,
  parseEther,
  getContract,
} from "viem";
import { chiliz } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import * as fs from "fs";
import * as path from "path";
import solc from "solc";

// Compile the Solidity contract
function compileContract() {
  const contractPath = path.join(__dirname, "../contracts/GameTreasury.sol");
  const contractSource = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      "GameTreasury.sol": {
        content: contractSource,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["*"],
        },
      },
    },
  };

  const compiled = JSON.parse(solc.compile(JSON.stringify(input)));

  if (compiled.errors) {
    const errors = compiled.errors.filter(
      (error: any) => error.severity === "error"
    );
    if (errors.length > 0) {
      console.error("Compilation errors:", errors);
      throw new Error("Contract compilation failed");
    }
  }

  const contract = compiled.contracts["GameTreasury.sol"]["GameTreasury"];
  return {
    bytecode: contract.evm.bytecode.object,
    abi: contract.abi,
  };
}

async function deployContract() {
  // Compile the contract
  console.log("🔨 Compiling GameTreasury contract...");
  const { bytecode, abi } = compileContract();
  console.log("✅ Contract compiled successfully");

  // Get private key from environment
  const privateKey = process.env.GAME_TREASURY_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("GAME_TREASURY_PRIVATE_KEY environment variable not set");
  }

  // Create account and clients
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const publicClient = createPublicClient({
    chain: chiliz,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: chiliz,
    transport: http(),
  });

  console.log("🚀 Deploying GameTreasury contract to Chiliz mainnet...");
  console.log("📝 Deployer address:", account.address);
  console.log("💰 Deposit amount: 1 CHZ (1000000000000000000 wei)");

  try {
    // Deploy the contract
    const hash = await walletClient.deployContract({
      abi,
      bytecode: `0x${bytecode}`,
      args: [],
    });

    console.log("⏳ Transaction hash:", hash);
    console.log("⏳ Waiting for deployment confirmation...");

    // Wait for transaction receipt using public client
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (!receipt.contractAddress) {
      throw new Error(
        "Contract deployment failed - no contract address in receipt"
      );
    }

    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract address:", receipt.contractAddress);
    console.log(
      "🔗 ChilizScan:",
      `https://chiliscan.com/address/${receipt.contractAddress}`
    );
    console.log("⛽ Gas used:", receipt.gasUsed.toString());

    // Verify the deposit amount is correct
    const contract = getContract({
      address: receipt.contractAddress,
      abi,
      client: publicClient,
    });

    const depositAmount = (await contract.read.DEPOSIT_AMOUNT([])) as bigint;
    console.log("✅ Verified deposit amount:", depositAmount.toString(), "wei");
    console.log(
      "✅ Verified deposit amount:",
      (Number(depositAmount) / 1e18).toString(),
      "CHZ"
    );

    if (depositAmount.toString() === "1000000000000000000") {
      console.log("✅ Deposit amount is correct: 1 CHZ");
    } else {
      console.log("❌ Warning: Deposit amount is not 1 CHZ");
    }

    return {
      address: receipt.contractAddress,
      transactionHash: hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      abi,
    };
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

// Run deployment if script is executed directly
if (require.main === module) {
  deployContract()
    .then((result) => {
      console.log("\n🎉 Deployment completed successfully!");
      console.log(
        "📋 Update the following files with the new contract address:"
      );
      console.log("   - lib/contracts/game-treasury.ts");
      console.log("   - server/src/contracts/game-treasury-owner.ts");
      console.log("   - src/types/game.ts (treasureWallet)");
      console.log("   - server/src/types/game.ts (treasureWallet)");
      console.log("   - server/src/models/Room.ts (treasureWallet default)");
      console.log("   - README.md (contract address)");
      console.log(`\n📍 New contract address: ${result.address}`);
      console.log("\n💡 Run the following command to update all references:");
      console.log(
        `   find . -name "*.ts" -o -name "*.tsx" -o -name "*.md" | xargs sed -i '' 's/0x8202f7875f0417593CC4a8391dA08874A1eb0EAF/${result.address}/g'`
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Deployment failed:", error);
      process.exit(1);
    });
}

export { deployContract };

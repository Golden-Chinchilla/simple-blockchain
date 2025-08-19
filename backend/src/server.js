// 创建完整的后端代码

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// 简单的区块结构
class Block {
    constructor(index, timestamp, transactions, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.index + this.previousHash + this.timestamp +
                JSON.stringify(this.transactions) + this.nonce)
            .digest('hex');
    }

    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

// 简单的交易结构
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }
}

// 区块链主类
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
        this.users = new Map(); // 简单用户存储
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), [], "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // 挖矿
    minePendingTransactions(miningRewardAddress) {
        const rewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTransaction);

        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );

        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransactions = [];
    }

    // 创建交易
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // 获取余额
    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    // 创建用户（简单版本）
    createUser(name) {
        const address = crypto.randomBytes(16).toString('hex');
        this.users.set(address, { name, address, createdAt: Date.now() });
        return { name, address };
    }

    // 获取所有用户
    getUsers() {
        return Array.from(this.users.values());
    }

    // 验证链
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

// 创建区块链实例
const blockchain = new Blockchain();

// API 路由

// 获取区块链信息
app.get('/api/blockchain', (req, res) => {
    res.json({
        chain: blockchain.chain,
        difficulty: blockchain.difficulty,
        pendingTransactions: blockchain.pendingTransactions,
        miningReward: blockchain.miningReward
    });
});

// 获取所有区块
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

// 获取当前块高度
app.get('/api/height', (req, res) => {
    res.json({ height: blockchain.chain.length - 1 });
});

// 创建用户
app.post('/api/users', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const user = blockchain.createUser(name);
    res.json(user);
});

// 获取所有用户
app.get('/api/users', (req, res) => {
    res.json(blockchain.getUsers());
});

// 获取余额
app.get('/api/balance/:address', (req, res) => {
    const balance = blockchain.getBalanceOfAddress(req.params.address);
    res.json({ address: req.params.address, balance });
});

// 创建交易
app.post('/api/transactions', (req, res) => {
    const { from, to, amount } = req.body;

    if (!from || !to || !amount) {
        return res.status(400).json({ error: 'Missing transaction data' });
    }

    // 检查余额（除了挖矿奖励）
    if (from !== null) {
        const balance = blockchain.getBalanceOfAddress(from);
        if (balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
    }

    const transaction = new Transaction(from, to, amount);
    blockchain.createTransaction(transaction);

    res.json({ message: 'Transaction added to pending transactions', transaction });
});

// 挖矿
app.post('/api/mine', (req, res) => {
    const { minerAddress } = req.body;

    if (!minerAddress) {
        return res.status(400).json({ error: 'Miner address is required' });
    }

    blockchain.minePendingTransactions(minerAddress);

    res.json({
        message: 'Block successfully mined!',
        block: blockchain.getLatestBlock(),
        minerBalance: blockchain.getBalanceOfAddress(minerAddress)
    });
});

// 获取交易历史
app.get('/api/transactions', (req, res) => {
    const allTransactions = [];
    blockchain.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            allTransactions.push({
                ...transaction,
                blockIndex: block.index,
                blockHash: block.hash
            });
        });
    });
    res.json(allTransactions);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🚀 区块链服务器运行在 http://localhost:${PORT}`);
    console.log(`📊 API端点: http://localhost:${PORT}/api`);
});
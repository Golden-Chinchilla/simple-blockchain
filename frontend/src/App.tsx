import { useState, useEffect } from 'react';
import './App.css';

interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

interface Transaction {
  fromAddress: string | null;
  toAddress: string;
  amount: number;
  timestamp: number;
  blockIndex?: number;
}

interface User {
  name: string;
  address: string;
}

const API_BASE = 'http://localhost:3001/api';

function App() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [height, setHeight] = useState(0);

  // 表单状态
  const [newUserName, setNewUserName] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [minerAddress, setMinerAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [balance, setBalance] = useState(0);

  // 获取数据
  const fetchData = async () => {
    try {
      const [blocksRes, usersRes, transactionsRes, heightRes] = await Promise.all([
        fetch(`${API_BASE}/blocks`),
        fetch(`${API_BASE}/users`),
        fetch(`${API_BASE}/transactions`),
        fetch(`${API_BASE}/height`)
      ]);

      setBlocks(await blocksRes.json());
      setUsers(await usersRes.json());
      setTransactions(await transactionsRes.json());
      const heightData = await heightRes.json();
      setHeight(heightData.height);
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 创建用户
  const createUser = async () => {
    if (!newUserName) return;

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName })
      });

      if (response.ok) {
        setNewUserName('');
        fetchData();
        alert('用户创建成功！');
      }
    } catch (error) {
      console.error('创建用户失败:', error);
    }
  };

  // 创建交易
  const createTransaction = async () => {
    if (!fromAddress || !toAddress || !amount) return;

    try {
      const response = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromAddress,
          to: toAddress,
          amount: parseFloat(amount)
        })
      });

      if (response.ok) {
        setFromAddress('');
        setToAddress('');
        setAmount('');
        fetchData();
        alert('交易创建成功！');
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('创建交易失败:', error);
    }
  };

  // 挖矿
  const mineBlock = async () => {
    if (!minerAddress) return;

    try {
      const response = await fetch(`${API_BASE}/mine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minerAddress })
      });

      if (response.ok) {
        setMinerAddress('');
        fetchData();
        alert('挖矿成功！');
      }
    } catch (error) {
      console.error('挖矿失败:', error);
    }
  };

  // 查询余额
  const checkBalance = async () => {
    if (!selectedAddress) return;

    try {
      const response = await fetch(`${API_BASE}/balance/${selectedAddress}`);
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('查询余额失败:', error);
    }
  };

  return (
    <div className="App">
      <h1>🔗 简单区块链浏览器</h1>

      {/* 区块链状态 */}
      <div className="status">
        <h2>📊 链状态</h2>
        <p>当前块高度: {height}</p>
        <p>总区块数: {blocks.length}</p>
      </div>

      {/* 创建用户 */}
      <div className="section">
        <h2>👤 创建用户</h2>
        <input
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          placeholder="用户名"
        />
        <button onClick={createUser}>创建用户</button>
      </div>

      {/* 用户列表 */}
      <div className="section">
        <h2>👥 用户列表</h2>
        {users.map(user => (
          <div key={user.address} className="user">
            <strong>{user.name}</strong>: {user.address}
          </div>
        ))}
      </div>

      {/* 查询余额 */}
      <div className="section">
        <h2>💰 查询余额</h2>
        <select
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >
          <option value="">选择地址</option>
          {users.map(user => (
            <option key={user.address} value={user.address}>
              {user.name} ({user.address.slice(0, 8)}...)
            </option>
          ))}
        </select>
        <button onClick={checkBalance}>查询余额</button>
        {selectedAddress && <p>余额: {balance}</p>}
      </div>

      {/* 创建交易 */}
      <div className="section">
        <h2>💸 创建交易</h2>
        <select
          value={fromAddress}
          onChange={(e) => setFromAddress(e.target.value)}
        >
          <option value="">发送方</option>
          {users.map(user => (
            <option key={user.address} value={user.address}>
              {user.name}
            </option>
          ))}
        </select>
        <select
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
        >
          <option value="">接收方</option>
          {users.map(user => (
            <option key={user.address} value={user.address}>
              {user.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="金额"
        />
        <button onClick={createTransaction}>发送</button>
      </div>

      {/* 挖矿 */}
      <div className="section">
        <h2>⛏️ 挖矿</h2>
        <select
          value={minerAddress}
          onChange={(e) => setMinerAddress(e.target.value)}
        >
          <option value="">选择矿工</option>
          {users.map(user => (
            <option key={user.address} value={user.address}>
              {user.name}
            </option>
          ))}
        </select>
        <button onClick={mineBlock}>开始挖矿</button>
      </div>

      {/* 区块信息 */}
      <div className="section">
        <h2>🧱 区块信息</h2>
        {blocks.slice().reverse().map(block => (
          <div key={block.hash} className="block">
            <h3>区块 #{block.index}</h3>
            <p>哈希: {block.hash}</p>
            <p>时间: {new Date(block.timestamp).toLocaleString()}</p>
            <p>交易数: {block.transactions.length}</p>
          </div>
        ))}
      </div>

      {/* 交易历史 */}
      <div className="section">
        <h2>📝 交易历史</h2>
        {transactions.slice().reverse().map((tx, index) => (
          <div key={index} className="transaction">
            <p>从: {tx.fromAddress || '系统奖励'}</p>
            <p>到: {tx.toAddress}</p>
            <p>金额: {tx.amount}</p>
            <p>时间: {new Date(tx.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
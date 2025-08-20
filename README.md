# 🔗 Simple Blockchain

一个基于 Node.js + React + TypeScript 的简单区块链实现，包含完整的区块链核心功能和Web界面。

## ✨ 功能特性

- 🪙 **代币生产** - 通过挖矿获得代币奖励
- 👤 **用户管理** - 创建和管理区块链用户账户
- 💸 **代币转账** - 安全的点对点代币转账功能
- ⛏️ **挖矿系统** - 工作量证明(PoW)共识机制
- 📊 **区块链浏览器** - 直观的Web界面查看链状态和交易

## 🎯 项目演示

### 主要功能截图说明

1. **链状态监控** - 实时显示当前块高度和总区块数
2. **用户创建** - 一键生成新用户和钱包地址
3. **余额查询** - 查看任意地址的代币余额
4. **转账交易** - 用户间的代币转移
5. **挖矿操作** - 选择矿工开始挖掘新区块
6. **区块浏览** - 查看所有区块的详细信息
7. **交易历史** - 完整的交易记录追踪

## 🏗️ 技术架构

### 后端技术栈
- **Node.js** - 服务端运行环境
- **Express.js** - Web框架和API服务
- **Crypto** - 加密哈希和数字签名
- **CORS** - 跨域资源共享

### 前端技术栈
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 现代化构建工具
- **CSS3** - 样式和布局

### 区块链核心
- **工作量证明(PoW)** - 共识算法
- **SHA-256** - 哈希算法
- **UTXO模型** - 交易输出模型
- **内存存储** - 轻量级数据持久化

## 📁 项目结构

```
simple-blockchain/
├── README.md                 # 项目说明文档
├── start.sh                  # 一键启动脚本
├── backend/                  # 后端服务
│   ├── package.json         # 后端依赖配置
│   └── src/
│       └── server.js        # 区块链核心逻辑 + API服务
└── frontend/                # 前端应用
    ├── package.json         # 前端依赖配置
    ├── vite.config.ts       # Vite构建配置
    ├── tsconfig.json        # TypeScript配置
    ├── index.html           # HTML入口文件
    └── src/
        ├── main.tsx         # React应用入口
        ├── App.tsx          # 主应用组件
        ├── App.css          # 应用样式
        └── vite-env.d.ts    # Vite类型定义
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装和启动

1. **克隆或创建项目**
   ```bash
   # 如果使用setup脚本创建
   chmod +x setup.sh
   ./setup.sh
   cd simple-blockchain
   
   # 或手动克隆
   git clone <repository-url>
   cd simple-blockchain
   ```

2. **一键启动**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

3. **访问应用**
   - 前端界面：http://localhost:5173
   - 后端API：http://localhost:3001

### 手动启动（开发模式）

如果需要分别启动前后端：

```bash
# 启动后端
cd backend
npm install
npm start

# 新开终端，启动前端
cd frontend  
npm install
npm run dev
```

## 📖 使用指南

### 1. 创建用户
1. 在"创建用户"区域输入用户名
2. 点击"创建用户"按钮
3. 系统将生成唯一的区块链地址

### 2. 挖矿获得代币
1. 在"挖矿"区域选择矿工（必须先创建用户）
2. 点击"开始挖矿"
3. 系统将创建新区块，矿工获得100代币奖励

### 3. 转账代币
1. 在"创建交易"区域选择发送方和接收方
2. 输入转账金额
3. 点击"发送"完成转账（需要挖矿确认）

### 4. 查看余额
1. 在"查询余额"区域选择用户地址
2. 点击"查询余额"查看当前余额

### 5. 浏览区块链
- "链状态"显示当前区块高度
- "区块信息"显示所有区块详情
- "交易历史"显示所有交易记录

## 🔧 API接口

### 区块链状态
```http
GET /api/blockchain      # 获取完整区块链信息
GET /api/blocks         # 获取所有区块
GET /api/height         # 获取当前块高度
```

### 用户管理
```http
POST /api/users         # 创建新用户
GET /api/users          # 获取所有用户
GET /api/balance/:address # 查询地址余额
```

### 交易操作
```http
POST /api/transactions  # 创建新交易
GET /api/transactions   # 获取交易历史
```

### 挖矿操作
```http
POST /api/mine          # 开始挖矿
```

### API请求示例

**创建用户:**
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'
```

**创建交易:**
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"from":"address1","to":"address2","amount":50}'
```

**挖矿:**
```bash
curl -X POST http://localhost:3001/api/mine \
  -H "Content-Type: application/json" \
  -d '{"minerAddress":"minerAddress"}'
```

## 🧪 核心概念

### 区块结构
```javascript
{
  index: 0,                    // 区块索引
  timestamp: 1640995200000,    // 时间戳
  transactions: [...],         // 交易列表
  previousHash: "0x...",       // 前一区块哈希
  hash: "0x...",              // 当前区块哈希
  nonce: 12345                // 工作量证明随机数
}
```

### 交易结构
```javascript
{
  fromAddress: "0x...",        // 发送方地址
  toAddress: "0x...",          // 接收方地址
  amount: 100,                 // 转账金额
  timestamp: 1640995200000     // 交易时间戳
}
```

### 工作量证明
- 难度级别：2（可在代码中调整）
- 目标：找到哈希前缀为"00"的随机数
- 奖励：每个区块100代币

## ⚙️ 配置选项

在 `backend/src/server.js` 中可以调整以下参数：

```javascript
// 区块链配置
difficulty: 2,          // 挖矿难度（前导零个数）
miningReward: 100,      // 挖矿奖励
port: 3001             // API服务端口
```

## 🔍 故障排除

### 常见问题

**1. 端口占用错误**
```bash
Error: listen EADDRINUSE :::3001
```
解决：杀死占用端口的进程或修改端口配置

**2. 前端无法连接后端**
- 确保后端服务正常启动
- 检查防火墙设置
- 验证API地址是否正确

**3. 交易失败**
- 检查发送方余额是否充足
- 确认用户地址是否有效
- 查看控制台错误信息

### 调试模式

启用详细日志：
```bash
cd backend
DEBUG=* npm start
```

## 🛠️ 开发指南

### 添加新功能

1. **后端API扩展**
   - 在 `server.js` 中添加新的路由
   - 实现对应的区块链逻辑
   - 更新API文档

2. **前端界面扩展**
   - 在 `App.tsx` 中添加新组件
   - 调用后端API接口
   - 更新用户界面

### 代码风格

- 后端：遵循Node.js最佳实践
- 前端：使用TypeScript严格模式
- 注释：关键逻辑需要中文注释

## 📝 版本历史

### v1.0.0 (当前版本)
- ✅ 基础区块链功能
- ✅ 用户管理系统
- ✅ 工作量证明挖矿
- ✅ 转账交易功能
- ✅ Web界面浏览器

## 🤝 贡献指南

欢迎贡献代码和建议！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## ⚠️ 免责声明

本项目仅用于学习和演示目的，不适用于生产环境。区块链数据存储在内存中，重启后会丢失所有数据。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 创建 Issue
- 发起 Discussion
- 邮件联系

## 🙏 致谢

感谢所有为区块链技术发展做出贡献的开发者和研究者。

---

**⭐ 如果这个项目对你有帮助，请给个星标支持一下！**
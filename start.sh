#!/bin/bash

echo "🚀 启动简单区块链..."

echo "📦 安装后端依赖..."
cd backend && npm install && cd ..

echo "📦 安装前端依赖..."  
cd frontend && npm install && cd ..

echo "🔧 启动后端..."
cd backend && npm start &
BACKEND_PID=$!

sleep 3

echo "⚛️  启动前端..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ 启动完成!"
echo "前端: http://localhost:5173"
echo "后端: http://localhost:3001"
echo "按 Ctrl+C 停止..."

trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
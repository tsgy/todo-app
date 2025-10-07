# Todo App (React + Node.js + Prisma + MySQL)

## 概要
フロントエンド（React + Vite）とバックエンド（Node.js + Express + Prisma + MySQL）で構成されたフルスタックTodoアプリです。  
学習目的で設計から構築までを通して行い、ローカル開発環境の自動起動やORMによるスキーマ管理も実装しています。

---

## 構成図
```
todo-app/
├── backend/ # Node.js + Express サーバ
│ ├── src/ # APIルート、コントローラ
│ ├── prisma/ # Prisma schema
│ ├── package.json
│ └── .env # DB接続設定
│
├── frontend/ # React + Vite フロントエンド
│ ├── src/
│ ├── package.json
│ └── .env
│
├── prisma/ # 全体スキーマ
│ └── schema.prisma
│
├── .gitignore
├── LICENSE
└── README.md
```

---
## セットアップ手順

### 1. クローン
```bash
git clone git@github.com:tsgy/todo-app.git
cd todo-app
```
### 2. 依存関係インストール
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. 環境変数設定
ルートまたは各ディレクトリに .env を作成し、MySQL接続情報を設定します。
```env
DATABASE_URL="mysql://user:password@localhost:3306/todo_app"
```

### 4. DBマイグレーション
```bash
cd backend
npx prisma migrate dev --name init
```

### 5. 開発サーバ起動
ルートに戻り：
```bash
npm run dev
```
同時にフロントエンドとバックエンドが起動します。

## 主な機能
- タスクの作成／削除／完了管理
- フロント⇄バック間のAPI通信
- Prisma ORMによるスキーマ管理
- concurrently + nodemon による同時開発環境

## スクリーンショット
以下は開発中UIの例です。
![alt text](<スクリーンショット 2025-10-07 18.31.33.png>)

## 技術
- React / Vite / Node.js / Express / Prisma / MySQL / macOS / VSCode

## ライセンス

MIT License © 2025 tsgy

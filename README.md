# Autarc - Nested Comment App with RxDB

This is a React-based comment system that allows users to **add, delete, and reply to comments** with **nested support** and **local persistence** using **RxDB**.

## 🚀 Features

- **Add Comments:** Type a comment and post it.
- **Delete Comments:** Remove unwanted comments.
- **Nested Replies:** Reply to comments to create threaded conversations.
- **Persistence:** Comments are stored locally and persist on page refresh.
- **Real-time Updates:** Comments update in real-time across multiple tabs.

## Project Structure

```
17427447 (autarc-task)/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CommentForm.tsx
│   │   ├── CommentItem.tsx
│   │   └── CommentList.tsx
│   ├── database/
│   │   └── db.ts
│   ├── hooks/
│   │   └── useComments.ts
│   ├── pages/
│   │   └── Home.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.tsx
│   ├── setupTests.ts
│   └── styles.css
├── package.json
├── README.md
└── tsconfig.json
```

## 🛠️ Setup & Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/wasssim1/17427447.git
   
   cd 17427447
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Run in development mode**

   ```bash
   yarn start
   ```

4. **Build and Run in production mode**

   ```bash
   yarn build
   
   npm i -g serve
   
   serve -s build
   ```

## 🧰 Development Setup Guide

### ✅ Prerequisites

- Git
- Python 3.9+
- Node.js (v20 preferred)
- NPM
- NVM for Windows (to manage Node versions)

## ⚙️ Step-by-Step Setup

### 🧱 1. Install NVM for Windows

1. Download `nvm-setup.exe` from the official repo:  
   👉 https://github.com/coreybutler/nvm-windows/releases
2. Install NVM using the installer.
3. Open Command Prompt and check version:
4. Install Node.js (v20)
    - nvm install 20
    - nvm use 20
    - node -v

## Client

1. Start frontend
    - cd client
    - npm install
    - npm run dev

2. Install chakra-ui
    - npm i @chakra-ui/react@2.10.9 @emotion/react @emotion/styled framer-motion
    - npx @chakra-ui/cli snippet add
    - npm install -D @rollup/plugin-alias

3. Other imports
    - npm install react-router-dom axios formik yup react-icons sweetalert2 
    or
    - react-router-dom => npminstall react-router-dom
    - axios => npm install axios
    - formik and yup => npm install formik yup
    - react-icons => npm install react-icons
    - sweet alerts => npm install sweetalert2

## Server

1. Start backend
    - cd server
    - pip install -r requirements.txt
    - uvicorn app.main:app --reload



# Stock Explore

A full-stack mobile application built with React Native (Expo) and Node.js (Express and Typescript) that provides real-time stock market data, including market indexes, gainers/losers, active stocks, company spotlights, and financial news.

## 🚀 Live Demo

- **Web App**: [https://stock-explore-web.vercel.app/](https://stock-explore-web.vercel.app/)
- **Mobile**: Use Expo Go app to test locally

## 📱 Features

- **Market Snapshot**: Real-time major market indexes (S&P 500, NASDAQ, Dow Jones)
- **Stock Lists**: Top gainers, losers, and most active stocks
- **Stock Spotlight**: Featured company with detailed information
- **Financial News**: Latest market news with article links
- **Responsive Design**: Works on web, iOS, and Android
- **Real-time Updates**: Live stock data powered by Yahoo Finance

## 🛠️ Tech Stack

### Frontend

- **React Native** with Expo Router
- **TypeScript** for type safety
- **NativeWind** (Tailwind CSS for React Native)
- **Expo** for cross-platform development

### Backend

- **Node.js** with Express
- **TypeScript**
- **Yahoo Finance API** for stock data

## 📁 Project Structure

```
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── controller/      # API controllers
│   │   ├── router/          # Express routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── frontend/                # React Native Expo app
│   ├── app/                 # Expo Router pages
│   ├── components/          # Reusable UI components
│   ├── assets/              # Images and static files
│   └── package.json
│
└── README.md
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app (for mobile testing)

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start Expo development server:

```bash
npm start
```

4. Scan QR code with Expo Go app or press `w` for web

## 📡 API Endpoints

- `GET /api/v1/indexes` - Major market indexes
- `GET /api/v1/gainers` - Top gaining stocks
- `GET /api/v1/losers` - Top losing stocks
- `GET /api/v1/active` - Most active stocks
- `GET /api/v1/spotlight` - Featured stock details
- `GET /api/v1/news` - Latest financial news

## 🔧 Scripts

### Backend

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser

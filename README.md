# 🚀 SmartApply AI - AI-Powered Career Intelligence Platform

> Your personalized career mentor powered by Google Gemini AI

[![Made with React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![Powered by Gemini AI](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-green.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Key Features](#key-features)

---

## Overview

**SmartApply AI** is a comprehensive career intelligence platform that helps users:
- Discover careers across 15+ industries
- Get personalized career roadmaps
- Optimize resumes with AI feedback
- Access curated learning resources
- Track career progress over time

**Powered by Google Gemini AI** for intelligent, personalized career guidance.

---

## ✨ Features

### Career Discovery
- **Universal Career Taxonomy**: 150+ career roles across 15 macro-domains
- **Searchable Database**: Find careers by keyword, skill, or industry
- **Domain Cards**: Detailed information for each career path

### Personalized Career Roadmaps
- **AI-Generated Paths**: Custom roadmaps based on your experience
- **Interactive Visualizations**: React Flow charts showing career progression
- **Milestone Tracking**: Track progress through your career journey
- **Alternative Paths**: Discover related career opportunities

### Resume Optimizer
- **AI Analysis**: Gemini-powered resume feedback
- **ATS Score**: Check applicant tracking system compatibility
- **Version History**: Store and compare up to 20 resume versions
- **Score Tracking**: See improvement over time (68% → 75% → 82%)
- **Download Previous Versions**: Access any past resume
- **AI-Improved Bullets**: Get better resume bullet points
- **Missing Skills Detection**: Identify skill gaps with learning resources

### Learning Resources
- **Curated Courses**: Udemy, Coursera, YouTube, Google, freeCodeCamp
- **Career-Specific**: Resources matched to your exact role
- **Experience-Based**: Content for beginner, intermediate, advanced levels
- **Progress Tracking**: Mark resources as completed, synced to database

### Progress Dashboard
- **Personalized Greeting**: AI-generated insights and next steps
- **Career Roadmap Progress**: Visual progress tracking
- **Similar Jobs**: Relevant job recommendations with LinkedIn search
- **Resource Recommendations**: Top learning materials for your path

---
screenshots

<h3>Home Page</h3>
<img src="screenshots/Screenshot 2025-12-26 160700.png" />


<h3>Why Choose SmartApply AI</h3>
<img src="https://raw.githubusercontent.com/supriya0415/SMARTAPPLY-AI/main/screenshots/Screenshot%202025-12-26 160728.png" />

<h3>Career Discovery Dashboard</h3>
<img src="https://raw.githubusercontent.com/supriya0415/SMARTAPPLY-AI/main/screenshots/Screenshot%202025-12-26 161204.png" />

<h3>Learning Resources Page</h3>
<img src="https://raw.githubusercontent.com/supriya0415/SMARTAPPLY-AI/main/screenshots/Screenshot%202025-12-26 161232.png" />

<h3>Resume Upload Page</h3>
<img src="https://raw.githubusercontent.com/supriya0415/SMARTAPPLY-AI/main/screenshots/Screenshot%202025-12-26 161327.png" />

<h3>Resume Analysis Loading</h3>
<img src="https://raw.githubusercontent.com/supriya0415/SMARTAPPLY-AI/main/screenshots/Screenshot%202025-12-26 161338.png" />

<h3>Resume Score & ATS Analysis</h3>
<img src="https://raw.githubusercontent.com/supriya0415/SMARTAPPLY-AI/main/screenshots/Screenshot%202025-12-26 161512.png" />


## Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **React Flow** - Interactive diagrams
- **Tailwind CSS** - Styling
- **Shadcn/ui** - Component library
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### AI & APIs
- **Google Gemini 1.5 Flash** - AI analysis
- **@google/generative-ai** - Gemini SDK

### Additional Tools
- **jsPDF** - PDF generation
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB** (local or Atlas)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/supriya0415/smartapply-ai.git
cd smartapply-ai
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. **Set up environment variables**

Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:4000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Create `.env` in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/smartapply-ai
JWT_SECRET=your_super_secret_jwt_key_here
PORT=4000
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Run the application**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

6. **Open in browser**
```
http://localhost:5173
```

---

## 🔑 Environment Setup

### Get Your Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new project or select existing
4. Copy your API key
5. Add to `.env` file:
```env
VITE_GEMINI_API_KEY=AIzaSy...your_key_here
```

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB (macOS)
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/smartapply-ai
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to backend `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartapply-ai
```

---

## 📁 Project Structure

```
smartapply-ai/
├── backend/                    # Backend server
│   ├── models/                 # MongoDB schemas
│   │   └── User.js            # User model with enhanced profile
│   ├── middleware/            # Auth middleware
│   ├── server.js              # Express server
│   └── package.json
│
├── src/                       # Frontend source
│   ├── components/           # React components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── resume/           # Resume optimizer components
│   │   ├── NBButton.tsx      # Custom button
│   │   ├── NBCard.tsx        # Custom card
│   │   └── ...
│   │
│   ├── pages/                # Page components
│   │   ├── Landing.tsx       # Landing page
│   │   ├── SignIn.tsx        # Sign in
│   │   ├── SignUp.tsx        # Sign up
│   │   ├── CareerAssessment.tsx  # Career selection
│   │   ├── Details.tsx       # Assessment form
│   │   ├── Results.tsx       # Career roadmap results
│   │   ├── Dashboard.tsx     # User dashboard
│   │   ├── LearningResourcesPage.tsx  # Learning resources
│   │   ├── ResumeUpload.tsx  # Resume upload
│   │   └── ResumeAnalysisResults.tsx  # Resume analysis
│   │
│   ├── lib/                  # Utilities and services
│   │   ├── services/         # API services
│   │   │   ├── geminiService.ts  # Gemini AI integration
│   │   │   ├── enhancedResumeService.ts  # Resume analysis
│   │   │   ├── realLearningResourcesService.ts  # Learning resources
│   │   │   └── ...
│   │   ├── stores/           # Zustand stores
│   │   │   └── userStore.ts  # User state management
│   │   ├── data/             # Static data
│   │   │   └── universalCareerTaxonomy.ts  # Career data
│   │   ├── types.ts          # TypeScript types
│   │   ├── config.ts         # App configuration
│   │   └── utils/            # Utility functions
│   │
│   ├── router/               # React Router setup
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
│
├── public/                   # Static assets
├── .env                      # Frontend environment variables
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

---

## 🎨 Key Features

### 1. Career Discovery System

**Universal Career Taxonomy:**
- 15 macro-domains (Technology, Healthcare, Creative Arts, etc.)
- 50+ sub-domains
- 150+ specific career roles
- Searchable by keyword

**Example:**
```typescript
// Search for "data"
Results:
- Data Scientist (Technology → Data & Analytics)
- Data Engineer (Technology → Data & Analytics)
- Data Analyst (Business → Analytics)
```

---

### 2. AI-Powered Career Roadmaps

**Personalized by:**
- Career interest (e.g., "Software Engineer")
- Years of experience (0-1, 1-3, 3-5, 5-10, 10+)
- Current skills
- Education level

**Generates:**
- Step-by-step milestones
- Skill requirements
- Learning resources
- Timeline estimates
- Alternative career paths

**Example Roadmap:**
```
Software Engineer (2 years experience)
├─ Master DSA (3 months)
├─ System Design (2 months)
├─ Advanced React (2 months)
├─ Build Portfolio (1 month)
└─ Interview Prep (1 month)
```

---

### 3. Resume Optimizer

**AI Analysis:**
- Overall score (0-100%)
- ATS compatibility
- Strengths & weaknesses
- Missing skills
- Next-level advice
- Job matching

**Version History:**
- Stores up to 20 versions
- Shows score progression
- Download any past version
- Compare improvements

**Example:**
```
Version #3: 82% ↑ 7%  [Download]
Version #2: 75% ↑ 7%  [Download]
Version #1: 68%       [Download]
```

---

### 4. Learning Resources

**Platform Coverage:**
- Udemy (paid courses)
- Coursera (university courses)
- YouTube (free videos)
- Google Career Certificates
- freeCodeCamp (coding)

**Smart Matching:**
- Career-specific resources
- Experience-level filtering
- Skill gap resources
- Progress tracking

**Example:**
```
For "Software Engineer":
├─ DSA: LeetCode, NeetCode, Blind 75
├─ System Design: ByteByteGo, Alex Xu
├─ React: Udemy React - The Complete Guide
└─ Projects: 100 Days of Code
```

---

## Security

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Environment Variables**: Sensitive data in .env
- **Input Validation**: Zod schemas
- **Protected Routes**: Auth middleware on backend
- **HTTPS**: SSL/TLS in production

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- **Google Gemini AI** - For powerful AI capabilities
- **React Community** - For amazing libraries
- **MongoDB** - For flexible database
- **Jake Gutierrez** - For resume template inspiration



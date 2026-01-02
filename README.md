# Wispr Flow clone – Voice-to-Text Desktop App  
*(Tauri + Deepgram)*

A cross-platform desktop application that provides **real-time voice-to-text transcription** using modern web technologies and AI speech recognition.  
This project is built as a functional clone of *Wispr Flow*.

---

## 📌 Project Overview

The application allows users to:
- Press a **Push-to-Talk** button
- Speak continuously into the microphone
- Receive **live transcription** with low latency
- Copy or reset the transcribed text easily

The goal of this project is to demonstrate:
- Integration of **real-time AI services**
- Clean separation of concerns
- Practical desktop application development using **Tauri**

---

## 🧰 Tech Stack

- **Frontend:** React (JavaScript) + Vite  
- **Desktop Framework:** Tauri (v2)  
- **Speech-to-Text:** Deepgram Real-Time WebSocket API  
- **Audio Capture:** Web MediaRecorder API  
- **Language:** JavaScript (no TypeScript)

---

## ✨ Core Features

- 🎙 Push-to-Talk voice input  
- 🔊 Microphone permission handling  
- ⚡ Real-time speech-to-text transcription  
- 📝 Interim and final transcript handling  
- 📋 Copy transcript to clipboard  
- 🧹 Reset transcript area  
- 🖥 Cross-platform desktop support (Windows / macOS / Linux)

---

## 🏗 Architecture & Design Decisions

### 1️⃣ Separation of Concerns

The application is structured into **clear logical layers**:

#### UI (React Components)

├── Controls (Push-to-Talk, Reset, Copy)

├── Transcript Display 

└── Status Indicator

#### Audio Layer
└── Microphone access using MediaRecorder

#### Transcription Layer

└── Deepgram WebSocket client

#### Desktop Layer
└── Tauri (native shell & security)


Each layer has a **single responsibility**, making the code easy to read, debug, and extend.

---

### 2️⃣ Audio Capture Strategy

- Initially explored low-level PCM streaming
- Switched to **MediaRecorder API** for:
  - Stability
  - Better browser + Tauri compatibility
  - Simpler chunked audio streaming

Audio is captured in small chunks and streamed continuously to Deepgram.

---

### 3️⃣ Real-Time Transcription Handling

Deepgram sends:
- **Interim transcripts** (partial, changing)
- **Final transcripts** (confirmed text)

Design decision:
- Interim text updates live in the UI
- Final text is appended permanently
- Prevents duplicated words and UI freezing

This mirrors how real voice-dictation products behave.

---

### 4️⃣ Authentication Choice

- Deepgram API key is passed using **WebSocket sub-protocol authentication**
- This is the most reliable method supported in browser-based environments

> For production systems, API keys should be proxied through a backend.  
> For this assignment, frontend usage is acceptable and documented.

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/venkateshur14/wispr-flow.git
cd wispr-flow
```

### 2️⃣ Install Dependencies
```
npm install
```

3️⃣ Add Deepgram API Key
```
Open:
src/services/deepgram.js

Replace:
const DEEPGRAM_API_KEY = "PASTE_YOUR_REAL_DEEPGRAM_KEY_HERE";

with your actual Deepgram API key.
```

4️⃣ Run the Application (Development Mode)
```
npm run tauri dev
```

This will:

Start the Vite frontend

Launch the Tauri desktop window

## 🧪 How to Use

> Click Push to Talk

> Allow microphone access

> Speak naturally

> Watch text appear in real time

> Click Copy to copy transcript

> Click Reset to clear text

---
## ⚠️ Known Limitations

- API key is exposed in frontend (acceptable for prototype)

- English language model only

- No background recording

- No speaker diarization

- No offline transcription

- UI intentionally minimal (functionality prioritized)
---

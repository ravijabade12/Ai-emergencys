# 🚨 AI Emergency Copilot

> **Describe the emergency. We handle the rest.**

AI Emergency Copilot is an AI-powered emergency response web app that converts messy, panicked, real-world input — voice or text — into structured, life-saving actions in under 5 seconds.

Built for **PromptWars Hackathon** — Google for Developers × H2S × Build with AI.

---

## 🎯 Problem

When someone is in an emergency — a road accident, a heart attack, a fire — they are panicked. They waste precious seconds Googling first aid, searching for hospital numbers, and figuring out who to call. Every second lost can cost a life.

**AI Emergency Copilot eliminates all of that.**

---

## ✨ Features

### 🧠 AI Triage Analysis
Describe the emergency in your own words — messy, panicked, ungrammatical. The AI understands it and instantly classifies:
- Situation type (Accident, Medical, Fire, etc.)
- Severity level (LOW / MEDIUM / HIGH / CRITICAL)
- Detected issues (bleeding, unconscious, fracture, etc.)
- Confidence score

### 📋 Step-by-Step First Aid
Numbered, plain-language first aid instructions generated specifically for your detected emergency. Not generic advice — exactly what to do, right now, in order.

### 📞 One-Tap Emergency Call
A single tap calls **108 (Ambulance)** or **101 (Fire Brigade)** instantly. No searching, no dialing.

### 💬 WhatsApp Emergency Share
Auto-generates a ready-to-send emergency message. One tap opens WhatsApp with the full situation summary pre-written — send it to family or friends instantly.

### 🩸 Blood Request Feature
Automatically activates when the AI detects heavy bleeding or trauma. Generates a complete blood request message including:
- Patient blood group (with AI suggestion of O+/O- as universal fallback)
- Hospital name and location (auto-filled from geolocation)
- Google Maps link
- Contact details
One tap sends it to your WhatsApp contacts or blood donor groups.

### 🏥 Nearest Hospitals
Uses live browser geolocation to find the 3 closest hospitals. Shows name, distance, open/closed status, and a one-tap Google Maps navigation link.

---

## 🚀 Demo Flow

1. Open the app
2. Type or speak: *"Bike accident, person is bleeding heavily and unconscious"*
3. Tap **Analyze Emergency**
4. App shows:
   - **CRITICAL** — Road Accident
   - 4 immediate first-aid steps
   - Call 108 button
   - Blood request card (O+ pre-selected, nearest hospital auto-filled)
5. Add contact number → tap **Share Blood Request on WhatsApp**
6. Full emergency message sent in one tap

**Total time: under 5 seconds.**

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| AI | Gemini 2.0 Flash API |
| Voice Input | Web Speech API (react-speech-recognition) |
| Location | Browser Geolocation API |
| Hospitals | Google Maps Places API |
| Sharing | WhatsApp deep link (wa.me) |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- Gemini API key — [Get it here](https://aistudio.google.com)
- Google Maps API key with Places API enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/emergency-copilot.git
cd emergency-copilot

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_key_here
```

### Run the app

```bash
npm start
```

App runs on `http://localhost:3000`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── InputPanel.jsx         # Voice + text input
│   ├── SeverityCard.jsx       # Situation + severity badge
│   ├── StepsCard.jsx          # First-aid steps checklist
│   ├── ActionButtons.jsx      # Call + WhatsApp share
│   ├── BloodRequestCard.jsx   # Blood group form + WhatsApp
│   └── NearbyHospitals.jsx    # Geolocation + hospitals list
├── pages/
│   ├── Home.jsx               # Landing + input screen
│   └── Results.jsx            # Results screen
├── hooks/
│   └── useGeolocation.js      # Browser geolocation hook
├── utils/
│   ├── gemini.js              # Gemini API call
│   └── whatsapp.js            # WhatsApp message generators
├── App.jsx
└── index.js
```

---

## 🔐 Security Note

The Gemini API key is called directly from the browser — this is intentional for the hackathon demo. Do not push your `.env` file to GitHub. Add it to `.gitignore`.

---

## 🌍 Built For India

- Emergency number **108** (Ambulance) pre-configured
- Emergency number **101** (Fire Brigade) pre-configured
- Designed for Indian hospital density and urban geography
- Blood donor WhatsApp groups are widely used across India — this feature is built for that exact behavior

---

## 🏆 Hackathon

Built for **PromptWars** — an in-person hackathon by Google for Developers, H2S, and Build with AI.

**Challenge:** Build a Gemini-powered app that solves for societal benefit by acting as a universal bridge between human intent and complex systems.

**Our solution:** Convert chaos → clarity → action. In emergencies.

---

## 📄 Disclaimer

AI Emergency Copilot provides AI-generated guidance. Always call professional emergency services in a real emergency. This app is a decision support tool, not a replacement for trained medical or emergency professionals.

---

## 👤 Author

Built with ❤️ at PromptWars Hackathon, Bengaluru.
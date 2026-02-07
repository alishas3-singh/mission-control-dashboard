# Mission Control - Emergency Medical Logistics Dashboard

A high-fidelity command center for emergency medical routing with real-time weather, traffic integration, and interpretable AI decision support.

![Mission Control Dashboard](./.github/preview.png)

## Features

### 🗺️ Live Dispatch
- Interactive map powered by React-Leaflet with dark CartoDB tiles
- Real-time weather integration via Open-Meteo API
- Live traffic data from TomTom Routing API
- **AI Advisor**: Natural language route explanations powered by OpenAI GPT
- Life-Cost Index calculation: `LC = (Time × Weather) + Severity`
- Hero-sized map (80% viewport) with floating Active Cargo card

### 🧠 Clinical Audit
- **SHAP Waterfall Plot**: Visual explanation of feature importance
  - Blue bars for time-saving features (High Severity, Short Distance)
  - Red bars for delay factors (Traffic, Weather)
- **Decision Tree Visualization**: Rule-based routing logic paths
- Interpretable AI panel for model transparency

### ⚙️ Settings
- API key configuration interface
- TomTom API key management
- Environment variable setup guides
- Test connection functionality

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Mapping**: React-Leaflet + Leaflet
- **Icons**: Lucide React
- **AI**: OpenAI GPT-3.5-turbo
- **APIs**: Open-Meteo (weather), TomTom (traffic), OpenAI (route explanations)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- TomTom API key ([Get one here](https://developer.tomtom.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mission-control-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_TOMTOM_KEY=your_tomtom_api_key_here
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

   > **Getting API Keys:**
   > 
   > **TomTom API Key (for traffic data):**
   > 1. Visit [TomTom Developer Portal](https://developer.tomtom.com/)
   > 2. Sign up for a free account
   > 3. Create a new API key in the dashboard
   > 4. Copy the key to your `.env.local` file
   >
   > **OpenAI API Key (for AI route explanations):**
   > 1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   > 2. Sign up or log in
   > 3. Create a new API key
   > 4. Copy the key to your `.env.local` file
   > 
   > Note: The AI Advisor will use fallback explanations if no OpenAI key is configured.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
mission-control-dashboard/
├── src/
│   ├── app/
│   │   ├── dispatch/         # Live map and weather/traffic page
│   │   ├── audit/            # Clinical AI explanation page
│   │   ├── settings/         # API configuration page
│   │   ├── layout.tsx        # Root layout with Navbar
│   │   └── page.tsx          # Homepage
│   ├── components/
│   │   ├── Navbar.tsx        # Navigation with search bar
│   │   ├── MapView.tsx       # Interactive map component
│   │   ├── LifeCostCard.tsx  # Life-Cost Index display
│   │   ├── ShapPlot.tsx      # SHAP waterfall visualization
│   │   └── DecisionTree.tsx  # Decision tree visualization
│   └── lib/
│       └── api.ts            # Weather and traffic API utilities
├── .env.local                # Environment variables (create this)
└── README.md
```

## API Integration

### Open-Meteo (Weather)
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Auth**: No API key required (free tier)
- **Location**: Seattle, WA (47.6062, -122.3321)
- **Data**: Temperature, weather code, impact factor

### TomTom (Traffic)
- **Endpoint**: `https://api.tomtom.com/traffic/services/4/flowSegmentData`
- **Auth**: API key required (`NEXT_PUBLIC_TOMTOM_KEY`)
- **Data**: Current speed, free flow speed, congestion level

## Deployment to Vercel

### Step 1: Connect Repository
1. Push your code to GitHub
2. Visit [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" and import your repository

### Step 2: Configure Environment Variables
1. In your Vercel project settings, go to **Environment Variables**
2. Add the following variable:
   - **Key**: `NEXT_PUBLIC_TOMTOM_KEY`
   - **Value**: `your_tomtom_api_key`
   - **Environments**: Production, Preview, Development

### Step 3: Deploy
1. Click "Deploy"
2. Vercel will automatically build and deploy your application
3. Your dashboard will be live at `https://your-project.vercel.app`

### Redeploy After Configuration
If you add environment variables after the initial deployment, you must redeploy:
1. Go to Deployments tab
2. Click ⋯ on the latest deployment
3. Select "Redeploy"

## Life-Cost Index Formula

The dashboard calculates emergency routing priority using:

```
LC = (Time × Weather) + Severity
```

Where:
- **Time**: Estimated travel time (minutes)
- **Weather**: Impact factor (0-1 scale, 0 = clear, 1 = severe)
- **Severity**: Medical severity score (0-10 scale)

**Higher LC values** indicate higher priority missions requiring faster response.

## Theme

The dashboard uses a dark "Aerospace" Command Center theme:
- **Background**: `#0a0a0a`
- **Primary Accent**: `#00f5ff` (Cyan)
- **Alert Color**: `#ff3131` (Emergency Red)

## Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## Features Roadmap

- [ ] WebSocket integration for real-time updates
- [ ] Historical mission data analytics
- [ ] Multi-hospital routing optimization
- [ ] Mobile responsive enhancements
- [ ] Offline mode support

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with Next.js, Tailwind CSS, and React-Leaflet** | Powered by Open-Meteo & TomTom APIs

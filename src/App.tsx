import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIAssistantBubble } from './components/AIAssistantBubble';

// Pages
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { Profile } from './pages/Profile';
import { DestinationExplorer } from './pages/DestinationExplorer';
import { TravelPlanner } from './pages/TravelPlanner';
import { BudgetCalculator } from './pages/BudgetCalculator';
import { TravelAssistant } from './pages/TravelAssistant';
import { PhotoEditor } from './pages/PhotoEditor';
import { VideoEditor } from './pages/VideoEditor';
import { Community } from './pages/Community';
import { Dashboard } from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Global Sticky Navigation */}
            <Navbar />

            {/* Main Page Content */}
            <main className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/explore" element={<DestinationExplorer />} />
                <Route path="/planner" element={<TravelPlanner />} />
                <Route path="/budget" element={<BudgetCalculator />} />
                <Route path="/assistant" element={<TravelAssistant />} />
                <Route path="/photo-editor" element={<PhotoEditor />} />
                <Route path="/video-editor" element={<VideoEditor />} />
                <Route path="/community" element={<Community />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Fallback redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Persistent AI Chat Co-Pilot bubble */}
            <AIAssistantBubble />

            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

// src/App.tsx

import { Toaster } from "./components/ui/toaster";
import { AppRoutes } from "./routes";

function App() {
  return (
    <div className="min-h-screen bg-pink-50 px-4 py-2">
      <AppRoutes />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;

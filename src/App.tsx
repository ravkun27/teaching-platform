import { useEffect, useState, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import { ThemeProvider } from "./context/ThemeContext";
import router from "./routes/Router";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Suspense fallback={<LoadingScreen />}>
          <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

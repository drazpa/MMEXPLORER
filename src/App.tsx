import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Header } from './components/Header';
import { AppRoutes } from './routes';

const paypalOptions = {
  "client-id": "test",
  currency: "USD",
  intent: "capture"
};

export const App = () => {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <AppRoutes />
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </PayPalScriptProvider>
  );
};
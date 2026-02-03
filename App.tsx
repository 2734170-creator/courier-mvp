import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import Layout from '@/components/Layout';
import ProfileScreen from '@/screens/ProfileScreen';
import DeliveryScreen from '@/screens/DeliveryScreen';
import OrderDetailsScreen from '@/screens/OrderDetailsScreen';
import CancelOrderScreen from '@/screens/CancelOrderScreen';
import SupportScreen from '@/screens/SupportScreen';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/deliveries" element={<DeliveryScreen />} />
            <Route path="/order/:id" element={<OrderDetailsScreen />} />
            <Route path="/order/:id/cancel" element={<CancelOrderScreen />} />
            <Route path="/support" element={<SupportScreen />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;

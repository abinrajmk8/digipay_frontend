import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import PaymentWizardPage from './pages/payments/PaymentWizardPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import PaymentStatusPage from './pages/payments/PaymentStatusPage';
import TransactionsPage from './pages/TransactionsPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><LandingPage /></Layout>} />
                <Route path="/auth/login" element={<LoginPage />} />
                {/* Add other auth routes */}

                <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
                <Route path="/payments" element={<Layout><PaymentsPage /></Layout>} />
                <Route path="/payments/new" element={<Layout><PaymentWizardPage /></Layout>} />
                <Route path="/payments/status/:id" element={<Layout><PaymentStatusPage /></Layout>} />
                <Route path="/transactions" element={<Layout><TransactionsPage /></Layout>} />
                <Route path="/complaints" element={<Layout><ComplaintsPage /></Layout>} />
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    )
}

export default App

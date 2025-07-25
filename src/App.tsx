import { AuthProvider, useAuth } from './contexts/auth';
import { Layout } from './components/layout';
import { Login } from './pages/login';
import { Chat } from './pages/chat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function AppContent() {
  const { username } = useAuth();

  return <Layout>{!username ? <Login /> : <Chat />}</Layout>;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}

export default App;

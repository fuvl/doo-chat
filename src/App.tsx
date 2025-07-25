import { AuthProvider, useAuth } from './contexts/auth';
import { Layout } from './components/layout';
import { Login } from './pages/login';
import { Chat } from './pages/chat';
import "./App.css";

function AppContent() {
  const { username } = useAuth();

  return (
    <Layout>
      {!username ? (
        <Login />
      ) : (
        <Chat />
      )}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

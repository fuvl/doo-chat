import { AuthProvider, useAuth } from './contexts/auth';
import { Layout } from './components/layout';
import { Login } from './pages/login';
import "./App.css";

function AppContent() {
  const { username } = useAuth();

  return (
    <Layout>
      {!username ? (
        <Login />
      ) : (
        <div className="app">
          <h1>Welcome, {username}!</h1>
        </div>
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

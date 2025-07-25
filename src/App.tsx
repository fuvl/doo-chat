import { useState } from 'react';
import { Layout } from './components/layout';
import "./App.css";

function App() {
  const [username, setUsername] = useState<string | null>(null);

  return (
    <Layout>
      <div className="app">
        <h1>Doodle Chat</h1>
      </div>
    </Layout>
  );
}

export default App;

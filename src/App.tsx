import { useState } from 'react';
import AuthPage from './components/AuthPage';
import HomePage from './components/HomePage';
import ChatWidget from './components/ChatWidget'; // Importar el ChatWidget
import './index.css';

// This is a simplified user type. In a real app, you might not want to pass the whole user object around.
type User = {
  nombre: string;
  email: string;
  carrera: string; // Añadido el campo carrera
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLoginSuccess = (loggedInUser: User) => { // Ahora espera el objeto User completo
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {user ? (
        <>
          <HomePage user={user} onLogout={handleLogout} />
          <ChatWidget user={user} /> {/* Renderizar el ChatWidget cuando el usuario está logueado y pasar la prop user */}
        </>
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;

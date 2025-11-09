import { useState, useRef, useEffect } from 'react';
import CoursesSection from './CoursesSection';
import ChatWidget from './ChatWidget'; // Importar ChatWidget
import './HomePage.css';

interface HomePageProps {
  user: {
    nombre: string;
    email: string;
    carrera: string;
  };
  onLogout: () => void;
}

export default function HomePage({ user, onLogout }: HomePageProps) {
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [profileImage, setProfileImage] = useState('https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'); // Default Pexels image
  const profileCardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close profile card when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileCardRef.current && !profileCardRef.current.contains(event.target as Node)) {
        setShowProfileCard(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileCardRef]);

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <img src="/assets/logo.png" alt="Crece +Perú Logo" className="homepage-logo" />
        <nav className="homepage-nav">
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#cursos">Cursos</a></li>
            <li><a href="#mi-progreso" className="nav-link-progress">Mi Progreso</a></li> {/* Nuevo enlace */}
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>
        <div className="user-actions">
          <div className="user-info-trigger" onClick={() => setShowProfileCard(!showProfileCard)}>
            <span>Hola, {user.nombre.split(' ')[0]}</span>
            {showProfileCard && (
              <div className="profile-card" ref={profileCardRef}>
                <div className="profile-card-header">
                  <div className="profile-card-image-container" onClick={handleProfileImageClick}>
                    <img src={profileImage} alt="Profile" className="profile-card-image" />
                    <div className="profile-image-overlay">
                      <span>Subir</span>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <h3>{user.nombre}</h3>
                </div>
                <div className="profile-card-details">
                  <p><strong>Nombre completo:</strong> {user.nombre}</p> {/* Nuevo campo */}
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Carrera:</strong> {user.carrera}</p>
                </div>
              </div>
            )}
          </div>
          <button onClick={onLogout} className="logout-button">
            Cerrar Sesión
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="logout-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>
      <main className="homepage-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Desbloquea tu Potencial con Crece +Perú</h1>
            <p>Accede a cursos de certificación de alta calidad y transforma tu futuro profesional.</p>
            <button className="hero-cta-button">Explorar Cursos</button>
          </div>
        </section>
        <CoursesSection /> {/* Integrar la nueva sección de cursos */}
      </main>
      <ChatWidget user={user} /> {/* Pasar el objeto user al ChatWidget */}
    </div>
  );
}

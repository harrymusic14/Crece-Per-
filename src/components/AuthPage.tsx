// ...existing code...
import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import './AuthPage.css';

interface FormData {
  nombre?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  carrera?: string;
}

interface FormErrors {
  nombre?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  carrera?: string;
}

interface AuthPageProps {
  onLoginSuccess: (user: { nombre: string; email: string; carrera: string }) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    carrera: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isVisible, setIsVisible] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false);
  const [showOtherCareerInput, setShowOtherCareerInput] = useState(false);

  const images = [
    '/assets/transicion1.jpg',
    '/assets/transicion2.jpg',
    '/assets/transicion3.jpg',
    '/assets/transicion4.jpg'
  ];

  const peruvianCareers = [
    'Selecciona tu carrera',
    'Administración de Empresas',
    'Administración Hotelera',
    'Antropología',
    'Arqueología',
    'Arquitectura',
    'Arte (Pintura, Escultura)',
    'Biología',
    'Ciencia Política',
    'Ciencias de la Comunicación',
    'Comercio Exterior',
    'Contabilidad',
    'Danza',
    'Derecho',
    'Diseño de Interiores',
    'Diseño Gráfico',
    'Diseño Industrial',
    'Economía',
    'Educación',
    'Enfermería',
    'Estadística',
    'Farmacia y Bioquímica',
    'Filosofía',
    'Física',
    'Fisioterapia y Rehabilitación',
    'Gastronomía',
    'Historia',
    'Ingeniería Agrónoma',
    'Ingeniería Ambiental',
    'Ingeniería Civil',
    'Ingeniería de Minas',
    'Ingeniería de Sistemas',
    'Ingeniería Electrónica',
    'Ingeniería Forestal',
    'Ingeniería Geológica',
    'Ingeniería Industrial',
    'Ingeniería Mecatrónica',
    'Ingeniería Pesquera',
    'Ingeniería Química',
    'Lingüística',
    'Literatura',
    'Marketing',
    'Matemáticas',
    'Medicina Humana',
    'Medicina Veterinaria',
    'Música',
    'Negocios Internacionales',
    'Nutrición',
    'Obstetricia',
    'Odontología',
    'Psicología',
    'Química',
    'Relaciones Internacionales',
    'Sociología',
    'Tecnología Médica',
    'Teatro',
    'Trabajo Social',
    'Turismo y Hotelería',
    'Otro...'
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!isLogin && !formData.nombre?.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
      
      if (!formData.carrera?.trim() || formData.carrera === 'Selecciona tu carrera') {
        newErrors.carrera = 'La carrera es requerida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (validateForm()) {
      setIsLoading(true);
      if (isLogin) {
        try {
          const response = await fetch(`http://localhost:3001/users?email=${formData.email}&password=${formData.password}`);
          if (!response.ok) {
            throw new Error('Error en el servidor. Inténtalo de nuevo.');
          }
          const users = await response.json();
          if (users.length > 0) {
            onLoginSuccess({ nombre: users[0].nombre, email: users[0].email, carrera: users[0].carrera });
          } else {
            setApiError('Email o contraseña incorrectos.');
          }
        } catch (error) {
          setApiError('No se pudo conectar con el servidor. Verifica que esté corriendo.');
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          const checkUserResponse = await fetch(`http://localhost:3001/users?email=${formData.email}`);
          const existingUsers = await checkUserResponse.json();

          if (existingUsers.length > 0) {
            setApiError('Este correo electrónico ya está registrado.');
            setIsLoading(false);
            return;
          }

          const newUser = {
            nombre: formData.nombre,
            email: formData.email,
            password: formData.password,
            carrera: formData.carrera,
          };

          const createUserResponse = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
          });

          if (!createUserResponse.ok) {
            throw new Error('No se pudo crear el usuario.');
          }

          setShowRegistrationSuccess(true);
          setTimeout(() => {
            setShowRegistrationSuccess(false);
            setIsLogin(true);
            setFormData({ nombre: '', email: '', password: '', confirmPassword: '', carrera: '' });
            setErrors({});
            setShowOtherCareerInput(false);
          }, 3500);

        } catch (error) {
          setApiError('Ocurrió un error durante el registro.');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'carrera') {
      if (value === 'Otro...') {
        setShowOtherCareerInput(true);
        setFormData(prev => ({ ...prev, [name]: '' }));
      } else {
        setShowOtherCareerInput(false);
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'otherCareerInput') {
      setFormData(prev => ({ ...prev, carrera: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'otherCareerInput' && errors.carrera) {
      setErrors(prev => ({ ...prev, carrera: '' }));
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ nombre: '', email: '', password: '', confirmPassword: '', carrera: '' });
    setErrors({});
    setApiError(null);
    setShowRegistrationSuccess(false);
    setShowOtherCareerInput(false);
  };

  return (
    <div className={`auth-container ${isVisible ? 'visible' : ''}`}>
      {showRegistrationSuccess && (
        <div className="registration-success-message">
          Registro exitoso
        </div>
      )}
      <div className="auth-card">
        <div className="logo-container">
          <img src="/assets/logo.png" alt="Crece +Perú Logo" className="logo" />
        </div>

        <h2 className="auth-title">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Bienvenido de nuevo' : 'Únete a Crece +Perú'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre completo"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={errors.nombre ? 'error' : ''}
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>
              <div className="form-group">
                <select
                  name="carrera"
                  value={showOtherCareerInput ? 'Otro...' : formData.carrera}
                  onChange={handleInputChange}
                  className={errors.carrera ? 'error' : ''}
                >
                  {peruvianCareers.map((career) => (
                    <option
                      key={career}
                      value={career}
                      disabled={career === 'Selecciona tu carrera'}
                      hidden={career === 'Selecciona tu carrera'}
                    >
                      {career}
                    </option>
                  ))}
                </select>
                {errors.carrera && !showOtherCareerInput && <span className="error-message">{errors.carrera}</span>}
              </div>
              {showOtherCareerInput && (
                <div className="form-group other-career-input">
                  <input
                    type="text"
                    name="otherCareerInput"
                    placeholder="Escribe tu carrera"
                    value={formData.carrera}
                    onChange={handleInputChange}
                    className={errors.carrera ? 'error' : ''}
                  />
                  {errors.carrera && <span className="error-message">{errors.carrera}</span>}
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
          )}
          
          {apiError && <p className="error-message api-error">{apiError}</p>}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <button onClick={toggleForm} className="toggle-button">
              {isLogin ? 'Regístrate' : 'Inicia Sesión'}
            </button>
          </p>
        </div>
      </div>

      <div className="carousel-container">
        {images.map((image) => (
          <div
            key={image}
            className={`carousel-image ${images.indexOf(image) === currentImage ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
    </div>
  );
}
// ...existing code...
import './CoursesSection.css';
import { courses } from '../data/courses';


export default function CoursesSection() {
  const handleCourseClick = (courseId: string) => {
    alert(`Has seleccionado el curso: ${courseId}`);
    // Aquí podrías redirigir a una página de detalles del curso
  };

  return (
    <section className="courses-section">
      <h2 className="courses-title">Nuestros Cursos para Certificación</h2>
      <p className="courses-subtitle">Impulsa tu carrera con programas diseñados para el éxito.</p>
      <div className="courses-grid">
        {courses.map((course) => (
          <div
            key={course.id}
            className={`course-card ${course.status === 'coming_soon' ? 'coming-soon' : ''}`}
            onClick={course.status === 'available' ? () => handleCourseClick(course.id) : undefined}
          >
            <div className="course-image-wrapper">
              <img src={course.imageUrl} alt={course.title} className="course-image" />
              {course.status === 'coming_soon' && (
                <span className="coming-soon-badge">Próximamente</span>
              )}
            </div>
            <div className="course-content">
              <h3 className="course-card-title">{course.title}</h3>
              <p className="course-card-description">{course.description}</p>
              {course.status === 'available' && (
                <button className="course-button">Ver Curso</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

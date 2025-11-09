import { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { courses } from '../data/courses';
import type { Course } from '../data/courses';
import './ChatWidget.css';

interface ChatWidgetProps {
  user: {
    nombre: string;
    email: string;
    carrera: string;
  };
}

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  isCourseRecommendation?: boolean;
  courseData?: Course;
  aiReason?: string;
}

// Renderiza texto con **negritas**
const FormattedText = ({ text }: { text: string }) => {
  const parts = text.split('**');
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : part
      )}
    </>
  );
};

export default function ChatWidget({ user }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      text: '¡Hola! 👋 Soy tu asistente laboral de Crece +Perú. Estoy aquí para ayudarte a impulsar tu carrera profesional. ¿En qué te puedo apoyar hoy?',
      sender: 'bot',
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const API_KEY = 'AIzaSyD-QphuQjOpaya-r4PHfm-gs8N-okVqun4';

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleCourseClick = (courseId: string) => {
    alert(`Excelente elección. Este curso podría ayudarte a fortalecer tu perfil profesional.\nID del curso: ${courseId}`);
  };

  const sendMessage = async () => {
    const text = userInput.trim();
    if (!text || isLoading) return;

    appendMessage({ text, sender: 'user' });
    setUserInput('');
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const availableCourses = courses.filter((c) => c.status === 'available');
      const courseListForAI = availableCourses
        .map(
          (c) =>
            `ID: ${c.id}, Título: ${c.title}, Carreras Relacionadas: [${c.relatedCareers.join(', ')}]`
        )
        .join('\n');

      const userCareer =
        user.carrera && user.carrera !== 'Selecciona tu carrera' && user.carrera !== 'Otro...'
          ? user.carrera
          : 'No especificada';

      // 🧠 PROMPT FINAL – incluye conversación, agradecimientos y empatía
      const prompt = `
Eres un **asesor laboral amigable y servicial** del programa **Crece +Perú**. 
Tu rol es conversar con el usuario de forma empática, profesional y útil, 
brindando apoyo sobre empleo, formación, crecimiento profesional o habilidades.

**Datos del usuario:**
- Nombre: ${user.nombre}
- Carrera: ${userCareer}
- Mensaje del usuario: "${text}"

**Cursos disponibles:**
${courseListForAI}

Debes clasificar el mensaje del usuario y responder según estos casos:

1. 🧭 **RECOMMEND_COURSES** → cuando el usuario expresa interés claro en aprender, capacitarse o fortalecer habilidades.  
   Ejemplo: “Qué curso me recomiendas”, “Quiero mejorar mi perfil”, “Necesito capacitarme”.

2. 💬 **ADVICE** → cuando el usuario pide orientación o hace preguntas sobre empleo, entrevistas, liderazgo, habilidades, o desarrollo profesional en general.  
   Debes dar **consejos concretos, naturales y útiles**, como un orientador real.

3. 🤝 **SOCIAL_INTERACTION** → cuando el mensaje es un saludo o agradecimiento (“gracias”, “ok”, “adiós”, “hola”, “nos vemos”, etc.).  
   Responde con amabilidad, muestra empatía y siempre cierra preguntando si desea algo más.  
   Ejemplo: “¡Con gusto! 😊 ¿Hay algo más en lo que te pueda ayudar?”

4. 🚫 **OUT_OF_SCOPE** → cuando el mensaje no tiene relación con temas laborales o profesionales.  
   Responde con amabilidad e invita a hablar de desarrollo profesional.

Devuelve SIEMPRE un JSON con la siguiente estructura:

\`\`\`json
{
  "type": "RECOMMEND_COURSES" | "ADVICE" | "SOCIAL_INTERACTION" | "OUT_OF_SCOPE",
  "message": "Texto para responder al usuario",
  "data": [
    { "id": "ID_DEL_CURSO", "reason": "Motivo por el que lo recomiendas" }
  ] (solo si type es RECOMMEND_COURSES)
}
\`\`\`

No uses texto fuera del JSON.  
Tu tono debe ser **cálido, empático y profesional**.
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanedJsonText = responseText.replace(/```json|```/g, '').trim();

      try {
        const parsedResponse = JSON.parse(cleanedJsonText);

        if (parsedResponse.type === 'SOCIAL_INTERACTION') {
          appendMessage({ text: parsedResponse.message, sender: 'bot' });
        } else if (parsedResponse.type === 'ADVICE') {
          appendMessage({ text: parsedResponse.message, sender: 'bot' });
        } else if (parsedResponse.type === 'RECOMMEND_COURSES' && Array.isArray(parsedResponse.data)) {
          appendMessage({
            text: parsedResponse.message || 'He encontrado algunas opciones que podrían ayudarte 👇',
            sender: 'bot',
          });
          parsedResponse.data.forEach((rec: { id: string; reason: string }) => {
            const recommendedCourse = courses.find((c) => c.id === rec.id);
            if (recommendedCourse) {
              appendMessage({
                text: '',
                sender: 'bot',
                isCourseRecommendation: true,
                courseData: recommendedCourse,
                aiReason: rec.reason,
              });
            }
          });
        } else if (parsedResponse.type === 'OUT_OF_SCOPE') {
          appendMessage({ text: parsedResponse.message, sender: 'bot' });
        } else {
          throw new Error('Estructura inválida en la respuesta del asistente');
        }
      } catch (err) {
        console.error('Error al procesar respuesta del asistente:', err);
        appendMessage({
          text:
            'Lo siento, no entendí del todo tu mensaje 😅. ¿Podrías contármelo de otra forma o decirme qué te gustaría lograr?',
          sender: 'bot',
        });
      }
    } catch (err) {
      console.error('Error al comunicarse con el asistente:', err);
      appendMessage({
        text: '⚠️ Hubo un problema de conexión con el asistente. Por favor, inténtalo más tarde.',
        sender: 'bot',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-widget-container">
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>🤖 Asistente Laboral Crece +Perú</h3>
          <button onClick={toggleChat} className="close-chat-btn">
            &times;
          </button>
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}>
              {msg.isCourseRecommendation && msg.courseData ? (
                <div
                  className="course-recommendation-card"
                  onClick={() => handleCourseClick(msg.courseData!.id)}
                >
                  <img
                    src={msg.courseData.imageUrl}
                    alt={msg.courseData.title}
                    className="course-rec-image"
                  />
                  <div className="course-rec-content">
                    <h4>{msg.courseData.title}</h4>
                    <p className="course-rec-difficulty">
                      Dificultad: <span>{msg.courseData.difficulty}</span>
                    </p>
                    <p className="course-rec-reason">
                      <FormattedText text={msg.aiReason!} />
                    </p>
                    <button className="course-rec-button">Ver Curso</button>
                  </div>
                </div>
              ) : (
                <FormattedText text={msg.text} />
              )}
            </div>
          ))}
        </div>

        <div className="chat-input">
          <textarea
            placeholder="Escribe tu mensaje..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          ></textarea>
          <button onClick={sendMessage} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>

      <button onClick={toggleChat} className="chat-bubble">
        <span className="text-4xl">🤖</span>
      </button>
    </div>
  );
}

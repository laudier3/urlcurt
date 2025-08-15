import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './LoadingSpinner.css';
import { useNavigate } from 'react-router-dom';
//import Loading from '../components/Loading';
import { useRef } from 'react';
import { Helmet } from 'react-helmet';

interface ContactPageData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const service_email = process.env.REACT_APP_YOUR_SERVICE_ID!;
  const templete_email = process.env.REACT_APP_YOUR_TEMPLATE_ID!;
  const user_email = process.env.REACT_APP_YOUR_USER_ID!;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState<ContactPageData>({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('Por favor, preencha todos os campos.');
      return;
    }

    if (!validateEmail(formData.email)) {
      setStatus('E-mail inválido.');
      return;
    }

    setIsLoading(true);

    emailjs
      .send(service_email, templete_email, { ...formData }, user_email)
      .then(
        () => {
          setFormData({ name: '', email: '', message: '' });
          setIsLoading(false);
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            navigate('/');
          }, 8000);
        },
        (error) => {
          console.error('Erro ao enviar e-mail:', error);
          setStatus('Erro ao enviar. Tente novamente mais tarde.');
          setIsLoading(false);
        }
      );
  };

  return (
    <>
      <Helmet>
        <title>encurtador de link | UrlCurt</title>
        <meta name="description" content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real." />

        {/* Open Graph */}
        <meta property="og:title" content="Encurtador de URL | UrlCurt" />
        <meta property="og:description" content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real." />
        <meta property="og:image" content="https://www.urlcurt.com.br/images/share-image.png" />
        <meta property="og:url" content="https://www.urlcurt.com.br" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Encurtador de Link | UrlCurt" />
        <meta name="twitter:description" content="Transforme links longos em URLs curtas com segurança, praticidade e estatísticas em tempo real." />
        <meta name="twitter:image" content="https://www.urlcurt.com.br/images/share-image.png" />

        <link rel="canonical" href="https://www.urlcurt.com.br/" />
      </Helmet>
      <canvas
        ref={canvasRef}
        className="background"
        style={{
          position: 'fixed',
          top: 0, left: 0, width: '100%', height: '100%',
          zIndex: -1,
          display: 'block',
        }}
      />
      <div className="containerContato">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p className="loading-text">Enviando sua mensagem...</p>
          </div>
        )}

        {showSuccessModal && (
          <div style={modalOverlayStyle}>
            <div style={modalStyle}>
              <h3 style={{ marginBottom: '10px' }}>Mensagem enviada com sucesso!</h3>
              <p>Entraremos em contato em breve.</p>
              <button onClick={() => setShowSuccessModal(false)} style={closeButtonStyle}>
                OK
              </button>
            </div>
          </div>
        )}

        <h2>Fale Conosco</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label><br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              />
          </div>
          <div>
            <label>E-mail:</label><br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              />
          </div>
          <div>
            <br />
            <label>Mensagem:</label><br />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              disabled={isLoading}
              style={{
                width: '100%',
                height: 100,
                padding: 10,
                borderRadius: 5,
                marginTop: 5,
              }}
              ></textarea>
          </div>

          <button type="submit" disabled={isLoading}>
            Enviar
          </button>

          {status && <p style={{ color: 'red' }}>{status}</p>}
        </form>
      </div>
    </>
  );
};

export default ContactPage;

// 🎨 Estilos do modal
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  maxWidth: '400px',
  width: '80%',
};

const closeButtonStyle: React.CSSProperties = {
  marginTop: '15px',
  padding: '8px 16px',
  backgroundColor: '#4F46E5',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

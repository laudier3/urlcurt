import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './LoadingSpinner.css';

interface ContactPageData {
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const service_email = process.env.REACT_APP_YOUR_SERVICE_ID!;
  const templete_email = process.env.REACT_APP_YOUR_TEMPLATE_ID!;
  const user_email = process.env.REACT_APP_YOUR_USER_ID!;

  const [formData, setFormData] = useState<ContactPageData>({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
          setStatus('Mensagem enviada com sucesso!');
          setFormData({ name: '', email: '', message: '' });
          setIsLoading(false);
        },
        (error) => {
          console.error('Erro ao enviar e-mail:', error);
          setStatus('Erro ao enviar. Tente novamente mais tarde.');
          setIsLoading(false);
        }
      );
  };

  return (
    <div className="containerContato">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p className="loading-text">Enviando sua mensagem...</p>
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

        <p>{status}</p>
      </form>
    </div>
  );
};

export default ContactPage;

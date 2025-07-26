import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const ContatoPage: React.FC = () => {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Mensagem enviada com sucesso!');
    // Aqui você pode adicionar envio via API ou integração com backend
  };

  return (
    <>
      <Helmet>
        <title>Contato | URLShort</title>
        <meta name="description" content="Entre em contato com a equipe do URLShort para dúvidas, sugestões ou parcerias." />
      </Helmet>

      <main className="contact-container">
        <h1>Fale Conosco</h1>
        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Nome:
            <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
          </label>
          <label>
            E-mail:
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Mensagem:
            <textarea name="mensagem" value={form.mensagem} onChange={handleChange} required />
          </label>
          <button type="submit">Enviar</button>
        </form>
      </main>

      <style>{`
        .contact-container {
          max-width: 700px;
          margin: 120px auto;
          padding: 2rem;
          color: #e0e7ff;
        }

        .contact-container h1 {
          font-size: 2.2rem;
          color: #a78bfa;
          margin-bottom: 1.5rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .contact-form label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 0.8rem;
          border-radius: 8px;
          border: 1px solid #8b5cf6;
          background-color: #1e293b;
          color: #e0e7ff;
          font-size: 1rem;
        }

        .contact-form button {
          background-color: #8b5cf6;
          color: white;
          padding: 0.75rem 2rem;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .contact-form button:hover {
          background-color: #7c3aed;
        }
      `}</style>
    </>
  );
};

export default ContatoPage;

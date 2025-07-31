import React, { useState, useEffect } from 'react';

const consentKey = 'cookieConsent';

const ConsentFooter: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(consentKey);
    if (consent !== 'accepted' && consent !== 'declined') {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (visible) setFade(true);
  }, [visible]);

  function handleConsent(value: 'accepted' | 'declined') {
    localStorage.setItem(consentKey, value);
    setFade(false);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  return (
    <div
      style={{
        ...styles.container,
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      role="dialog"
      aria-live="polite"
      aria-label="Consentimento para cookies"
    >
      <div style={styles.text}>
        Usamos cookies próprios e de terceiros para personalizar anúncios, analisar o tráfego do site e melhorar sua experiência. 
        Você pode aceitar ou recusar o uso de cookies para anúncios personalizados.{' '}
        <a href="/politica" target="_blank" rel="noopener noreferrer" style={styles.link}>
          Saiba mais
        </a>.
        Recusar pode afetar a relevância dos anúncios exibidos.
      </div>
      <div style={styles.buttons}>
        <button
          onClick={() => handleConsent('declined')}
          style={{ ...styles.button, ...styles.decline }}
          aria-label="Recusar uso de cookies"
        >
          Recusar
        </button>
        <button
          onClick={() => handleConsent('accepted')}
          style={{ ...styles.button, ...styles.accept }}
          aria-label="Aceitar uso de cookies"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    bottom: 15,
    left: 0,
    right: 0,
    backgroundColor: '#2c3e50ea',
    color: '#ecf0f1',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1rem',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
    zIndex: 1000,
    width: '98%',
    margin: 'auto',
    borderRadius: 6,
  },
  text: {
    flex: 1,
    marginRight: '1rem',
    lineHeight: 1.4,
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'underline',
  },
  buttons: {
    display: 'flex',
    gap: '0.5rem',
  },
  button: {
    cursor: 'pointer',
    border: 'none',
    padding: '0.5rem 1.2rem',
    fontSize: '1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
  accept: {
    backgroundColor: '#27ae60',
    color: 'white',
  },
  decline: {
    backgroundColor: '#e74c3c',
    color: 'white',
  },
};

export default ConsentFooter;

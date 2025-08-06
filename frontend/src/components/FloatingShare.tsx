import React from 'react';

export const FloatingShare: React.FC = () => {
  const urlToShare = encodeURIComponent(window.location.href || 'https://www.urlcurt.com.br');
  const textToShare = encodeURIComponent('Confira este site incrível!');

  const networks = [
    {
      name: 'Facebook',
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${urlToShare}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="#4267B2" viewBox="0 0 24 24" width="24" height="24" aria-label="Facebook">
          <path d="M22 12a10 10 0 10-11.63 9.88v-7H8v-3h2.37V9.5c0-2.35 1.4-3.65 3.55-3.65 1.03 0 2.1.18 2.1.18v2.3h-1.18c-1.16 0-1.52.72-1.52 1.46v1.75h2.6l-.42 3h-2.18v7A10 10 0 0022 12z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      shareUrl: `https://telegram.me/share/url?url=${urlToShare}&text=${textToShare}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="#0088cc" viewBox="0 0 24 24" width="24" height="24" aria-label="Telegram">
          <path d="M9.5 15.5l-.5 4.5s.7 0 1-.4l2.4-2.3 4.5 3.3c.8.5 1.4.3 1.6-.7L22 5.3c.2-1-.5-1.4-1.2-1L3 10.7c-1 .3-.96 1.1-.2 1.4l4.6 1.4 10.7-6.7-9.1 8.1z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      shareUrl: `https://www.instagram.com/`, // Instagram não tem share direto
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="#E4405F" viewBox="0 0 24 24" width="24" height="24" aria-label="Instagram">
          <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm4.25 4.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm5.15-.85a1.15 1.15 0 11-2.3 0 1.15 1.15 0 012.3 0zM12 9a3 3 0 110 6 3 3 0 010-6z" />
        </svg>
      ),
    },
    {
      name: 'Twitter',
      shareUrl: `https://twitter.com/intent/tweet?url=${urlToShare}&text=${textToShare}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="#1DA1F2" viewBox="0 0 24 24" width="24" height="24" aria-label="Twitter">
          <path d="M23 3a10.9 10.9 0 01-3.14.86 4.48 4.48 0 001.98-2.48 9.03 9.03 0 01-2.88 1.1A4.52 4.52 0 0016.07 2c-2.5 0-4.51 2.03-4.51 4.53 0 .35.04.7.12 1.03A12.94 12.94 0 013 4.15s-4 9 5 13a13 13 0 01-7 2c9 5 20 0 20-11.5a4.48 4.48 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${urlToShare}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="#0077B5" viewBox="0 0 24 24" width="24" height="24" aria-label="LinkedIn">
          <path d="M4.98 3.5A2.5 2.5 0 002.5 6v12a2.5 2.5 0 002.48 2.5h.04a2.5 2.5 0 002.48-2.5V6a2.5 2.5 0 00-2.52-2.5zM8 9.94v8.56h3.62v-4.8c0-1.28.47-2.15 1.67-2.15 1.17 0 1.25 1.1 1.25 2.25v4.7h3.63v-5.05c0-2.7-1.44-3.95-3.36-3.95-1.57 0-2.28.85-2.66 1.44v-1.23zM7.75 4a1.5 1.5 0 11.01 3 1.5 1.5 0 01-.01-3z" />
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      shareUrl: `https://api.whatsapp.com/send?text=${textToShare}%20${urlToShare}`,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="#25D366" viewBox="0 0 24 24" width="24" height="24" aria-label="WhatsApp">
          <path d="M20.52 3.48a11.53 11.53 0 00-16.31 0c-4.47 4.47-4.39 11.75.23 16.25l-1.5 5.5 5.7-1.5a11.53 11.53 0 0011.87-20.25zm-8.6 15.4a8.08 8.08 0 01-4.33-1.3l-.3-.18-3.2.84.85-3.13-.2-.32a8.1 8.1 0 113.42 3.1zm4.02-5.25c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.11s-.57.7-.7.85c-.13.15-.26.18-.5.06a5.35 5.35 0 01-1.56-.96 5.9 5.9 0 01-1.1-1.36c-.11-.2 0-.3.09-.41.09-.09.2-.23.3-.35.1-.12.13-.2.2-.33.07-.11 0-.2-.01-.3-.02-.11-.5-1.2-.7-1.65-.18-.43-.36-.37-.5-.37-.12 0-.26 0-.4 0-.14 0-.36.05-.55.26s-.72.7-.72 1.7c0 1 .73 2 0 3 .7.94 1.7 1.57 3.2 2.2a10.3 10.3 0 001.6.65c.3.1.57.08.78.05.24-.02.75-.3.86-.6.1-.3.1-.56.07-.6z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="floating-share" aria-label="Compartilhar">
      {networks.map(({ name, shareUrl, icon }) => (
        <a
          key={name}
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Compartilhar no ${name}`}
          title={`Compartilhar no ${name}`}
          className="share-icon"
        >
          {icon}
        </a>
      ))}

      <style>{`
        .floating-share {
          position: fixed;
          top: 50%;
          right: 16px;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 1000;
        }
        .share-icon svg {
          width: 32px;
          height: 32px;
          transition: transform 0.25s ease, filter 0.25s ease;
          cursor: pointer;
        }
        .share-icon:hover svg {
          transform: scale(1.3);
          filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.8));
        }

        @media screen and (max-width: 726px) {
            .floating-share {
                margin-right: -12px;
                gap: 5px;
            }
            .share-icon svg {
                width: 22px;
                height: 22px;
                transition: transform 0.25s ease, filter 0.25s ease;
                cursor: pointer;
            }
        }
      `}</style>
    </div>
  );
};

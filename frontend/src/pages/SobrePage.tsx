import React from 'react';
import { Helmet } from 'react-helmet';
import "./LoadingSpinner.css"
import { useRef } from 'react';

const SobrePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
      <div className='containerSobre'>
        <h1>Termos e Condicões</h1>
        <br />
        <Helmet>
          <title>Sobre | Urlcurt</title>
          <meta name="description" content="Conheça mais sobre o Urlcurt e como ajudamos a transformar links em ferramentas úteis." />
        </Helmet>

        <main className="content">
          <h2>1. Termos</h2>
          <p>
            Ao acessar ao site urlcurt, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
          </p>
          <h2>2. Uso de Licença</h2>
          <p>
            É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site urlcurt , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode: 

            modificar ou copiar os materiais; 
            usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial); 
            tentar descompilar ou fazer engenharia reversa de qualquer software contido no site urlcurt; 
            remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou 
            transferir os materiais para outra pessoa ou 'espelhe' os materiais em qualquer outro servidor.
            Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por urlcurt a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.
          </p>
          <h2>3. Isenção de responsabilidade</h2>
          <p>
            Os materiais no site da urlcurt são fornecidos 'como estão'. urlcurt não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
            Além disso, o urlcurt não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
          </p>
          <h2>4. Limitações</h2>
          <p>
            Em nenhum caso o urlcurt ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em urlcurt, mesmo que urlcurt ou um representante autorizado da urlcurt tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.
          </p>
          <h2>5. Precisão dos materiais</h2>
          <p>
            Os materiais exibidos no site da urlcurt podem incluir erros técnicos, tipográficos ou fotográficos. urlcurt não garante que qualquer material em seu site seja preciso, completo ou atual. urlcurt pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, urlcurt não se compromete a atualizar os materiais.
          </p>
          <h2>6. Links</h2>
          <p>
            O urlcurt não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por urlcurt do site. O uso de qualquer site vinculado é por conta e risco do usuário.
          </p>
        </main>

        <style>{/*`
          .content {
            max-width: 800px;
            margin: 120px auto;
            padding: 2rem;
            color: #e0e7ff;
            font-family: 'Segoe UI', sans-serif;
            text-align: left;
          }

          .content h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #a78bfa;
          }

          .content p {
            font-size: 1.1rem;
            line-height: 1.8;
            color: #d1d5db;
          }
        `*/}</style>
      </div>
    </>
  );
};

export default SobrePage;

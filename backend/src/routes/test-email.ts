import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'laudiersantanamei@gmail.com',
    pass: 'senha unicar google',
  },
});

async function testEmail() {
  try {
    await transporter.sendMail({
      from: 'laudiersantanamei@gmail.com',
      to: 'kalinoippc@gmail.com',
      subject: 'Teste de envio',
      html: '<p>Isso é um teste</p>',
    });

    console.log('E-mail enviado com sucesso!');
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
  }
}

testEmail();

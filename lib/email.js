import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendReservationEmail = async (email, rezervaceData) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '✅ Potvrzení vaší rezervace - Blatnická rezervace',
    html: `
      <h2>Potvrzení rezervace</h2>
      <p>Vaše rezervace byla úspěšně přijata!</p>
      
      <h3>Detaily rezervace:</h3>
      <ul>
        <li><strong>Jméno:</strong> ${rezervaceData.jmeno}</li>
        <li><strong>Datum:</strong> ${rezervaceData.datum}</li>
        <li><strong>Čas:</strong> ${rezervaceData.cas}</li>
        <li><strong>Typ akce:</strong> ${rezervaceData.akce}</li>
        <li><strong>Počet osob:</strong> ${rezervaceData.pocet_osob}</li>
        <li><strong>Místo:</strong> ${rezervaceData.mista || 'Neurčeno'}</li>
      </ul>

      <p><strong>Technické detaily:</strong></p>
      <ul>
        <li>Zásuvka: ${rezervaceData.zasuvka ? 'Dostupná' : 'Nedostupná'}</li>
        <li>Elektřina: ${rezervaceData.elektrina ? 'Dostupná' : 'Nedostupná'}</li>
      </ul>

      <p>${rezervaceData.poznamka ? '<strong>Vaše poznámka:</strong> ' + rezervaceData.poznamka : ''}</p>

      <p>Na viděnou v Blatnické rezervaci! 🎉</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email odeslán na:', email);
  } catch (error) {
    console.error('Chyba při odesílání emailu:', error);
    throw error;
  }
};

export const sendAdminNotification = async (rezervaceData) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: '🔔 Nová rezervace - ' + rezervaceData.akce,
    html: `
      <h2>Nová rezervace</h2>
      <p><strong>Klient:</strong> ${rezervaceData.jmeno}</p>
      <p><strong>Email:</strong> ${rezervaceData.email}</p>
      <p><strong>Telefon:</strong> ${rezervaceData.telefon}</p>
      <p><strong>Datum:</strong> ${rezervaceData.datum}</p>
      <p><strong>Čas:</strong> ${rezervaceData.cas}</p>
      <p><strong>Typ akce:</strong> ${rezervaceData.akce}</p>
      <p><strong>Počet osob:</strong> ${rezervaceData.pocet_osob}</p>
      <p><strong>Poznámka:</strong> ${rezervaceData.poznamka || 'Žádná'}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notifikace odeslána adminovi');
  } catch (error) {
    console.error('Chyba při odesílání notifikace:', error);
    throw error;
  }
};

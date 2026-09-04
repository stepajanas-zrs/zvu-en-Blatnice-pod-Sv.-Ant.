import nodemailer from 'nodemailer';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const { jmeno, email, telefon, datum, cas, akce, pocet_osob, mista, zasuvka, elektrina, poznamka } = req.body;

    if (!jmeno || !email || !datum || !cas) {
      return res.status(400).json({ error: 'Chybějící povinná pole' });
    }

    // Email klientovi
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Potvrzení rezervace - Zvučení Blatnické`,
      html: `
        <h2>Děkujeme za vaši rezervaci!</h2>
        <p>Vaše rezervace byla přijata a čeká na schválení administrátora.</p>
        <hr>
        <p><strong>Detaily rezervace:</strong></p>
        <ul>
          <li>Jméno: ${jmeno}</li>
          <li>Datum: ${datum}</li>
          <li>Čas: ${cas}:00</li>
          <li>Počet osob: ${pocet_osob}</li>
          <li>Akce: ${akce || 'Neurčeno'}</li>
          <li>Zásuvka: ${zasuvka ? 'Ano' : 'Ne'}</li>
          <li>Elektřina: ${elektrina ? 'Ano' : 'Ne'}</li>
        </ul>
        <p>Brzy se vám ozveme s potvrzením!</p>
      `,
    });

    // Email adminovi
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 Nová rezervace od ${jmeno}`,
      html: `
        <h2>Nová rezervace!</h2>
        <p><strong>Od:</strong> ${jmeno} (${email}, ${telefon})</p>
        <p><strong>Datum:</strong> ${datum} v ${cas}:00</p>
        <p><strong>Počet osob:</strong> ${pocet_osob}</p>
        <p><strong>Akce:</strong> ${akce || 'Neurčeno'}</p>
        <p><strong>Poznámka:</strong> ${poznamka || '-'}</p>
      `,
    });

    res.status(201).json({ success: true, message: 'Rezervace přijata' });
  } catch (error) {
    console.error('Chyba:', error);
    res.status(500).json({ error: 'Chyba při ukládání rezervace' });
  }
}
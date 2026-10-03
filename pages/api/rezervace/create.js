import nodemailer from 'nodemailer';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465', 10),
  secure: Boolean(process.env.EMAIL_PORT && Number(process.env.EMAIL_PORT) === 465),
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
    const {
      jmeno,
      email,
      telefon,
      datum,
      cas,
      akce,
      pocet_osob,
      mista,
      zasuvka,
      elektrina,
      poznamka,
    } = req.body;

    if (!jmeno || !email || !datum || !cas) {
      return res.status(400).json({ error: 'Chybějící povinná pole' });
    }

    const reservation = {
      jmeno,
      email,
      telefon: telefon || '',
      datum,
      cas,
      akce: akce || '',
      pocet_osob: pocet_osob || '1',
      mista: mista || '',
      zasuvka: Boolean(zasuvka),
      elektrina: Boolean(elektrina),
      poznamka: poznamka || '',
      status: 'pending',
      createdAt: new Date(),
    };

    await addDoc(collection(db, 'rezervace'), reservation);

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Potvrzení rezervace - Zvučení Blatnické',
        html: `
          <h2>Děkujeme za vaši rezervaci!</h2>
          <p>Vaše rezervace byla přijata a čeká na schválení administrátora.</p>
          <hr>
          <p><strong>Detaily rezervace:</strong></p>
          <ul>
            <li>Jméno: ${jmeno}</li>
            <li>Datum: ${datum}</li>
            <li>Čas: ${cas}:00</li>
            <li>Počet osob: ${pocet_osob || '1'}</li>
            <li>Akce: ${akce || 'Neurčeno'}</li>
            <li>Zásuvka: ${reservation.zasuvka ? 'Ano' : 'Ne'}</li>
            <li>Elektřina: ${reservation.elektrina ? 'Ano' : 'Ne'}</li>
          </ul>
          <p>Brzy se vám ozveme s potvrzením!</p>
        `,
      });

      if (process.env.ADMIN_EMAIL) {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: process.env.ADMIN_EMAIL,
          subject: `🔔 Nová rezervace od ${jmeno}`,
          html: `
            <h2>Nová rezervace!</h2>
            <p><strong>Od:</strong> ${jmeno} (${email}, ${telefon || '-'})</p>
            <p><strong>Datum:</strong> ${datum} v ${cas}:00</p>
            <p><strong>Počet osob:</strong> ${pocet_osob || '1'}</p>
            <p><strong>Akce:</strong> ${akce || 'Neurčeno'}</p>
            <p><strong>Poznámka:</strong> ${poznamka || '-'}</p>
          `,
        });
      }
    }

    return res.status(201).json({ success: true, message: 'Rezervace přijata' });
  } catch (error) {
    console.error('Chyba při ukládání rezervace:', error);
    return res.status(500).json({ error: 'Chyba při ukládání rezervace' });
  }
}

import nodemailer from 'nodemailer';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

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
  } = req.body || {};

  if (!jmeno || !email || !datum || !cas) {
    return res.status(400).json({ error: 'Chybějící povinná pole' });
  }

  let reservationId;

  try {
    // Uložit nejdřív do Firestore, aby chyba e-mailu rezervaci nezahodila.
    const reservation = {
      jmeno,
      email,
      telefon: telefon || '',
      datum,
      cas,
      akce: akce || '',
      pocet_osob: pocet_osob || '',
      mista: mista || '',
      zasuvka: Boolean(zasuvka),
      elektrina: Boolean(elektrina),
      poznamka: poznamka || '',
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'rezervace'), reservation);
    reservationId = docRef.id;
  } catch (error) {
    console.error('Chyba při ukládání rezervace do Firestore:', error);
    return res.status(500).json({ error: 'Rezervaci se nepodařilo uložit' });
  }

  // E-mail je pouze upozornění; jeho chyba nesmí způsobit opakované odeslání rezervace.
  try {
    await Promise.all([
      transporter.sendMail({
        from: process.env.EMAIL_FROM,
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
            <li>Počet osob: ${pocet_osob || 'Neuvedeno'}</li>
            <li>Akce: ${akce || 'Neurčeno'}</li>
            <li>Zásuvka: ${zasuvka ? 'Ano' : 'Ne'}</li>
            <li>Elektřina: ${elektrina ? 'Ano' : 'Ne'}</li>
          </ul>
          <p>Brzy se vám ozveme s potvrzením!</p>
        `,
      }),
      transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `🔔 Nová rezervace od ${jmeno}`,
        html: `
          <h2>Nová rezervace!</h2>
          <p><strong>Od:</strong> ${jmeno} (${email}, ${telefon || 'neuveden'})</p>
          <p><strong>Datum:</strong> ${datum} v ${cas}:00</p>
          <p><strong>Počet osob:</strong> ${pocet_osob || 'Neuvedeno'}</p>
          <p><strong>Akce:</strong> ${akce || 'Neurčeno'}</p>
          <p><strong>Poznámka:</strong> ${poznamka || '-'}</p>
        `,
      }),
    ]);
  } catch (error) {
    console.error('Rezervace je uložena, ale e-mail se nepodařilo odeslat:', error);
  }

  return res.status(201).json({
    success: true,
    id: reservationId,
    message: 'Rezervace byla uložena',
  });
}

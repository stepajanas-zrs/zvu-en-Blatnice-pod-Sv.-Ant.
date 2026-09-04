import { createRezervace, checkAvailability } from '@/lib/firebaseService';
import { validateForm } from '@/lib/validation';
import { sendReservationEmail, sendAdminNotification } from '@/lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoda není povolena' });
  }

  try {
    const formData = req.body;

    // Validace
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Kontrola dostupnosti
    const isAvailable = await checkAvailability(formData.datum, formData.cas);
    if (!isAvailable) {
      return res.status(409).json({ error: 'Tento čas je již obsazen' });
    }

    // Vytvoření rezervace
    const id = await createRezervace(formData);

    // Odeslání emailů
    await sendReservationEmail(formData.email, formData);
    await sendAdminNotification(formData);

    return res.status(201).json({
      success: true,
      message: 'Rezervace byla úspěšně vytvořena',
      id
    });
  } catch (error) {
    console.error('Chyba:', error);
    return res.status(500).json({ error: 'Chyba při vytváření rezervace' });
  }
}

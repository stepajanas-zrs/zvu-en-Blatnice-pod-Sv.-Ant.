import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { google } from "googleapis";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Není přihlášen" });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL + "/api/auth/callback/google"
  );

  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  if (req.method === "POST") {
    const { jmeno, mesic, den, misto, zprava } = req.body;
    const eventDate = new Date(2026, mesic, den);
    const event = {
      summary: `Rezervace - ${jmeno}`,
      description: `Místo: ${misto}\nPozn: ${zprava}`,
      start: {
        date: eventDate.toISOString().split("T")[0],
      },
      end: {
        date: eventDate.toISOString().split("T")[0],
      },
      reminders: {
        useDefault: true,
      },
    };

    try {
      const result = await calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      return res.status(200).json({
        ok: true,
        message: "Přidáno do Google Calendar",
        eventId: result.data.id,
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "GET") {
    try {
      const result = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date(2026, 0, 1).toISOString(),
        timeMax: new Date(2026, 11, 31).toISOString(),
        maxResults: 100,
      });

      return res.status(200).json(result.data.items || []);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
// Běžící na serveru (serverless funkce Next.js)
import { Octokit } from "@octokit/rest";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, datum, pozn } = req.body;
    const github = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Načti aktuální JSON z GitHubu
    const { data: file } = await github.repos.getContent({
      owner: "stepajanas-zrs",
      repo: "zvu-en-Blatnice-pod-Sv.-Ant.",
      path: "data/rezervace.json",
    });

    const rezervace = JSON.parse(Buffer.from(file.content, 'base64').toString());
    rezervace.push({ name, email, datum, pozn, time: new Date().toISOString() });

    // Ulož nový JSON zpět na GitHub (přes commit)
    await github.repos.createOrUpdateFileContents({
      owner: "stepajanas-zrs",
      repo: "zvu-en-Blatnice-pod-Sv.-Ant.",
      path: "data/rezervace.json",
      message: `Nová rezervace: ${name}, ${datum}`,
      content: Buffer.from(JSON.stringify(rezervace, null, 2)).toString('base64'),
      sha: file.sha,
    });

    res.status(200).json({ ok: true });
  } else {
    res.status(405).end();
  }
}
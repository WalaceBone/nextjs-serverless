
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import Client from 'ssh2-sftp-client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { filename } = req.body;

  if (!filename) {
    res.status(400).json({ message: 'Bad Request: filename is required' });
    return;
  }

  const filePath = path.join('/tmp', filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'File Not Found' });
    return;
  }

  const sftp = new Client();

  try {
    await sftp.connect({
      host: 'your-sftp-host',
      port: 22,
      username: 'your-sftp-username',
      password: 'your-sftp-password',
    });

    await sftp.put(filePath, `/remote/path/${filename}`);

    res.status(200).json({ message: 'File successfully sent via SFTP' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    sftp.end();
  }
}

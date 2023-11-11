
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import Client from 'ssh2-sftp-client';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  console.log(req.body);
  

  const {password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(password);
  
  // Comparing password with hashed password
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log(isMatch); // true

  const { filename } = req.body;
  console.log(filename);
  if (!filename) {
    res.status(400).json({ message: 'Bad Request: filename is required' });
    return;
  }

  const filePath = path.join('./tmp', filename);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ message: 'File Not Found' });
    return;
  }

  const sftp = new Client();

  try {
    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: process.env.SFTP_PORT || 22,
      username: process.env.SFTP_USERNAME,
      password: process.env.SFTP_PASSWORD,
    });

    await sftp.put(filePath, `/abbeal/${filename}`);

    res.status(200).json({ message: 'File successfully sent via SFTP' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    sftp.end();
  }
}

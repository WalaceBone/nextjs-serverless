import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'json2csv';
import fs from 'fs/promises';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const data = req.body;
        console.log(data);

        // Generate timestamp
        const now = new Date();
        const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '').split('T')[0];

        // Create filename with timestamp
        const filename = `data-${timestamp}.csv`;

        // Convert data to CSV format
        let csv = parse(data, {quote: ""});
        csv = csv.replace(/"/g, "");
        // Write data to CSV file
        const filePath = path.join('./tmp', filename);

        await fs.writeFile(filePath, csv);

        res.status(200).json({ message: 'Data written to ' + filename + ' file.' });
        res.end();
        
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}

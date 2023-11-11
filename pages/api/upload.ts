import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { createObjectCsvWriter } from 'csv-writer';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const data = req.body;
        console.log(req.body);

        // Generate timestamp
        const now = new Date();
        const timestamp = now.toISOString().replace(/:/g, '-').replace(/\..+/, '').split('T')[0];

        // Create filename with timestamp
        const filename = `data-${timestamp}.csv`;

        // Write data to CSV file
        const filePath = path.join('/tmp', filename);
        const csvWriter = createObjectCsvWriter({
            path: filePath,
            header: Object.keys(data).map(key => ({ id: key, title: key })),
            append: true
        });
        await csvWriter.writeRecords([data]);

        res.status(200).json({ message: 'Data written to ' + filename + ' file.' });
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}

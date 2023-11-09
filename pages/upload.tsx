
import { useState } from 'react';

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
        } else {
            setFile(null);
        }
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async () => {
            const data = reader.result;
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data }),
            });
            if (response.ok) {
                console.log('Upload successful');
            } else {
                console.error('Upload failed');
            }
        };
    };
    
    return (
        <form onSubmit={handleFormSubmit}>
            <label>
                Upload a CSV file:
                <input type="file" accept=".csv" onChange={handleFileChange} />
            </label>
            <button type="submit" disabled={!file}>
                Upload
            </button>
        </form>
    );
};

export default UploadPage;

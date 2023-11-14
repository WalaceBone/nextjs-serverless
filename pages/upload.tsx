
import { useState } from 'react';

interface Person {
    LastName: string;
    FirstName: string;
    Mail: string;
    City: string;
}

const UploadPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [people, setPeople] = useState<Person[]>([]);

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
            const data = reader.result as string;
            const lines = data.split('\n');
            const headers = lines[0].split(',');
            const peopleData = lines.slice(1).map((line) => {
                const values = line.split(',');
                return {
                    lastName: values[0],
                    firstName: values[1],
                    mail: values[2],
                    city: values[3],
                };
            });
            // setPeople(peopleData);
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(peopleData),
            });
            if (response.ok) {
                const resBody = await response.json();
                console.log(resBody);
            } else {
                console.error('Upload failed');
            }
        };
    };

    return (
        <div className='container'>
            <form className='container' onSubmit={handleFormSubmit}>
                <label className='container'>
                    Upload a CSV file:
                    <br />
                    <input type='file' accept='.csv' onChange={handleFileChange} />
                </label>
                <br />
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    type='submit'
                    disabled={!file}
                >
                    Upload
                </button>
            </form>
            <table className='text-center'>
                <thead>
                    <tr>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Email</th>
                        <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    {people.map((person, index) => (
                        <tr key={index}>
                            <td>{person.lastName}</td>
                            <td>{person.firstName}</td>
                            <td>{person.mail}</td>
                            <td>{person.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UploadPage;

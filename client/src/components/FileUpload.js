import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) {
            setErrorMessage('No file selected.');
            return;
        }

        const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
        if (!['csv', 'xls', 'xlsx'].includes(fileExtension)) {
            setErrorMessage('Invalid file type. Please upload a CSV, XLS, or XLSX file.');
            return;
        }

        setFile(selectedFile);
        setErrorMessage('');
    };

    const handleUpload = async () => {
        if (!token.match(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/)) {
            setErrorMessage('It must have at least one letter and one number,\ncannot contain special characters or spaces.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (!response.data.success) {
                setErrorMessage(response.data.message);
            } else {
                setErrorMessage('File uploaded successfully!');
            }
        } catch (error) {
            setErrorMessage(error.response.data.message || 'An error occurred while uploading the file.');
        }
    };

    return (
        <div>
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter a token" required />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default FileUpload;

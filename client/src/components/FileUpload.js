import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = event => {
        const file = event.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop();
        if (!['csv', 'xls', 'xlsx'].includes(fileExtension)) {
            setErrorMessage('Invalid file type. Please upload a CSV, XLS, or XLSX file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);

        axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if (response.data.success) {
                console.log('File uploaded successfully');
                setErrorMessage('');
            } else {
                setErrorMessage(response.data.message);
            }
        })
        .catch(error => {
            console.error('Upload failed:', error);
            setErrorMessage('An error occurred while uploading the file.');
        });
    };

    return (
        <div>
            <input
                type="text"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Enter a token (must include at least one letter and one number)"
                pattern="[A-Za-z0-9]+"
                required
            />
            <input
                type="file"
                onChange={handleFileChange}
            />
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default FileUpload;

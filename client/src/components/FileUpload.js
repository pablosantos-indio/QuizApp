import React, { useState } from 'react';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('token', token);

        fetch(`${process.env.REACT_APP_API_URL}/upload`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('File uploaded successfully');
            } else {
                setErrorMessage(data.message);
            }
        })
        .catch(error => {
            console.error('Upload failed:', error);
            setErrorMessage('An error occurred while uploading the file.');
        });
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default FileUpload;

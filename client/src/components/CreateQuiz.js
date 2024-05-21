import React from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Button, Box, Typography, TextField, Stack, FormHelperText, FormControl, FormLabel, Paper } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CreateQuiz({
    token,
    setToken,
    file,
    setFile,
    loading,
    errorFileUpload,
    errorMessageFileUpload,
    setErrorMessageFileUpload,
    setErrorFileUpload,
    setErrorCreateToken,
    setErrorMessageCreateToken,
    errorCreateToken,
    errorMessageCreateToken,
}) {
    const handleTokenChange = (event) => {
        const newToken = event.target.value;
        setToken(newToken);

        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
        if (!regex.test(newToken)) {
            setErrorCreateToken(true);
            setErrorMessageCreateToken('Token needs at least one letter and one number, no special characters or spaces.');
        } else {
            setErrorCreateToken(false);
            setErrorMessageCreateToken('');
        }

    };

    const handleFileChange = (event) => {
        if (loading) return;

        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const fileName = selectedFile.name;
            const validExtensions = ['.csv', '.xls', '.xlsx'];
            const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

            if (validExtensions.includes(fileExtension)) {
                setErrorFileUpload(false);
                setErrorMessageFileUpload("");
                setFile(selectedFile);
            } else {
                setErrorFileUpload(true);
                setErrorMessageFileUpload("Invalid file format. Please select a file with .csv, .xls, or .xlsx extension.");
            }
        } else {
            setFile(null);
        }
    };


    return (
        <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        gap: 4,
                        p: { xs: 2, sm: 3 },
                        width: '100%',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
                    }}
                >
                   
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            id="token-create"
                            label="Enter Token"
                            value={token}
                            onChange={handleTokenChange}
                            error={errorCreateToken}
                            helperText={errorMessageCreateToken}
                            sx={{ width: { xs: '100%', sm: '300px' } }}
                            disabled={loading}
                        />
                    </Box>

                    <Box >
                        <FormControl sx={{ width: { xs: '100%', sm: '300px' } }} error={errorFileUpload} variant="standard">
                            <FormLabel htmlFor="upload-file" required>
                                Upload File (.csv,.xls,.xlsx)
                            </FormLabel>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                name="upload-file"
                                disabled={loading}
                                
                            >
                                Choose File
                                <VisuallyHiddenInput type="file" accept=".csv, .xlsx, .xls" required onChange={handleFileChange} />
                            </Button>
                            {file && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Selected File: {file.name}
                                </Typography>
                            )}
                            <FormHelperText>{errorMessageFileUpload}</FormHelperText>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </Stack>
    );
}

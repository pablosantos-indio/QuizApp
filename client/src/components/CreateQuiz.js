import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { FormHelperText, FormControl, FormLabel } from '@mui/material';


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

export default function CreateQuiz({ token, setToken, setFile, errorFileUpload, errorMessageFileUpload, setErrorCreateToken, setErrorMessageCreateToken, errorCreateToken, errorMessageCreateToken }) {
    

    const handleTokenChange = (event) => {
        const newToken = event.target.value;
        setToken(newToken);

        const regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
        if (!regex.test(newToken)) {
            setErrorCreateToken(true);
            setErrorMessageCreateToken('Token must include at least one letter and one number and cannot contain special characters or spaces.');
        } else {
            setErrorCreateToken(false);
            setErrorMessageCreateToken('');
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
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
                p: 3,
                width: '100%',
                borderRadius: '20px',
                border: '1px solid ',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
            }}
            >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    id="token-create"
                    label="Enter the Token"
                    value={token}
                    onChange={handleTokenChange}
                    error={errorCreateToken}
                    helperText={errorMessageCreateToken}
                />
            </Box>

            <Box>
                <FormControl sx={{ m: 3 }} error={errorFileUpload} variant="standard">

                    <FormLabel htmlFor="upload-file" required>
                        Upload the file here
                    </FormLabel>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        name="upload-file"
                    >
                        Upload file
                        <VisuallyHiddenInput type="file" accept=".csv, .xlsx, .xls" required onChange={handleFileChange} />
                    </Button>
                    <FormHelperText>{errorMessageFileUpload}</FormHelperText>
                </FormControl>
            
            </Box>
            </Box>
        </Box>
        </Stack>
       
    );
}

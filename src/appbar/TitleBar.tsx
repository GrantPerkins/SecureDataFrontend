import {AppBar, Toolbar, Typography, Button, TextField, Tooltip} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import CloseIcon from '@mui/icons-material/Close';
import {makeStyles} from '@mui/styles';
import axios from 'axios';
import React from "react";


const useStyles = makeStyles(() => ({
    appBar: {
        width: '100%',
        marginLeft: 0,
    },
}));


export default function TitleBar() {
    const classes = useStyles();
    const [selectedFile, setSelectedFile] = React.useState<File>(null);
    const [success, setSuccess] = React.useState(false);
    const [failure, setFailure] = React.useState(false);
    const handleFileUpload = () => {
        const file = selectedFile;
        const formData = new FormData();
        formData.append('file', file, file.name);
        const url: string = 'http://securedatabackend2.us-east-1.elasticbeanstalk.com/api/upload';
        console.log(formData.get('file'));

        axios.post(url, formData, {
            timeout: 5000,
            headers: {'Authorization': "Basic dXNlcjpwYXNzd29yZA==", 'Content-Type': 'multipart/form-data'}
        })
            .then(response => {
                console.log(response);
                setSelectedFile(null);
                setSuccess(true);
            })
            .catch(error => {
                console.error(error);
                setSelectedFile(null);
                setFailure(true);
            });
    };

    const handleSelectedFile = (event: React.ChangeEvent) => {
        setSelectedFile(event.target.files[0]);
        setSuccess(false);
        setFailure(false);
    }
    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant={"h6"} sx={{my: 2, flex: 1}}>Secure Data Platform</Typography>
                <TextField type="file" variant={"standard"}
                           onChange={(event) => handleSelectedFile(event)}/>
                <Button variant="contained" color="primary" startIcon={<CloudUploadIcon/>}
                        onClick={handleFileUpload}>Upload</Button>
                {success && <Tooltip title={"Upload complete"}>
                    <DoneOutlineIcon/>
                </Tooltip>}
                {failure && <Tooltip title={"Upload failed"}>
                    <CloseIcon/>
                </Tooltip>}
            </Toolbar>
        </AppBar>
    );
}
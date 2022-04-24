import { Card, CardContent, CardHeader, TextField, Grid } from "@mui/material";
import React from "react";


export default function RequestForm({ title, body, method, url, onBodyChange, onMethodChange, onUrlChange }) {

    const jsonPrettify = (json) => {
        if (typeof json === 'object' && json !== null) {
            const pretty = JSON.stringify(json, undefined, 4);
            return pretty;
        }

        try {
            const obj = JSON.parse(json);
            return jsonPrettify(obj);
        } catch (e) {
            return json;
        }
    };

    return (
        <Card variant="outlined">
            <CardHeader title={title} sx={{ color: 'white', bgcolor: 'primary.main'}}/>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item md={2}>
                        <TextField
                            id="outlined-basic"
                            margin="normal"
                            required
                            label="Method"
                            value={method} onChange={e => onMethodChange(e.target.value)} />
                    </Grid>
                    <Grid item md={10}>
                        <TextField
                            label="URL"
                            type="text"
                            margin="normal"
                            value={url}
                            onChange={e => onUrlChange(e.target.value)}
                            required fullWidth={true} />
                    </Grid>
                </Grid>
                <TextField
                    label="Body"
                    type="textarea"
                    value={jsonPrettify(body)}
                    margin="normal"
                    fullWidth={true}
                    minRows={30}
                    onChange={e => onBodyChange(e.target.value)}
                    multiline={true}
                />
            </CardContent>
        </Card>
    )
}
import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, FormControlLabel, Switch, Radio, RadioGroup,
    FormControl, FormLabel
} from '@mui/material';

export default function ReportStyleDialog({ open, onClose, onGenerate, regNo }) {
    const [includeCharts, setIncludeCharts] = useState(false);
    const [templateStyle, setTemplateStyle] = useState("classic");

    const handleGenerate = (action) => {
        onGenerate({
            regNo,
            includeCharts,
            templateStyle,
            action
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Report Options</DialogTitle>
            <DialogContent>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={includeCharts}
                                onChange={() => setIncludeCharts(!includeCharts)}
                                color="primary"
                            />
                        }
                        label="Include graphs and charts"
                    />
                </FormControl>

                <FormControl component="fieldset" sx={{ display: 'block', mt: 2 }}>
                    <FormLabel component="legend">Template Style</FormLabel>
                    <RadioGroup
                        value={templateStyle}
                        onChange={(e) => setTemplateStyle(e.target.value)}
                    >
                        <FormControlLabel value="classic" control={<Radio />} label="Classic Style" />
                        <FormControlLabel value="modern" control={<Radio />} label="Modern Style" />
                        <FormControlLabel value="minimal" control={<Radio />} label="Minimal Style" />
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => handleGenerate('preview')} variant="outlined">
                    Preview
                </Button>
                <Button onClick={() => handleGenerate('download')} variant="contained" color="primary">
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
}
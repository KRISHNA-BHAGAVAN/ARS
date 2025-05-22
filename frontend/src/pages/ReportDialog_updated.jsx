import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, RadioGroup, FormControlLabel, Radio,
    FormLabel, FormGroup, Checkbox, FormControl,
    Select, MenuItem, InputLabel
} from '@mui/material';
import { availableColumns } from '../constants/columns';

export default function ReportDialog({ open, onClose, onGenerate, selected }) {
    const [reportType, setReportType] = useState('');
    const [pdfType, setPdfType] = useState('individual');
    const [selectedCols, setSelectedCols] = useState([]);
    const [includeCharts, setIncludeCharts] = useState(false);
    const [templateStyle, setTemplateStyle] = useState('classic');

    const toggleCol = id => {
        setSelectedCols(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const generate = () => {
        onGenerate({ 
            selected, 
            reportType, 
            pdfType, 
            selected_columns: selectedCols,
            includeCharts,
            templateStyle
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select Report Format</DialogTitle>
            <DialogContent>
                <FormLabel>Report Type</FormLabel>
                <RadioGroup
                    value={reportType}
                    onChange={e => { setReportType(e.target.value); setSelectedCols([]); }}
                >
                    <FormControlLabel value="excel" control={<Radio />} label="Excel" />
                    <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                </RadioGroup>

                {reportType === 'pdf' && (
                    <>
                        <FormLabel sx={{ mt: 2 }}>PDF Type</FormLabel>
                        <RadioGroup
                            value={pdfType}
                            onChange={e => setPdfType(e.target.value)}
                        >
                            <FormControlLabel value="individual" control={<Radio />} label="Individual" />
                            <FormControlLabel value="combined" control={<Radio />} label="Combined" />
                        </RadioGroup>

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={includeCharts}
                                    onChange={() => setIncludeCharts(!includeCharts)}
                                />
                            }
                            label="Include Charts"
                        />

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Template Style</InputLabel>
                            <Select
                                value={templateStyle}
                                onChange={(e) => setTemplateStyle(e.target.value)}
                                label="Template Style"
                            >
                                <MenuItem value="classic">Classic Style</MenuItem>
                                <MenuItem value="modern">Modern Style</MenuItem>
                                <MenuItem value="minimal">Minimal Style</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}

                {reportType === 'excel' && (
                    <>
                        <FormLabel sx={{ mt: 2 }}>Columns for Excel</FormLabel>
                        <FormGroup>
                            {availableColumns.map(col => (
                                <FormControlLabel
                                    key={col.id}
                                    control={
                                        <Checkbox
                                            value={col.id}
                                            checked={selectedCols.includes(col.id)}
                                            onChange={() => toggleCol(col.id)}
                                        />
                                    }
                                    label={col.label}
                                />
                            ))}
                        </FormGroup>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={generate}
                    variant="contained"
                    disabled={
                        !reportType ||
                        (reportType === 'pdf' && !pdfType) ||
                        (reportType === 'excel' && selectedCols.length === 0)
                    }
                >
                    Generate
                </Button>
            </DialogActions>
        </Dialog>
    );
}
import React, { useState } from 'react';
import {
    Table, TableHead, TableRow, TableCell,
    TableBody, Checkbox, Button
} from '@mui/material';
import { api } from '../services/api';
import { tableColumns } from '../constants/columns';
import ReportStyleDialog from '../components/ReportStyleDialog';

export default function StudentTable({ students, selected, handleSelect, handlePreview }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [currentRegNo, setCurrentRegNo] = useState(null);

    const openGenerateDialog = (regNo) => {
        setCurrentRegNo(regNo);
        setOpenDialog(true);
    };

    const closeDialog = () => {
        setOpenDialog(false);
        setCurrentRegNo(null);
    };

    undefined

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Select</TableCell>
                        {tableColumns.map(col => <TableCell key={col}>{col}</TableCell>)}
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.isArray(students) && students.map(s => (
                        <TableRow key={s.registered_no}>
                            <TableCell>
                                <Checkbox
                                    checked={selected.includes(s.registered_no)}
                                    onChange={() => handleSelect(s.registered_no)}
                                />
                            </TableCell>
                            <TableCell>{s.registered_no}</TableCell>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.branch}</TableCell>
                            <TableCell>{s.curr_semester}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    size="small"
                                    color="primary"
                                    onClick={() => openGenerateDialog(s.registered_no)}
                                >
                                    Generate Report
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Report Options Dialog */}
            <ReportStyleDialog
                open={openDialog}
                onClose={closeDialog}
                onGenerate={handleGenerateReport}
                regNo={currentRegNo}
            />
        </>
    );
}
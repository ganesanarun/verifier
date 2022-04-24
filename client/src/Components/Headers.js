import * as constants from '../services/constants';

import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';

export default function Headers({ onRowEdit, apiKey }) {

    const rows = [
        { id: 1, key: constants.API_HEADER, value: apiKey }
    ];

    const columns = [
        { field: 'key', headerName: 'Key', width: 200 },
        { field: 'value', headerName: 'Value', width: 500, editable: true },
    ];

    return (
        <>
            <Typography variant="h5" color="primary" sx={{ m: 1 }}>
                Headers
            </Typography>
            <div style={{ height: '200px', width: '100%', margin: '5px' }}>

                <DataGrid
                    rows={rows}
                    editMode="row"
                    columns={columns}
                    onRowEditStop={onRowEdit} />
            </div>
        </>)
}
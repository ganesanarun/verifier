
import React, { useEffect, useState } from "react";

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import { getHistory } from "../services/ProxyService";

export default function History() {

    const [state, setState] = useState({
        left: false,
    });

    const [history, setHistory] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const response = await getHistory();
            setHistory(response);
        }
        fetchData().catch(console.error);
    }, [state])

    const toggleDrawer =
        (anchor, open) =>
            (event) => {
                if (
                    event.type === 'keydown' &&
                    (event.key === 'Tab' || event.key === 'Shift')) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };

    const list = () => (
        <Box
            sx={{ width: 400 }}
            role="presentation"
        >
            <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {history.map(h =>
                    <TreeItem key={h.id} nodeId={String(h.id)} label={h.label} onClick={() => console.log(h.id)}>
                    </TreeItem>
                )}
            </TreeView>
        </Box>
    );

    return (
        <>
            <Button onClick={toggleDrawer('left', true)}>History</Button>
            <Drawer
                anchor='left'
                open={state['left']}
                onClose={toggleDrawer('left', false)}
            >
                {list()}
            </Drawer>
        </>);
}
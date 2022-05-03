import React, { useEffect, useState } from "react";
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { getHistory } from "../services/ProxyService";

export default function History(props) {

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

    function handleSelect(id) {
        toggleDrawer('left', false)();
        props.onSelect(id);
    }

    const toggleDrawer =
        (anchor, open) => (event) => {
                setState({ [anchor]: open });
            };

    const invocations = () => (
        <Box
            sx={{ width: 400 }}
            role="presentation">
            <TreeView
                aria-label="History"
                sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'auto' }}>
                {history.map(h =>
                    <TreeItem
                        icon={<HourglassBottomRoundedIcon style={{ color: "#1976d2" }} />}
                        key={h.id} nodeId={String(h.id)}
                        label={h.label}
                        onClick={() => handleSelect(h.id)}>
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
                onClose={toggleDrawer('left', false)}>
                {invocations()}
            </Drawer>
        </>);
}
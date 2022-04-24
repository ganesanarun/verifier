import express from 'express';
import cors from 'cors';
import axios from 'axios';

import pkg from 'body-parser';

import { get, save } from './services/history.js';

const app = express();
const { json } = pkg;

const port = process.env.PORT || 5001;

app.use(json());
app.use(cors());

app.post('/invoke', async (req, res) => {
    const { left, right } = req.body;

    await save(req.body)

    const leftAwaiter = invoke(left);
    const rightAwaiter = invoke(right);
    Promise.all([leftAwaiter, rightAwaiter])
        .then(values => {
            const leftResponse = extract(values[0]);
            const rightResponse = extract(values[1]);
            res.json({
                left: leftResponse,
                right: rightResponse
            });
        });
});

app.get('/history', async (_, res) => {
    const history = await get()
    res.json(history)
});

async function invoke(requestDraft) {
    const { method, url, headers, body } = requestDraft;
    const config = {
        method: method,
        url: url,
        headers: headers,
        data: body ? body : null
    };
    console.log(`To service: ${JSON.stringify(config)}`);

    try {
        return await axios.request(config);
    } catch (error) {
        console.error(`Received following error: ${error}`)
        return {
            data: {
                error
            },
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        }
    }
}

function extract(response) {
    const { status, data, headers } = response;
    return {
        status, data, headers
    };
}

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});


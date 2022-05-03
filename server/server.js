import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { join, dirname } from 'path';
import {  writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { dump } from 'js-yaml'
import { fileURLToPath } from 'url';

import pkg from 'body-parser';

import { get, getBy, save, getLastInvocation } from './services/history.js';

const app = express();
const { json } = pkg;

const port = process.env.PORT || 5001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dir = join(__dirname, 'temp')

if (!existsSync(dir)) {
    mkdirSync(dir);
}

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
    res.json(history.reverse())
});

app.get('/invocations/:id', async (req, res) => {
    const history = await getBy(req.params.id)
    res.json(history)
});

app.get('/export/invocation', async (_, res) => {
    const last = await getLastInvocation()
    const legacy = last.left
    const latest = last.right
    const a = {
        "legacy": {
            "url": new String(legacy.url),
            "method": legacy.method,
            "body": JSON.stringify(legacy.body)
        }, "latest": {
            "url": new String(latest.url),
            "method": latest.method,
            "body": JSON.stringify(latest.body)
        }
    }
    const data = dump(a)
    const filename = `${getRandomFileName()}.yaml`
    storeData(data, join(dir, filename))
    res.download(join(dir, filename), filename, (err) => {
        unlinkSync(join(dir, filename));
    });
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

const storeData = (data, path) => {
    writeFileSync(path, data)
    console.log("Successfully written to file.")
}

function getRandomFileName() {
    var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
    var random = ("" + Math.random()).substring(2, 8);
    var random_number = timestamp + random;
    return random_number;
}

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});


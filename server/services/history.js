import { Level } from 'level'

const db = new Level('./data', { valueEncoding: 'json', createIfMissing: true })

await db.put('history', [])

const reg = /.+?:\/\/.+?(\/.+?)(?:#|\?|$)/;

export async function save(req) {
    let history = await db.get('history')
    const id = getId(history);
    const path = reg.exec(req.left.url)[1]

    const newRequest = {
        ...req,
        id,
        label: `${req.left.method}  ${path}`
    }

    history.push(newRequest)
    await db.put('history', history)
}

export async function get() {
    return await db.get('history')
}

export async function getBy(id) {
    const history = await db.get('history')
    return history[id-1]
}

function getId(history) {
    if (history.length == 0) {
        return 1;
    }
    const { length, [length - 1]: last } = history;
    return last.id + 1;
}
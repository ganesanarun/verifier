import storage from 'node-persist'

//you must first call storage.init
await storage.init({
    stringify: JSON.stringify,

    parse: JSON.parse,

    encoding: 'utf8',

    logging: false,

    ttl: false,

    dir: 'data',
});


const reg = /.+?:\/\/.+?(\/.+?)(?:#|\?|$)/;

export async function save(req) {
    let history = await get()
    const id = getLastId(history);
    const path = reg.exec(req.left.url) && reg.exec(req.left.url).length > 1 ? reg.exec(req.left.url)[1] : req.left.url

    const newRequest = {
        ...req,
        id,
        label: `${req.left.method}  ${path}`
    }

    history.push(newRequest)
    await storage.updateItem('history', history)
}

export async function get() {
    return await storage.getItem('history') || []
}

export async function getBy(id) {
    const history = await get()
    return history.length >= id - 1 ? history[id - 1] : []
}

export async function getLastInvocation() {
    let history = await get()
    history = history.length > 0 ? history : [{
        left: {

        },
        right: {

        }
    }]
    const last = history.reverse()[0]
    return last
}

function getLastId(history) {
    if (history.length == 0) {
        return 1;
    }
    const { length, [length - 1]: last } = history;
    return last.id + 1;
}
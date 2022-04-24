import React from "react";

export default function RequestForm({ title, body, method, url, onBodyChange, onMethodChange, onUrlChange }) {
    
    const jsonPrettify = (json) => {
        if (typeof json === 'object' && json !== null) {
            const pretty = JSON.stringify(json, undefined, 4);
            return pretty;
        }

        try {
            const obj = JSON.parse(json);
            return jsonPrettify(obj);
        } catch (e) {
            return json;
        }
    };

    return (
        <div id="wrap" className="input">
            <header className="input-header">
                <h1>{title}</h1>
            </header>
            <section className="input-content">
                <div className="input-content-wrap">
                    <dl className="inputbox">
                        <dt className="inputbox-title">Method</dt>
                        <dd className="inputbox-content">
                            <input
                                type="text"
                                value={method}
                                onChange={e => onMethodChange(e.target.value)}
                                required />
                            <span className="underline"></span>
                        </dd>
                    </dl>
                    <dl className="inputbox">
                        <dt className="inputbox-title">URL</dt>
                        <dd className="inputbox-content">
                            <input
                                type="text"
                                value={url}
                                onChange={e => onUrlChange(e.target.value)}
                                required />
                            <span className="underline"></span>
                        </dd>
                    </dl>
                    <dl className="inputbox">
                        <dt className="inputbox-title">Body</dt>
                        <dd className="inputbox-content">

                            <textarea
                                type="textarea"
                                value={jsonPrettify(body)}
                                rows={5}
                                cols={48}
                                onChange={e => onBodyChange(e.target.value)}
                            />
                            <span className="underline"></span>

                        </dd>
                    </dl>
                </div>
            </section>

        </div>
    )
}
import './App.css';
import RequestForm from './Components/RequestForm'
import { invoke } from './services/ProxyService';

import React, { useState } from "react";
import ReactJsonViewCompare from "react-json-view-compare";


export default function App() {

  const [legacyMethod, setLegacyMethod] = useState("GET");
  const [newMethod, setNewMethod] = useState("GET");
  const [legacyURL, setLegacyURL] = useState("http://localhost:8080/api/users");
  const [newURL, setNewURL] = useState("http://localhost:8080/api/users2");
  const [legacyBody, setLegacyBody] = useState(`{"a": "whatever"}`)
  const [newBody, setNewBody] = useState(`{"b": "whatever"}`)

  const [oldData, setOldData] = useState(null);
  const [newData, setNewData] = useState(null);

  const call = async (e) => {
    e.preventDefault();
    const requestDraft = {
      left: {
        url: legacyURL,
        method: legacyMethod,
        body: JSON.parse(legacyBody)
      },
      right: {
        url: newURL,
        method: newMethod,
        body: JSON.parse(newBody)
      }
    }
    const { left, right } = await invoke(requestDraft);
    setNewData(right);
    setOldData(left);
  }

  return (
    <div className='main'>
      <form onSubmit={call}>
        <RequestForm title="Legacy"
          onMethodChange={setLegacyMethod}
          method={legacyMethod}
          url={legacyURL}
          onUrlChange={setLegacyURL}
          body={legacyBody}
          onBodyChange={setLegacyBody} />
        <RequestForm title="New"
          method={newMethod}
          onMethodChange={setNewMethod}
          url={newURL}
          onUrlChange={setNewURL}
          body={newBody}
          onBodyChange={setNewBody} />

      <div className="btns">
          <input className="btn btn-confirm" type="submit" value="compare" />
      </div>
        
      </form>

      {oldData && newData
        ? <ReactJsonViewCompare oldData={oldData} newData={newData} />
        : <></>
      }
    </div>
  );
}

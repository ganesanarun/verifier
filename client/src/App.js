import './App.css';
import RequestForm from './Components/RequestForm'
import { invoke } from './services/ProxyService';

import React, { useState } from "react";
import ReactJsonViewCompare from "react-json-view-compare";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';


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
    <Container maxWidth={false}>
      <Grid container justifyContent="center">
        <Typography variant="h4" component="h1" color="primary" gutterBottom={true}>
          Verifier
        </Typography>
      </Grid>
      
      <form onSubmit={call}>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <RequestForm title="Legacy"
            onMethodChange={setLegacyMethod}
            method={legacyMethod}
            url={legacyURL}
            onUrlChange={setLegacyURL}
            body={legacyBody}
            onBodyChange={setLegacyBody} />
          </Grid>
          <Grid item md={6}>
            <RequestForm title="New"
            method={newMethod}
            onMethodChange={setNewMethod}
            url={newURL}
            onUrlChange={setNewURL}
            body={newBody}
            onBodyChange={setNewBody} />
        </Grid>
      </Grid>



      <Grid container justifyContent="center" sx={{ m: 2 }}>
        <Button color="primary" size="large" type="submit" onClick={call}  variant="contained">
          Compare
        </Button>
      </Grid>

      </form>

      {oldData && newData
        ? <ReactJsonViewCompare oldData={oldData} newData={newData} />
        : <></>
      }
    </Container>
  );
}

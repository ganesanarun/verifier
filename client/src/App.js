import './App.css';
import RequestForm from './Components/RequestForm'
import History from './Components/History'
import Headers from './Components/Headers'
import { invoke, getInvocationBy } from './services/ProxyService';
import * as constants from './services/constants';

import React, { useState } from "react";
import ReactJsonViewCompare from "react-json-view-compare";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';

export default function App() {
  const [legacyMethod, setLegacyMethod] = useState("GET");
  const [newMethod, setNewMethod] = useState("GET");
  const [legacyURL, setLegacyURL] = useState("http://localhost:8080/api/users");
  const [newURL, setNewURL] = useState("http://localhost:8080/api/users2");
  const [legacyBody, setLegacyBody] = useState(`{"a": "whatever"}`)
  const [newBody, setNewBody] = useState(`{"b": "whatever"}`)

  const [oldData, setOldData] = useState(null);
  const [newData, setNewData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [apiKey, setApiKey] = useState('');

  const populate = async (id) => {
    const invocation = await getInvocationBy(id);
    const { left, right } = invocation;
    console.log(invocation);
    setLegacyBody(JSON.stringify(left.body));
    setLegacyURL(left.url);
    setLegacyMethod(left.method);
    setNewBody(JSON.stringify(right.body));
    setNewURL(right.url);
    setNewMethod(right.method);
    setApiKey(left.headers[constants.API_HEADER])
  };

  const headers = {
    [constants.API_HEADER]: apiKey
  }



  const onRowEdit = (e) => {
    setApiKey(e.row.value);
  };

  const call = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOldData(null);
    setNewData(null);

    const requestDraft = {
      left: {
        url: legacyURL,
        method: legacyMethod,
        body: JSON.parse(legacyBody),
        headers
      },
      right: {
        url: newURL,
        method: newMethod,
        body: JSON.parse(newBody),
        headers
      }
    }
    try {
      const { left, right } = await invoke(requestDraft);
      setNewData(right);
      setOldData(left);
      setLoading(false);
    }
    catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  return (
    <Container maxWidth={false}>
      
      

      <History onSelect={populate} />
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

        <Headers onRowEdit={onRowEdit} apiKey={apiKey}/>
        
        <Grid container justifyContent="center" sx={{ m: 2 }}>
          <LoadingButton
            onClick={call}
            endIcon={<SendIcon />}
            loading={loading}
            loadingPosition="end"
            size="large"
            variant="contained"
          >Compare</LoadingButton>
        </Grid>

      </form>

      {oldData && newData
        ? <ReactJsonViewCompare oldData={oldData} newData={newData} />
        : <></>
      }
    </Container>
  );
}

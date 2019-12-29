import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MapViewer from './components/MapViewer';
import Layout from './Layout';
import HandleFileDrop from './components/HandleFileDrop';
import FarmView from './components/FarmView';
import Store from './Store';
import './App.css';

function Main() {
  return <h1>Please drop a savefile in here anywhere</h1>;
}

function App() {
  return (
    <Router>
      <Store.Container>
        <HandleFileDrop>
          <Layout>
            <Switch>
              <Route path="/" component={Main} exact />
              <Route path={`/foraging`} component={MapViewer} exact />
              <Route path={`/farm`} component={FarmView} exact />
            </Switch>
          </Layout>
        </HandleFileDrop>
      </Store.Container>
    </Router>
  );
}

export default App;

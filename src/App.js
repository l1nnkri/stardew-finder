import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MapViewer from './components/MapViewer';
import Layout from './Layout';
import HandleFileDrop from './components/HandleFileDrop';
import Store from './Store';
import './App.css';

function App() {
  return (
    <Router>
      <Store.Container>
        <Layout>
          <HandleFileDrop>
            <Switch>
              <Route path="/foraging">
                <MapViewer />
              </Route>
              <Route path="/farm">
                <h1>Hei</h1>
              </Route>
            </Switch>
          </HandleFileDrop>
        </Layout>
      </Store.Container>
    </Router>
  );
}

export default App;

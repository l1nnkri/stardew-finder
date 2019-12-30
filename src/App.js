import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ForageView from './components/ForageView';
import Layout from './Layout';
import HandleFileDrop from './components/HandleFileDrop';
import FarmView from './components/FarmView';
import BundleView from './components/BundleView';
import Store from './Store';
import { hot } from 'react-hot-loader/root';

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
              <Route path={`/foraging`} component={ForageView} exact />
              <Route path={`/farm`} component={FarmView} exact />
              <Route path={`/bundles`} component={BundleView} exact />
            </Switch>
          </Layout>
        </HandleFileDrop>
      </Store.Container>
    </Router>
  );
}

export default process.env.NODE_ENV !== 'production' ? hot(App) : App;

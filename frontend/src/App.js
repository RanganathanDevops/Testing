import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ACUnitList from './components/ACUnitList';
import ACUnitDetail from './components/ACUnitDetail';
import AddACUnit from './components/AddACUnit';
import AddMaintenance from './components/AddMaintenance';
import QRScanner from './components/QRScanner';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={ACUnitList} />
            <Route path="/add-ac" component={AddACUnit} />
            <Route path="/ac/:id/add-maintenance" component={AddMaintenance} />
            <Route path="/ac/:id" component={ACUnitDetail} />
            <Route path="/scan" component={QRScanner} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
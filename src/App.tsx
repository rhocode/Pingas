import React from 'react';

import logo from './logo.svg';
import './App.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';


const data = [{ name: 'Page A', success: 1, failure: 0 }, { name: 'Page B', success: 0, failure: 1 }, { name: 'Page C', success: 1, failure: 1 },]


function App() {

  return (
    <div className="App">
      <header className="App-header">
        <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="success" stroke="#00ff00" />
          <Line type="monotone" dataKey="failure" stroke="#ff0000" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
        </LineChart>
      </header>
    </div>
  );
}

export default App;

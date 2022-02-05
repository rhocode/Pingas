import React from 'react';

import './App.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import {createInitialState, updateState} from "./api";

function App() {
  const [state, setState] = React.useState(createInitialState());

  React.useEffect(() => {
    const interval = setInterval(async () => {
      const newState = await updateState(state);
      setState(newState);
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  let i = -23;
  const data = Object.keys(state).map(item => {
    return {
      name: i++,
      ...state[item]
    }
  })

  return (
    <div className="App">
      <header className="App-header">
        <LineChart width={1000} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="success" stroke="#00ff00" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis dataKey="failure" />
        </LineChart>
        <LineChart width={1000} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="failure" stroke="#ff0000" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis dataKey="failure" />
        </LineChart>
      </header>
    </div>
  );
}

export default App;

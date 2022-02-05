import React from 'react';

import './App.css';

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { createInitialState, updateState } from "./api";

type StatProps = {
  title: string,
  value: string
}

export const StatPanel = ({ title, value }: StatProps) => (
  <div className="statpanel">
    <h1>{value}</h1>
    <h3>{title}</h3>
  </div >
)


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
        <div className="stats">
          <StatPanel title={"Dropped 5s"} value={"1000"} />
          <StatPanel title={"Dropped Hour"} value={"1000"} />
          <StatPanel title={"Last Duration"} value={"10"} />
          <StatPanel title={"Last 24"} value={"10"} />
        </div>
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

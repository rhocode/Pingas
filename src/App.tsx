import React from 'react';

import './App.css';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
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
      setState(newState as any);
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  let i = -23;
  const data = Object.keys(state.data).map(item => {
    return {
      name: i++,
      ...state.data[item]
    }
  })

  const lastFiveDropped = state.signals.slice(115).reduce((prev, cur) => prev + (cur < 0 ? 1 : 0) , 0);
  const lastDropped = state.signals.reduce((prev, cur) => prev + (cur < 0 ? 1 : 0) , 0);
  const avg = Math.round(state.signals.slice(110).reduce((prev, cur) => prev + cur , 0) / 10);
  return (
    <div className="App">
      <header className="App-header">
        <div className="stats">
          <StatPanel title={"Dropped 5s"} value={`${lastFiveDropped}`} />
          <StatPanel title={"Dropped 120s"} value={`${lastDropped}`} />
          <StatPanel title={"Last Ping"} value={`${state.signals[119]}`} />
          <StatPanel title={"Avg Ping"} value={`${avg}`} />
        </div>
        <BarChart width={1000} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Bar dataKey="success" fill="#00ff00" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis dataKey="success" />
        </BarChart>
        <BarChart width={1000} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Bar dataKey="failure" fill="#ff0000" />
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis dataKey="failure" />
        </BarChart>
      </header>
    </div>
  );
}

export default App;

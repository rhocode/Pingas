import React from 'react';

import './App.css';

import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import {createInitialState, TimeData, updateState} from "./api";
import { useResizeDetector } from 'react-resize-detector';

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

enum AxisType {
  yAxis = "yAxis"
}

interface AxisLabelProps {
  axisType?: AxisType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  children?: any;
  stroke?: string;
  flip?: boolean;
  color?: string;
}

const AxisLabel = ({ axisType = AxisType.yAxis, color, x = 0, y = 0, width = 20, height = 20, stroke, children, flip = false }: AxisLabelProps) => {
  const isVert = axisType === 'yAxis';
  const cx = isVert ? x : x + (width / 2);
  const cy = isVert ? (height / 2) + y : y + height + 10;
  const rot = isVert ? `${flip ? 90 : 270} ${cx} ${cy}` : 0;
  return (
      <text fill={color} x={cx} y={cy} transform={`rotate(${rot})`} textAnchor="middle" stroke={stroke}>
        {children}
      </text>
  );
};

function App() {
  const [state, setState] = React.useState(() => {
    return JSON.parse(window.localStorage.getItem("state") || JSON.stringify(createInitialState())) as TimeData;
  });
  const { width, height, ref } = useResizeDetector();
  React.useEffect(() => {
    const interval = setInterval(async () => {
      const newState = await updateState(state);
      setState(newState as any);
      localStorage.setItem('state', JSON.stringify(newState));
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  let i = -23;
  const getName = (index: number) => {
    if (index === 0) return "Now";
    else {
      return index % 4 === 0 ? index + " hours" : ""
    }
  }
  const data = Object.keys(state.data).map(item => {
    return {
      name: getName(i++),
      ...state.data[item]
    }
  })

  const lastFiveDropped = state.signals.slice(115).reduce((prev, cur) => prev + (cur < 0 ? 1 : 0), 0);
  const lastDropped = state.signals.reduce((prev, cur) => prev + (cur < 0 ? 1 : 0), 0);
  const avg = Math.round(state.signals.slice(110).reduce((prev, cur) => prev + cur, 0) / 10);
  return (
    <div className="App">
        <div className="stats">
          <StatPanel title={"Dropped 5s"} value={`${lastFiveDropped}`} />
          <StatPanel title={"Dropped 120s"} value={`${lastDropped}`} />
          <StatPanel title={"Last Ping"} value={`${state.signals[119]}`} />
          <StatPanel title={"Avg Ping"} value={`${avg}`} />
        </div>
        <div className="dots">
          {
            state.signals.slice(100).map(item => item >= 0 ? <span className="green-dot">{item}</span> :
                <span className="red-dot">{item}</span>)
          }
        </div>
      <div className="charts-container" ref={ref}>
        <BarChart width={width} height={height} data={data}  margin={{
          top: 5,
          right: 20,
          left: 40,
          bottom: 20,
        }} >
          <Bar yAxisId="success" dataKey="success" fill="#00ff00" minPointSize={1} >
          </Bar>
          <Bar  yAxisId="failure" dataKey="failure" fill="#ff0000" minPointSize={1} >
          </Bar>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis label={<AxisLabel color={"#00ff00"} y={(height || 0) / 2 - 20} x={40}
                                   axisType={AxisType.yAxis}>Success</AxisLabel>}
                 type="number" yAxisId="success" dataKey="success" />
          <YAxis label={<AxisLabel color={"#ff0000"} flip y={(height || 0) / 2 - 25} x={(width || 0) - 40}
                                   axisType={AxisType.yAxis}>Failure</AxisLabel>}  type="number" yAxisId="failure"
                 orientation="right" dataKey="failure" />
        </BarChart>
      </div>
    </div>
  );
}

export default App;

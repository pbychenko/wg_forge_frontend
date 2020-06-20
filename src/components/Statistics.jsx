import React from 'react';

export default class Statistics extends React.Component {
  render() {
    const { data } = this.props;
    return (
      <>
        <tr>
            <td>Orders Count</td>
            <td colSpan="6">{data.count}</td>
        </tr>
        <tr>
            <td>Orders Total</td>
            <td colSpan="6">$ {data.total}</td>
        </tr>
        <tr>
            <td>Median Value</td>
            <td colSpan="6">$ {data.median}</td>
        </tr>
        <tr>
            <td>Average Check</td>
            <td colSpan="6">$ {data.average}</td>
        </tr>
        <tr>
            <td>Average Check (Female)</td>
            <td colSpan="6">$ {data.femaleAverage}</td>
        </tr>
        <tr>
            <td>Average Check (Male)</td>
            <td colSpan="6">$ {data.maleAverage}</td>
        </tr>
      </>
    );
  }
}

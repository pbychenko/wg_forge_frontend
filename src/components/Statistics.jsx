import React from 'react';

const Statistics = ({ data: { count, total, median, average, femaleAverage, maleAverage } }) => (
  <>
    <tr>
        <td>Orders Count</td>
        <td colSpan="6">{count}</td>
    </tr>
    <tr>
        <td>Orders Total</td>
        <td colSpan="6">$ {total}</td>
    </tr>
    <tr>
        <td>Median Value</td>
        <td colSpan="6">$ {median}</td>
    </tr>
    <tr>
        <td>Average Check</td>
        <td colSpan="6">$ {average}</td>
    </tr>
    <tr>
        <td>Average Check (Female)</td>
        <td colSpan="6">$ {femaleAverage}</td>
    </tr>
    <tr>
        <td>Average Check (Male)</td>
        <td colSpan="6">$ {maleAverage}</td>
    </tr>
  </>
);

export default Statistics;

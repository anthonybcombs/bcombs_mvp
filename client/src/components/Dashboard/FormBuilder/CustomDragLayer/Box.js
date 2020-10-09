import React from 'react';
const styles = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  cursor: 'move'
};
export default ({ title }) => {
  const backgroundColor = 'white';
  return <div style={{ ...styles, backgroundColor }}>{title}</div>;
};

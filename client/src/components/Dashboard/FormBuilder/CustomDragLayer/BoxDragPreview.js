import React, { memo } from 'react';
import Box from './Box';
const styles = {
  display: 'inline-block',
};
export default memo(({ title }) => {
  return (
    <div style={styles}>
      <Box title={title} />
    </div>
  );
});

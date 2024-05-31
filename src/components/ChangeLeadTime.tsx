import React from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import { Box } from '@material-ui/core';
import { ChangeLeadTime as CLT } from 'liatrio-react-dora';

export const ChangeLeadTime = () => {
  return (
    <InfoCard title="Change Lead Time">
      <Box position="relative">
        <Box display="flex" justifyContent="flex-end">
          <div style={{ width: '800px', height: '400px' }}>
            <CLT
              api=""
              data="[]"
            />
          </div>
        </Box>
      </Box>
    </InfoCard>
  );
};

import React from 'react';
import { InfoCard } from '@backstage/core-components';
import { Box } from '@material-ui/core';
import { DeploymentFrequency as DF } from 'liatrio-react-dora';
import { useEntity } from '@backstage/plugin-catalog-react';

export const DeploymentFrequency = () => {
  const entity = useEntity();
  
  return (
    <InfoCard title="Deployment Frequency">
      <Box position="relative">
        <Box display="flex" justifyContent="flex-end">
          <div style={{ width: '800px', height: '400px' }}>
            <DF
              api=""
              data="[]"
            />
          </div>
          <pre>{JSON.stringify(entity, null, 2)}</pre>
        </Box>
      </Box>
    </InfoCard>
  );
};

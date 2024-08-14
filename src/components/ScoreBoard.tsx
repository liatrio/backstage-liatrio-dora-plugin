import React from 'react';
import {
  InfoCard,
} from '@backstage/core-components';
import { Box } from '@material-ui/core';
import { RankThresholds, ScoreBoard as SB } from 'liatrio-react-dora';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import { genAuthHeaderValueLookup, getRepoName } from '../helper';

export const ScoreBoard = () => {
  const entity = useEntity();
  const configApi = useApi(configApiRef);
  const backendUrl = configApi.getString('backend.baseUrl');
  const dataEndpoint = configApi.getString("dora.dataEndpoint");
  const includeWeekends = configApi.getOptionalBoolean("dora.includeWeekends")
  const showDetails = configApi.getOptionalBoolean("dora.showDetails")
  const rankThresholds = configApi.getOptional("dora.rankThresholds") as RankThresholds
console.log(rankThresholds)
  const getAuthHeaderValue = genAuthHeaderValueLookup()
  
  const repoName = getRepoName(entity)
  const apiUrl = `${backendUrl}/api/proxy/dora/api/${dataEndpoint}`

  return (
    <InfoCard title="DORA: 30 Days At a Glance">
      <Box position="relative">
        <Box display="flex" justifyContent="flex-end">
          <div style={{ width: '100%' }}>
            { repoName === "" ?
              <div>DORA Metrics are not available for Non-GitHub repos currently</div>
            : 
              <SB
                api={apiUrl}
                getAuthHeaderValue={getAuthHeaderValue}
                repositories={[repoName]}
                showDetails={showDetails}
                includeWeekends={includeWeekends}
                measures={rankThresholds}
              />
            }
          </div>
        </Box>
      </Box>
    </InfoCard>
  );
};

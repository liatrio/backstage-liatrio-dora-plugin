import React, { useState, useEffect } from 'react'
import {
  InfoCard,
} from '@backstage/core-components'
import { Box, Grid } from '@material-ui/core'

import { RecoverTime, ChangeFailureRate, ChangeLeadTime, DeploymentFrequency, ScoreBoard, fetchData, getDateDaysInPast } from 'liatrio-react-dora'
import { useApi, configApiRef } from '@backstage/core-plugin-api'
import { fetchTeams, genAuthHeaderValueLookup } from '../helper'

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const addDynamicStyles = (className: string, styles: string) => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `.${className} { ${styles} }`;
  document.head.appendChild(styleElement);
};

export const TeamView = () => {
  const configApi = useApi(configApiRef)
  const backendUrl = configApi.getString('backend.baseUrl')
  const dataEndpoint = configApi.getString("dora.dataEndpoint")
  const teamListEndpoint = configApi.getString("dora.teamListEndpoint")
  const showWeekends = configApi.getOptionalBoolean("dora.showWeekends")
  const includeWeekends = configApi.getOptionalBoolean("dora.includeWeekends")
  const showDetails = configApi.getOptionalBoolean("dora.showDetails")

  const getAuthHeaderValue = genAuthHeaderValueLookup()

  const dataUrl = `${backendUrl}/api/proxy/dora/api/${dataEndpoint}`
  const teamListUrl = `${backendUrl}/api/proxy/dora/api/${teamListEndpoint}`

  const [teamIndex, setTeamIndex] = useState<number>(0)
  const [teams, setTeams] = useState<any[]>([{
      value: [], label: "Please Select"
    }])
  const [data, setData] = useState<any>()
  const [startDate, setStartDate] = useState<Date>(getDateDaysInPast(31))
  const [endDate, setEndDate] = useState<Date>(getDateDaysInPast(1))
  const [chartStartDate, setChartStartDate] = useState<Date>(getDateDaysInPast(31))
  const [chartEndDate, setChartEndDate] = useState<Date>(getDateDaysInPast(1))
  const [loading, setLoading] = useState<boolean>(true)

  const updateTeam = async ( value: any) => {
    const newIndex = teams.findIndex((range: { value: string; label: string }) => range.label === value.label)

    setTeamIndex(newIndex)

    if(!startDate || !endDate || newIndex === 0) {
      return
    }

    setLoading(true)

    await fetchData({
        api: dataUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: teams[newIndex].value,
        start: startDate,
        end: endDate,
      }, (data: any) => {
        setData(data)
        setLoading(false)
      }, (_) => {
        setLoading(false)
      })
  }

  const updateDateRange = async ( dates: any ) => {
    const [newStartDate, newEndDate] = dates;

    setStartDate(newStartDate)
    setEndDate(newEndDate)

    if(!newStartDate || !newEndDate || teamIndex === 0) {
      return
    }

    setLoading(true)

    await fetchData({
        api: dataUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: teams[teamIndex].value,
        start: newStartDate,
        end: newEndDate,
      }, (data: any) => {
        setData(data)
        setChartStartDate(newStartDate)
        setChartEndDate(newEndDate)
        setLoading(false)
      }, (_) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    addDynamicStyles('doraOptions', `overflow: visible`);
    addDynamicStyles('Dropdown-root', `width: 50%`);
    addDynamicStyles('react-datepicker__input-container input', `padding: 10px;`);

    setLoading(true)

    let fetch = async () => {
      fetchTeams(teamListUrl, getAuthHeaderValue,
        (data: any) => {
          let newList: any[] = [{label: "Please Select", value: []}]

          for(var entry of data.teams) {
            let newEntry = {
              label: entry.name,
              value: entry.repositories
            }

            newList.push(newEntry)
          }

          setTeams(newList)
          setLoading(false)
        },(_) => {
          setLoading(false)
        }
      )
    }

    fetch()
  }, []);

  return (
    <Grid container spacing={3} alignItems="stretch" style={{padding: "35px 10px 10px 35px", width: "100%"}} >
      <Grid container style={{marginBottom: "10px"}} spacing={3} alignItems="stretch">
        <Grid item md={6} style={{paddingBottom: "25px", overflow: "visible"}}>
          <InfoCard title="Options" className="doraOptions">
            <Box overflow="visible" position="relative">
              <Box overflow="visible" display="flex" justifyContent="center" alignItems="center">
                <div style={{width: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <label style={{paddingRight: "10px"}}>Select Date Range:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={updateDateRange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                  />
                </div>
                <div style={{width: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <label style={{paddingRight: "10px"}}>Select Team:</label>
                  <Dropdown options={teams} onChange={updateTeam} value={teams[teamIndex]} />
                </div>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
        <Grid item md={6}>
          <InfoCard title="DORA: At a Glance">
            <Box position="relative">
              <Box display="flex" justifyContent="flex-end">
                <div style={{ width: '100%' }}>
                  <ScoreBoard
                    data={data}
                    loading={loading}
                    showDetails={showDetails}
                    showWeekends={showWeekends}
                    includeWeekends={includeWeekends}
                    start={chartStartDate}
                    end={chartEndDate}
                  />
                </div>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
      </Grid>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={6}>
          <InfoCard title="Deployment Frequency">
            <Box position="relative">
              <Box display="flex" justifyContent="flex-end">
                <div style={{ width: '800px', height: '200px' }}>
                  <DeploymentFrequency
                    data={data}
                    loading={loading}
                    showDetails={showDetails}
                    showWeekends={showWeekends}
                    includeWeekends={includeWeekends}
                    start={chartStartDate}
                    end={chartEndDate}
                  />
                </div>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
        <Grid item md={6}>
          <InfoCard title="Change Lead Time">
            <Box position="relative">
              <Box display="flex" justifyContent="flex-end">
                <div style={{ width: '800px', height: '200px' }}>
                  <ChangeLeadTime
                    data={data}
                    loading={loading}
                    showDetails={showDetails}
                    showWeekends={showWeekends}
                    includeWeekends={includeWeekends}
                    start={chartStartDate}
                    end={chartEndDate}
                  />
                </div>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
        <Grid item md={6}>
          <InfoCard title="Change Failure Rate">
            <Box position="relative">
              <Box display="flex" justifyContent="flex-end">
                <div style={{ width: '800px', height: '200px' }}>
                  <ChangeFailureRate
                    data={data}
                    loading={loading}
                    showDetails={showDetails}
                    showWeekends={showWeekends}
                    includeWeekends={includeWeekends}
                    start={chartStartDate}
                    end={chartEndDate}
                  />
                </div>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
        <Grid item md={6}>
          <InfoCard title="Recover Time">
            <Box position="relative">
              <Box display="flex" justifyContent="flex-end">
                <div style={{ width: '800px', height: '200px' }}>
                  <RecoverTime
                    data={data}
                    loading={loading}
                    showDetails={showDetails}
                    showWeekends={showWeekends}
                    includeWeekends={includeWeekends}
                    start={chartStartDate}
                    end={chartEndDate}
                  />
                </div>
              </Box>
            </Box>
          </InfoCard>
        </Grid>
      </Grid>
    </Grid>
  )
}

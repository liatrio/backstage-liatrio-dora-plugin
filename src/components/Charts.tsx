import React, { useState, useEffect } from 'react'
import {
  InfoCard,
} from '@backstage/core-components'
import { Box, Grid } from '@material-ui/core'

import { RecoverTime, ChangeFailureRate, ChangeLeadTime, DeploymentFrequency, ScoreBoard, fetchData, getDateDaysInPast, calculateScores, calculateScoreColors, unknownFilter } from 'liatrio-react-dora'
import { useEntity } from '@backstage/plugin-catalog-react'
import { useApi, configApiRef } from '@backstage/core-plugin-api'
import { genAuthHeaderValueLookup, getRepoName } from '../helper'
import {makeStyles} from '@material-ui/core/styles'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ChartTitle } from './ChartTitle'

const useStyles = makeStyles((theme) => ({
  doraCalendar: {
    '& .react-datepicker__header': {
      backgroundColor: 'black',
    },
    '& .react-datepicker__month-container': {
      backgroundColor: 'black',
    },
    '& .react-datepicker__current-month': {
      color: 'white',
    },
    '& .react-datepicker__day': {
      backgroundColor: 'black',
      color: 'white',
      '&:hover': {
        backgroundColor: 'rgb(92, 92, 92)',
      },
    },
    '& .react-datepicker__day-name': {
      color: 'white',
    },
    '& .react-datepicker__day--in-range': {
      backgroundColor: 'green',
      '&:hover': {
        backgroundColor: 'rgb(0, 161, 0)',
      },
    },
    '& .react-datepicker__input-container input': {
      backgroundColor: 'black',
      color: 'white',
    },
    '& .react-datepicker': {
      borderWidth: '2px'
    },
  },
  doraContainer: {
    '& .doraCard > :first-child': {
      padding: '6px 16px 6px 20px'
    },
    '& .doraGrid': {
      paddingBottom: '0px'
    }
  }
}))

const addDynamicStyles = (className: string, styles: string) => {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = `.${className} { ${styles} }`;
  document.head.appendChild(styleElement);
};

export const Charts = () => {
  const entity = useEntity()
  const configApi = useApi(configApiRef)
  const backendUrl = configApi.getString('backend.baseUrl')
  const dataEndpoint = configApi.getString("dora.dataEndpoint")
  const showWeekends = configApi.getOptionalBoolean("dora.showWeekends")
  const includeWeekends = configApi.getOptionalBoolean("dora.includeWeekends")
  const showDetails = configApi.getOptionalBoolean("dora.showDetails")

  const getAuthHeaderValue = genAuthHeaderValueLookup()

  const apiUrl = `${backendUrl}/api/proxy/dora/api/${dataEndpoint}`

  const [repoName, setRepoName] = useState<string>("")
  const [data, setData] = useState<any>()
  const [startDate, setStartDate] = useState<Date>(getDateDaysInPast(31))
  const [endDate, setEndDate] = useState<Date>(getDateDaysInPast(1))
  const [chartStartDate, setChartStartDate] = useState<Date>(getDateDaysInPast(31))
  const [chartEndDate, setChartEndDate] = useState<Date>(getDateDaysInPast(1))
  const [loading, setLoading] = useState<boolean>(true)
  const [scores, setScores] = useState<any>({
    DFColor: unknownFilter,
    CLTColor: unknownFilter,
    CFRColor: unknownFilter,
    RTColor: unknownFilter,
    DFRate: 0,
    CLTRate: 0,
    CFRRate: 0,
    RTRate: 0,
  })
  const classes = useStyles()

  const updateDateRange = async ( dates: any ) => {
    const [newStartDate, newEndDate] = dates;

    setStartDate(newStartDate)
    setEndDate(newEndDate)

    if(!newStartDate || !newEndDate) {
      return
    }

    setLoading(true)

    await fetchData({
        api: apiUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: [repoName],
        start: newStartDate,
        end: newEndDate,
      }, (data: any) => {
        setData(data)
        setChartStartDate(newStartDate)
        setChartEndDate(newEndDate)
        setLoading(false)

        const scores = calculateScores({includeWeekends: includeWeekends}, data)
        const colors = calculateScoreColors({}, scores)

        setScores({
          DFRate: scores.df,
          CFRRate: scores.cfr,
          CLTRate: scores.clt,
          RTRate: scores.rt,
          DFColor: colors.df,
          CLTColor: colors.clt,
          CFRColor: colors.cfr,
          RTColor: colors.rt
        })
      }, (_) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    const repoName = getRepoName(entity)
    setRepoName(repoName)
    setLoading(true)

    let fetch = async () => {
      fetchData({
        api: apiUrl,
        getAuthHeaderValue: getAuthHeaderValue,
        repositories: [repoName],
        start: startDate,
        end: endDate,
      }, (data: any) => {
        setData(data)
        setLoading(false)

        const scores = calculateScores({includeWeekends: includeWeekends}, data)
        const colors = calculateScoreColors({}, scores)

        setScores({
          DFRate: scores.df,
          CFRRate: scores.cfr,
          CLTRate: scores.clt,
          RTRate: scores.rt,
          DFColor: colors.df,
          CLTColor: colors.clt,
          CFRColor: colors.cfr,
          RTColor: colors.rt
        })
      }, (_) => {
        setLoading(false)
      })
    }

    fetch()
  }, [])

  useEffect(() => {
    addDynamicStyles('doraOptions', `overflow: visible`);
    addDynamicStyles('Dropdown-root', `width: 50%`);
    addDynamicStyles('react-datepicker__input-container input', `padding: 10px;`);
    addDynamicStyles('chartHeader', `display: flex; justify-content: space-between; align-items: center; align-content: center;`);
  }, []);

  if(repoName === "") {
    return (<div>DORA Metrics are not available for Non-GitHub repos currently</div>)
  }

  const dfTitle = (<ChartTitle score={scores.DFRate} scorePostfix="hrs" color={scores.DFColor} title='Deployment Frequency' info='How often an organization successfully releases to production' />)
  const cfrTitle = (<ChartTitle score={scores.CFRRate} scorePostfix="%" color={scores.CFRColor} title='Change Failure Rate' info='The percentage of deployments causing a failure in production' />)
  const cltTitle = (<ChartTitle score={scores.CLTRate} scorePostfix="hrs" color={scores.CLTColor} title='Change Lead Time' info='The amount of time it takes a commit to get into production' />)
  const rtTitle = (<ChartTitle score={scores.RTRate} scorePostfix="hrs" color={scores.RTColor} title='Recovery Time' info='How long it takes an organization to recover from a failure in production' />)

  return (<div className={classes.doraContainer}>
    <Grid container style={{marginBottom: "12px"}} spacing={3} alignItems="stretch">
      <Grid item md={6} style={{paddingBottom: "25px", overflow: "visible"}}>
        <InfoCard title="Options" className="doraOptions doraCard">
          <Box overflow="visible" position="relative">
            <Box overflow="visible" display="flex" justifyContent="center" alignItems="center">
              <label style={{paddingRight: "10px"}}>Select Date Range:</label>
              <div className={classes.doraCalendar}>
                <DatePicker
                  selected={startDate}
                  onChange={updateDateRange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                />
              </div>
            </Box>
          </Box>
        </InfoCard>
      </Grid>
      <Grid item md={6} className='doraGrid'>
        <InfoCard title="DORA: At a Glance" className="doraCard" noPadding={true}>
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
      <Grid item md={6} className='doraGrid'>
        <InfoCard title={dfTitle} className="doraCard">
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
      <Grid item md={6} className='doraGrid'>
        <InfoCard title={cltTitle} className="doraCard">
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
        <InfoCard title={cfrTitle} className="doraCard">
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
        <InfoCard title={rtTitle} className="doraCard">
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
  </div>)
}

import React, { useState, useEffect } from 'react'
import {
  InfoCard,
} from '@backstage/core-components'
import { Box, Grid } from '@material-ui/core'
import { Tooltip } from "react-tooltip";
import { RecoverTime, ChangeFailureRate, ChangeLeadTime, DeploymentFrequency, ScoreBoard, fetchData, getDateDaysInPast, calculateScores, calculateDoraRanks, convertRankToColor, RankThresholds, getScoreDisplay } from 'liatrio-react-dora'
import { useEntity } from '@backstage/plugin-catalog-react'
import { useApi, configApiRef } from '@backstage/core-plugin-api'
import { fetchTeams, genAuthHeaderValueLookup, getRepoName } from '../helper'
import {makeStyles} from '@material-ui/core/styles'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ChartTitle } from './ChartTitle'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const useStyles = makeStyles(() => ({
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
      padding: '10px',
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
    },
    '& .Dropdown-root': {
      width: '50%'
    },
    '& .Dropdown-control': {
      backgroundColor: 'black',
      color: 'white'
    },
    '& .Dropdown-option is-selected': {
      backgroundColor: 'green',
      color: 'black'
    },
    '& .Dropdown-option': {
      backgroundColor: 'black',
      color: 'white'
    },
    '& .Dropdown-option:hover': {
      backgroundColor: 'green',
      color: 'white'
    },
    '& .Dropdown-menu': {
      backgroundColor: 'black'
    },
    '& .doraOptions': {
      overflow: 'visible'
    }
  },
  pageView: {
    padding: '10px'
  }
}))

export interface ChartProps {
  showTeamSelection?: boolean
}

const defaultScores = {
  DFColor: convertRankToColor(10),
  CLTColor: convertRankToColor(10),
  CFRColor: convertRankToColor(10),
  RTColor: convertRankToColor(10),
  DFScore: NaN,
  CLTScore: NaN,
  CFRScore: NaN,
  RTScore: NaN,
  DFDisplay: '?',
  RTDisplay: '?',
  CFRDisplay: '?',
  CLTDisplay: '?',
}

export const Charts = (props: ChartProps) => {
  const entity = !props.showTeamSelection ? useEntity() : null
  const configApi = useApi(configApiRef)
  const backendUrl = configApi.getString('backend.baseUrl')
  const dataEndpoint = configApi.getString("dora.dataEndpoint")
  const teamListEndpoint = configApi.getString("dora.teamListEndpoint")
  const showWeekends = configApi.getOptionalBoolean("dora.showWeekends")
  const includeWeekends = configApi.getOptionalBoolean("dora.includeWeekends")
  const showDetails = configApi.getOptionalBoolean("dora.showDetails")
  const rankThresholds = configApi.getOptional("dora.rankThresholds") as RankThresholds
  const teamsList = configApi.getOptional("dora.teams") as string[]

  const getAuthHeaderValue = genAuthHeaderValueLookup()

  const apiUrl = `${backendUrl}/api/proxy/dora/api/${dataEndpoint}`
  const teamListUrl = `${backendUrl}/api/proxy/dora/api/${teamListEndpoint}`

  const [teamIndex, setTeamIndex] = useState<number>(0)
  const [teams, setTeams] = useState<any[]>([{
      value: "", label: "Please Select"
    }])
  const [repoName, setRepoName] = useState<string>("")
  const [data, setData] = useState<any>()
  const [startDate, setStartDate] = useState<Date>(getDateDaysInPast(31))
  const [endDate, setEndDate] = useState<Date>(getDateDaysInPast(1))
  const [chartStartDate, setChartStartDate] = useState<Date>(getDateDaysInPast(31))
  const [chartEndDate, setChartEndDate] = useState<Date>(getDateDaysInPast(1))
  const [loading, setLoading] = useState<boolean>(true)
  const [scores, setScores] = useState<any>({...defaultScores})

  const classes = useStyles()

  const getScores = (data: any) => {
    const scores = calculateScores({includeWeekends: includeWeekends}, data)
    const ranks = calculateDoraRanks({measures: rankThresholds}, scores)

    setScores({
      DFScore: scores.df,
      CFRScore: scores.cfr,
      CLTScore: scores.clt,
      RTScore: scores.rt,
      DFColor: convertRankToColor(ranks.df),
      CLTColor: convertRankToColor(ranks.clt),
      CFRColor: convertRankToColor(ranks.cfr),
      RTColor: convertRankToColor(ranks.rt),
      DFDisplay: getScoreDisplay(scores.df),
      RTDisplay: getScoreDisplay(scores.rt),
      CFRDisplay: getScoreDisplay(scores.cfr, 'cfr'),
      CLTDisplay: getScoreDisplay(scores.clt),
    })
  }

  const makeFetchOptions = (start: Date, end: Date, team?: String, repo?: String) => {
    let fetchOptions: any = {
      api: apiUrl,
      getAuthHeaderValue: getAuthHeaderValue,
      start: start,
      end: end,
    }

    if(!props.showTeamSelection) {
      fetchOptions.repositories = [repo]
    } else {
      fetchOptions.team = team
    }

    return fetchOptions
  }

  const updateTeam = async ( value: any) => {
    const newIndex = teams.findIndex((range: { value: string; label: string }) => range.label === value.label)

    setTeamIndex(newIndex)

    if(!startDate || !endDate) {
      return
    }

    if(newIndex === 0) {
      setData([])
      setScores({...defaultScores})
      return
    }

    const fetchOptions = makeFetchOptions(startDate, endDate, teams[newIndex]?.value, repoName)

    setLoading(true)

    await fetchData(fetchOptions, (data: any) => {
        setData(data)
        setLoading(false)
        getScores(data)
      }, (_) => {
        setLoading(false)
      })
  }

  const updateDateRange = async ( dates: any ) => {
    const [newStartDate, newEndDate] = dates;

    setStartDate(newStartDate)
    setEndDate(newEndDate)

    if(!newStartDate || !newEndDate || (props.showTeamSelection && teamIndex === 0)) {
      return
    }

    const fetchOptions = makeFetchOptions(newStartDate, newEndDate)

    setLoading(true)

    await fetchData(fetchOptions, (dora_data: any) => {
        setData(dora_data)
        setChartStartDate(newStartDate)
        setChartEndDate(newEndDate)
        setLoading(false)

        getScores(dora_data)
      }, (_) => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    
    let repoName = ""

    if(!props.showTeamSelection) {
      repoName = getRepoName(entity)
      setRepoName(repoName)

      if(!repoName) {
        setLoading(false)
        return
      }
    }

    let fetch = props.showTeamSelection ?
      async () => {
        if(teamsList && teamsList.length > 0) {
          let teamsEntires = [{
            value: "", label: "Please Select"
          }];
    
          for(const team of teamsList) {
            teamsEntires.push({
              value: team, label: team
            })
          }
    
          setTeams(teamsEntires)
        } else {
          fetchTeams(teamListUrl, getAuthHeaderValue,
            (teams_data: any) => {
              let newList: any[] = [{label: "Please Select", value: ""}]

              for(var entry of teams_data.teams) {
                let newEntry = {
                  label: entry,
                  value: entry
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
      }
    :
      async () => {
        const fetchOptions = makeFetchOptions(startDate, endDate, teams[teamIndex]?.value, repoName)

        fetchData(fetchOptions, (dora_data: any) => {
          setData(dora_data)
          setLoading(false)

          getScores(dora_data)
        }, (_) => {
          setLoading(false)
        })
      }

    fetch()
  }, [])

  if(repoName === "" && !props.showTeamSelection) {
    return (<div>DORA Metrics are not available for Non-GitHub repos currently</div>)
  }

  const dfTitle = (<ChartTitle scoreDisplay={scores.DFDisplay} color={scores.DFColor} title='Deployment Frequency' info='How often an organization successfully releases to production' />)
  const cfrTitle = (<ChartTitle scoreDisplay={scores.CFRDisplay} color={scores.CFRColor} title='Change Failure Rate' info='The percentage of deployments causing a failure in production' />)
  const cltTitle = (<ChartTitle scoreDisplay={scores.CLTDisplay} color={scores.CLTColor} title='Change Lead Time' info='The amount of time it takes a commit to get into production' />)
  const rtTitle = (<ChartTitle scoreDisplay={scores.RTDisplay} color={scores.RTColor} title='Recovery Time' info='How long it takes an organization to recover from a failure in production' />)

  const containerClass = props.showTeamSelection ? `${classes.doraContainer} ${classes.pageView}` : classes.doraContainer

  return (<div className={containerClass}>
    <Tooltip
      id="metric_tooltip"
      place="bottom"
      border="1px solid white"
      opacity="1"
      style={{ borderRadius: "10px", maxWidth: "300px", padding: "10px", zIndex: "100", backgroundColor: "#000000" }}
    />
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
              {props.showTeamSelection &&
                <div style={{width: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <label style={{paddingRight: "10px"}}>Select Team:</label>
                  <Dropdown options={teams} onChange={updateTeam} value={teams[teamIndex]} />
                </div>
              }
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
                  measures={rankThresholds}
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

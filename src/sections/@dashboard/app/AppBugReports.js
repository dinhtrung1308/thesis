import React, { useState, useEffect } from 'react';

// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../utils/formatNumber';
//
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.error.darker,
  backgroundColor: theme.palette.error.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.error.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0)} 0%, ${alpha(
    theme.palette.error.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 234;
function getCurrentDate() {
  const d = new Date();
  const currentDate = String(d.getDate());
  const currentMonth = String(d.getMonth() + 1);
  const currentYear = String(d.getFullYear());
  const today = currentYear.concat('/', currentMonth, '/', currentDate);
  return today;
}
export default function AppBugReports() {
  const [data, setData] = useState({});
  const [startDay, setStartDay] = useState(getCurrentDate);

  const token = sessionStorage.getItem('token');
  const [refresh, setRefresh] = useState(false);
  const getData = async () => {
    const response = await fetch(
      `https://dutru-kitchen.online/api/performance/dishes-cooking-time?start=${startDay}`,
      {
        method: 'GET',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        })
      }
    );
    const FinalData = await response.json();
    setData(FinalData);
  };
  useEffect(() => {
    // if (data && !refresh) {
    //   return;
    // }
    getData();
  }, [refresh]);
  useEffect(() => {
    if (refresh) {
      setTimeout(() => {
        setRefresh(false);
      }, 50);
    }
  }, [refresh]);
  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="ic:outline-watch-later" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{fShortenNumber(TOTAL)}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Late Dishes
      </Typography>
    </RootStyle>
  );
}

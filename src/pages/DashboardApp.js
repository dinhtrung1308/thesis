// material
import React, { useState, useEffect } from 'react';

import { Box, Grid, Container, Typography, Stack } from '@mui/material';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../sections/@dashboard/app';

// ----------------------------------------------------------------------
function getCurrentDate() {
  const d = new Date();
  const currentDate = String(d.getDate());
  const currentMonth = String(d.getMonth() + 1);
  const currentYear = String(d.getFullYear());
  const today = currentDate.concat('-', currentMonth, '-', currentYear);
  return today;
}
export default function DashboardApp(messsage) {
  console.log(messsage);
  return (
    <Page title="Dashboard">
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
          style={{
            backgroundColor: 'rgba(247, 158, 46, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(5px)',
            padding: '10px'
          }}
        >
          <Typography variant="h4" gutterBottom style={{ color: '#1C3F63' }}>
            Hi, Welcome back !
          </Typography>
          <Typography variant="h6" style={{ color: '#1C3F63' }}>
            {'Today: '} {getCurrentDate()}
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <AppWeeklySales />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <AppItemOrders />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

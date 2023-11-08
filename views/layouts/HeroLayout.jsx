import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import HeroCard from '../components/HeroCard'
import HeroFooter from '../components/HeroFooter'
import './HeroLayout.css'

const HeroLayout = () => {
  return (
    <Box className="HeroLayout_container">
      <Box className="HeroLayout_main">
        <HeroCard />
        <Outlet />
      </Box>
      <HeroFooter />
    </Box>
  )
}

export default HeroLayout

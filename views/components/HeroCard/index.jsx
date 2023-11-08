import React from 'react'
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material'
import { ArrowForwardOutlined } from '@mui/icons-material'
import './HeroCard.css'

const HeroCard = () => {
  return (
    <Card raised={false} className="HeroCard_container">
      <CardMedia className="HeroCard_image" image="/img/dpdash.png" />
      <CardContent className="HeroCard_content">
        <Typography gutterBottom={false} variant="subtitle1">
          DPdash is a Deep/Digital Phenotyping Dashboard designed to manage and
          visualize multiple data streams coming in continuously over extended
          periods of time in individuals.
        </Typography>
      </CardContent>
      <CardActions className="HeroCard_actions">
        <Button
          className="HeroCard_button"
          size="small"
          endIcon={<ArrowForwardOutlined />}
          variant="outlined"
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default HeroCard

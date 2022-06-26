import React from 'react'
import { createRoot } from 'react-dom/client'
import StudyDetails from './StudyDetails.react'

const container = document.getElementById('study_details')
const root = createRoot(container)

root.render(<StudyDetails />)

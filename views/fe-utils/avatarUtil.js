import React from 'react'
import Avatar from '@mui/material/Avatar'
import Person from '@mui/icons-material/AccountCircle'

const getAvatar = ({ user }) => {
  const { icon, name, uid } = user
  if (icon == '' || icon == undefined) {
    if (name == '' || name == undefined) {
      if (uid && uid.length > 0) {
        return <Avatar style={{ width: 60, height: 60 }}>{uid[0]}</Avatar>
      } else {
        return (
          <Avatar style={{ width: 60, height: 60, backgroundColor: '#c0d9e1' }}>
            <Person />
          </Avatar>
        )
      }
    } else {
      return (
        <Avatar style={{ width: 60, height: 60, backgroundColor: '#c0d9e1' }}>
          {name[0]}
        </Avatar>
      )
    }
  } else {
    return <Avatar style={{ width: 60, height: 60 }} src={icon}></Avatar>
  }
}

export default getAvatar

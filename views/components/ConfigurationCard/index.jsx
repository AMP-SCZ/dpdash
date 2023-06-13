import {
  Card,
  CardHeader,
  Divider,
  Typography,
  CardActions,
  Switch,
  IconButton,
} from '@material-ui/core'
import { Edit, Clear, Copy, Share } from '@material-ui/icons'
import FullView from '@material-ui/icons/AspectRatio'
import ConfigCardAvatar from '../ConfigurationCardAvatar'

const ConfigurationCard = (props) => {
  return (
    <Card style={{ margin: '3px' }}>
      <CardHeader
        title={configs[item]['owner']}
        subheader={updated}
        avatar={<ConfigCardAvatar config={configs[item]} currentUser={user} />}
        action={
          <IconButton
            onClick={() => {
              if (ownsConfig) {
                removeConfig(configs, item, _id)
              } else {
                const configAttributes = {
                  readers: config.readers.filter(
                    (reader) => reader !== user.uid
                  ),
                }
                updateConfiguration(_id, configAttributes)
              }
            }}
          >
            <Clear color="rgba(0, 0, 0, 0.54)" />
          </IconButton>
        }
      />
      <Divider />
      <div style={{ padding: '16px 24px' }}>
        <Typography variant="headline" component="h3">
          {configs[item]['name']}
        </Typography>
        <Typography
          style={{
            color: 'rgba(0, 0, 0, 0.54)',
          }}
          component="p"
        >
          {configs[item]['type']}
        </Typography>
      </div>
      <CardActions>
        <div
          style={{
            padding: '0px',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          <div style={{ float: 'right' }}>
            {ownsConfig ? (
              <IconButton
                onClick={() => openNewWindow(routes.editConfiguration(_id))}
                iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                tooltipPosition="top-center"
                tooltip="Edit"
              >
                <Edit />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => openNewWindow(routes.viewConfiguration(_id))}
                iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                tooltipPosition="top-center"
                tooltip="View"
              >
                <FullView />
              </IconButton>
            )}
            {ownsConfig ? (
              <IconButton
                iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                tooltipPosition="top-center"
                tooltip="Share"
                onClick={() =>
                  openSearchUsers(
                    item,
                    configs[item]['_id'],
                    configs[item]['readers'],
                    configs[item]['owner']
                  )
                }
              >
                <Share />
              </IconButton>
            ) : (
              <IconButton
                iconStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                tooltipPosition="top-center"
                tooltip="Duplicate"
                onClick={() => copyConfig(configs[item])}
              >
                <Copy />
              </IconButton>
            )}
          </div>
          <FormControlLabel
            control={
              <Switch
                style={{
                  width: 'auto',
                }}
                labelStyle={{ color: 'rgba(0, 0, 0, 0.54)' }}
                checked={
                  'config' in preference
                    ? configs[item]['_id'] == preference['config']
                    : false
                }
                onChange={(e, isInputChecked) =>
                  changeDefaultConfig(e, isInputChecked, item)
                }
              />
            }
            label="Default"
          />
        </div>
      </CardActions>
    </Card>
  )
}

export default ConfigurationCard

import { ObjectId } from 'mongodb'

import ConfigModel from '../../models/ConfigModel'
import UserModel from '../../models/UserModel'

const ConfigurationsController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const newConfiguration = await ConfigModel.create(appDb, {
        ...req.body,
        created: new Date().toUTCString(),
      })

      return res.status(200).json({ data: newConfiguration })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  destroy: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      await ConfigModel.destroy(appDb, config_id)

      return res.status(204).end()
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  findOne: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const currentConfig = await ConfigModel.findOne(appDb, {
        _id: new ObjectId(config_id),
      })
      return res.status(200).json({ data: currentConfig })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const updatedConfiguration = await ConfigModel.update(appDb, config_id, {
        ...req.body,
        updatedAt: new Date().toISOString(),
      })

      return res.status(200).json({ data: updatedConfiguration })
    } catch (error) {
      return res.status(422).json({ error: error.message })
    }
  },
  index: async (req, res) => {
    try {
      const dataSet = new Set()
      const { appDb } = req.app.locals
      const { uid } = req.params
      const streamConfigurations = await ConfigModel.index(appDb, uid)

      streamConfigurations.on('data', async (config) => {
        //Pause the stream to complete async operations
        streamConfigurations.pause()

        const configOwner = await UserModel.findOne(
          appDb,
          { uid: config.owner },
          { display_name: 1 }
        )

        dataSet.add({ ...config, owner_display_name: configOwner.display_name })

        // resume stream after async operation has completed
        streamConfigurations.resume()
      })

      await new Promise((resolve, reject) => {
        streamConfigurations.on('end', () => resolve())

        streamConfigurations.on('error', (err) => reject(err))
      })

      return res.status(200).json({ data: Array.from(dataSet) })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default ConfigurationsController

import ConfigModel from '../../models/ConfigModel'

const ConfigurationsController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { insertedId } = await ConfigModel.save(appDb, req.body)

      if (insertedId) {
        const query = { _id: insertedId }
        const newConfiguration = await ConfigModel.findOne(appDb, query)

        return res.json({ data: newConfiguration, status: 200 })
      }

      if (!insertedId) return res.json({ status: 500 })
    } catch (error) {
      return res.json({ error: error.message, status: 400 })
    }
  },
  destroy: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const { deletedCount } = await ConfigModel.destroy(appDb, config_id)

      return deletedCount >= 1
        ? res.json({ status: 200 })
        : res.json({ status: 404 })
    } catch (error) {
      res.json({ error: error.message, status: 400 })
    }
  },
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const { value } = await ConfigModel.update(appDb, config_id, req.body)

      return value
        ? res.json({ data: value, status: 200 })
        : res.json({ status: 400 })
    } catch (error) {
      return res.json({ error: error.message, status: 500 })
    }
  },
  index: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const data = await ConfigModel.index(appDb, uid)

      return res.json({ data, status: 200 })
    } catch (error) {
      return res.json({ error: error.message, status: 400 })
    }
  },
}

export default ConfigurationsController

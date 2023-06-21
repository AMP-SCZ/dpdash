import ConfigModel from '../../models/ConfigModel'

const ConfigurationsController = {
  create: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { insertedId } = await ConfigModel.save(appDb, req.body)

      if (insertedId) {
        const query = { _id: insertedId }
        const newConfiguration = await ConfigModel.findOne(appDb, query)

        return res.status(200).json({ data: newConfiguration })
      }

      if (!insertedId) return res.status(500).end()
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
  destroy: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const { deletedCount } = await ConfigModel.destroy(appDb, config_id)

      return deletedCount >= 1 ? res.status(200).end() : res.status(404).end()
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },
  update: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { config_id } = req.params
      const { value } = await ConfigModel.update(appDb, config_id, req.body)

      return value
        ? res.status(200).json({ data: value })
        : res.status(400).end()
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }
  },
  index: async (req, res) => {
    try {
      const { appDb } = req.app.locals
      const { uid } = req.params
      const data = await ConfigModel.index(appDb, uid)

      return res.status(200).json({ data })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default ConfigurationsController

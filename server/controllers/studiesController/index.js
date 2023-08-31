import StudiesModel from '../../models/StudiesModel'

const StudiesController = {
  index: async (req, res) => {
    try {
      const { dataDb } = req.app.locals
      const studies = await StudiesModel.all(dataDb)

      return res.status(200).json({ data: studies })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  },
}

export default StudiesController
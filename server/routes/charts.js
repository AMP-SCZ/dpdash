import { Router } from 'express';

import ensureAuthenticated from '../utils/passport/ensure-authenticated';
import { collections } from '../utils/mongoCollections'
import { userProps } from '../utils/pagePropsUtil';

import chartsListPage from '../templates/Chart.template'
import newChartPage from '../templates/NewChart.template'

const router = Router();

router.route('/charts')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      return res.status(200).send(chartsListPage())
    } catch (error) {
      console.error(error.message)

      return res.status(500).send({ message: err.message })
    }
  });
  
router.route('/charts/new')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const user = userProps(req)

      return res.status(200).send(newChartPage(user))
    } catch (error) {
      console.error(error.message)

      return res.status(500).send({ message: err.message })
    }
})

router.route('/api/v1/charts')
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const additionalVariables = {}
      const { fieldLabelValueMap, title, variable, assessment } = req.body
      
      if (fieldLabelValueMap.length) {
        for (let index = 0; index < fieldLabelValueMap.length; index++) {
          const field = fieldLabelValueMap[index];
          additionalVariables[field.label] = field.value
        }
      }

      const { dataDb } = req.app.locals
      const { result } = await dataDb
        .collection(collections.charts)
        .insertOne({
          title, 
          variable, 
          assessment, 
          owner: req.user, 
          ...additionalVariables 
        })

      return res.status(200).json({ data: result })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })

export default router

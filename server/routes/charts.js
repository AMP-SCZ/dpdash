import { Router } from 'express';

import ensureAuthenticated from '../utils/passport/ensure-authenticated';
import { collections } from '../utils/mongoCollections'

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
      const { display_name, role, icon } = req.session;
      const user = {
        uid: req.user,
        name: display_name,
        role, 
        icon,
      };

      return res.status(200).send(newChartPage(user))
    } catch (error) {
      console.error(error.message)

      return res.status(500).send({ message: err.message })
    }
})

router.route('/api/v1/chart-create')
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const additionalVariables = {}
      const { fields, title, variable, assessment, owner } = req.body
      
      if (fields.length) {
        for (let index = 0; index < fields.length; index++) {
          const field = fields[index];
          additionalVariables[field.label] = field.value
        }
      }

      const dataDb = req.app.locals.dataDb
      const { result } = await dataDb
        .collection(collections.charts)
        .insertOne({
          title, 
          variable, 
          assessment, 
          owner, 
          ...additionalVariables 
        })

      return res.status(200).json({ data: result })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })

export default router

import { Router } from 'express';

import ensureAuthenticated from '../utils/passport/ensure-authenticated';

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

export default router

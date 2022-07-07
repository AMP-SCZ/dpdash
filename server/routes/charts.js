import { Router } from 'express';
import { ObjectID } from 'mongodb';

import ensureAuthenticated from '../utils/passport/ensure-authenticated';
import { collections } from '../utils/mongoCollections'
import { userFromRequest } from '../utils/userFromRequestUtil';

import chartsListPage from '../templates/Chart.template'
import newChartPage from '../templates/NewChart.template'
import viewChartPage from '../templates/ViewChart.template';

const router = Router();

router.route('/charts')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const user = userFromRequest(req)

      return res.status(200).send(chartsListPage(user))
    } catch (err) {
      console.error(err.message)

      return res.status(500).send({ message: err.message })
    }
  });

router.route('/charts/new')
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const user = userFromRequest(req)

      return res.status(200).send(newChartPage(user))
    } catch (error) {
      console.error(error.message)

      return res.status(500).send({ message: err.message })
    }
})

router.route('/charts/:chart_id')
  .get(ensureAuthenticated, async(req,res) => {
    try {
      const data = []
      const { dataDb, appDb } = req.app.locals
      const { chart_id } = req.params
      const { access } =  await appDb
        .collection(collections.users)
        .findOne(
          { uid: req.user },
          { _id: 0, access: 1 }
        )
      const { assessment, variable, fieldLabelValueMap, title } = await dataDb
        .collection(collections.charts)
        .findOne({ _id: new ObjectID(chart_id) })

      for await (const field of fieldLabelValueMap) {
        const interim = []

        for await (const study of access ){
          let count = 0;
          const { label, value } = field;
          const subjectList = await dataDb
            .collection(collections.toc)
            .find({ assessment, study }, { projection: { collection: 1, subject: 1, study: 1, _id: 0 }})
            .map(doc => ({ ...doc, variable }))
            .toArray()

            for await (const doc of subjectList) {
              const { collection, study, variable, subject } = doc
              const counted = await dataDb
                .collection(collection)
                .findOne({ site: study, [variable]: value, subject_id: subject }, { projection: { [variable]: 1, _id: 0 }})
              count = counted ? count+=1 : count
            }
            interim.push({ count, siteName: study, fieldLabel: label })
          }
          data.push(interim)
        }
      const user = userFromRequest(req)
      const graph = { chart_id, data, title }
      return res.status(200).send(viewChartPage(user, graph))
    } catch (err) {
      console.error(err.message)

      return res.status(500).send({ message: err.message })
    }
  })

router.route('/api/v1/charts')
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { fieldLabelValueMap, title, variable, assessment } = req.body
      const { dataDb } = req.app.locals
      const { insertedId } = await dataDb
        .collection(collections.charts)
        .insertOne({
          title, 
          variable, 
          assessment, 
          owner: req.user, 
          fieldLabelValueMap 
        })

      return res.status(200).json({ data: { chart_id: insertedId }})
    } catch (error) {
      console.error(error)

      return res.status(500).json({ message: error.message })
    }
  })

export default router

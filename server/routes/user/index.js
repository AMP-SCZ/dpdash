import { Router } from 'express'
import {
  addSubjectToSiteSubjectsComplete,
  removeSiteSubject,
  addSubjectToSiteSubjectsStarred,
} from './helpers'
import ensureAuthenticated from '../../utils/passport/ensure-authenticated'
import { routerRoutes } from '../../utils/routes'

const router = Router()

router
  .route(routerRoutes.userSiteSubjects)
  .get(ensureAuthenticated, async (req, res) => {
    try {
      const { prisma } = req.app.locals
      const { siteSubjects } = await prisma.users.findUnique({
        where: { uid: req.params.uid },
        select: { siteSubjects: true },
      })

      return res.status(200).json({ data: siteSubjects })
    } catch (error) {
      console.error(error.stack)

      return res.status(500).send({ message: error.message })
    }
  })

router
  .route(routerRoutes.userSiteSubjectsStar)
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { prisma } = req.app.locals
      const user = await prisma.users.findUnique({
        where: { uid: req.params.uid },
        select: {
          siteSubjects: true,
        },
      })
      const { siteSubjects } = user

      await prisma.users.update({
        where: { uid: req.params.uid },
        data: {
          siteSubjects: addSubjectToSiteSubjectsStarred(siteSubjects, req.body),
        },
      })

      return res.status(200).json({ message: 'Added Subject' })
    } catch (error) {
      console.error(error.stack)

      return res.status(500).send({ message: error.message })
    }
  })
  .delete(ensureAuthenticated, async (req, res) => {
    try {
      const { prisma } = req.app.locals
      const user = await prisma.users.findUnique({
        where: { uid: req.params.uid },
        select: {
          siteSubjects: true,
        },
      })
      const { siteSubjects } = user
      const siteSubjectSiteIndex = siteSubjects.findIndex(
        (siteSubject) => siteSubject.site === req.body.site
      )
      siteSubjects[siteSubjectSiteIndex].starredSubjects = removeSiteSubject(
        siteSubjects[siteSubjectSiteIndex].starredSubjects,
        req.body.subject
      )

      await prisma.users.update({
        where: { uid: req.params.uid },
        data: { siteSubjects },
      })

      return res.status(200).json({ message: 'Removed subject' })
    } catch (error) {
      console.error(error.stack)

      return res.status(500).send({ message: error.message })
    }
  })

router
  .route(routerRoutes.userSiteSubjectsComplete)
  .post(ensureAuthenticated, async (req, res) => {
    try {
      const { prisma } = req.app.locals
      const user = await prisma.users.findUnique({
        where: { uid: req.params.uid },
        select: {
          siteSubjects: true,
        },
      })
      const { siteSubjects } = user

      await prisma.users.update({
        where: { uid: req.params.uid },
        data: {
          siteSubjects: addSubjectToSiteSubjectsComplete(
            siteSubjects,
            req.body
          ),
        },
      })

      return res.status(200).json({ message: 'Completed subject' })
    } catch (error) {
      console.error(error)

      return res.status(500).send({ message: error.message })
    }
  })
  .delete(ensureAuthenticated, async (req, res) => {
    try {
      const { prisma } = req.app.locals
      const user = await prisma.users.findUnique({
        where: { uid: req.params.uid },
        select: {
          siteSubjects: true,
        },
      })
      const { siteSubjects } = user
      const siteSubjectSiteIndex = siteSubjects.findIndex(
        (siteSubject) => siteSubject.site === req.body.site
      )
      siteSubjects[siteSubjectSiteIndex].completedSubjects = removeSiteSubject(
        siteSubjects[siteSubjectSiteIndex].completedSubjects,
        req.body.subject
      )
      await prisma.users.update({
        where: { uid: req.params.uid },
        data: { siteSubjects },
      })

      return res.status(200).json({ message: 'Incompleted Subject' })
    } catch (error) {
      console.error(error.stack)

      return res.status(500).send({ message: error.message })
    }
  })

export default router

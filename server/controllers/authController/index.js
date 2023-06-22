const AuthController = {
  show: async (req, res) => {
    return res.status(200).json({ data: req.app.locals.currentUser })
  },
}

export default AuthController

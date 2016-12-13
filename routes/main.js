var router = require('express').Router()
var userInfo = {
    id: 1,
    account: 'example@163.com',
    password: '111111'
}

router.get('/test', (req, res) => {
  console.log(req.body);
  res.json(req.query)
})
router.post('/login', (req, res) => {
  console.log(req.body);
  if(req.body.account == userInfo.account && req.body.password == userInfo.password){
      req.session.userInfo = userInfo.id
      res.status(200).json({msg:'login success'})
  }else{
      res.status(400).json({msg:'login fail'})
  }
})

module.exports = router
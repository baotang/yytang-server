var router = require('express').Router()
var userInfo = {
    id: 1,
    name: '刘诗诗',
    account: 'example@163.com',
    password: '111111'
}

router.get('/test', (req, res) => {
  console.log(req.body);
  res.json(req.query)
})

router.post('/login', (req, res) => {
  if(req.body.account == userInfo.account && req.body.password == userInfo.password){
      req.session.userID = userInfo.id
      res.status(200).json({user:{id:userInfo.id,name:userInfo.name}})
  }else{
      res.status(200).json({msg:'login fail'})
  }
})

module.exports = router
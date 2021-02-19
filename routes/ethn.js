var express= require('express')
var path= require('path')
var app2=express()

app2.use(express.static(path.join(__dirname, 'ethnicity-viz')))

app2.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'ethnicity-viz', 'index.html'))
})

// app2.listen(8040)

module.exports=app2


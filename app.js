const app = require('express')();
const PORT = process.env.PORT || 3030;
 app.get('', (req,res) => {
     res.send('hi')
 });

 app.listen(PORT,() => {
     console.log('lsieting on port : 3030')
 })
module.exports = {
    ApiInit: 
    function(app){
        app.get('/api/status' , (req , res)=>{
            res.json({
                'status': 'worked',
                'serverTime': new Date()
            })
        })

        app.get('/api/serverTime' , (req , res)=>{
            var dateTime = new Date();
            res.json({
                'serverTime': dateTime
            })
        })
    }
};
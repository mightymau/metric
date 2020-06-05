const express = require('express');
const app = express();
const ONE_HOUR = 60 * 60 * 1000;
app.use(express.json());

//Object to containt to metrics
let metrics = {};
    

app.get('/metric/:id/sum', (req, res) => {
    //Check if metric exist
    if(req.params.id in metrics) {
        const lastHourMetrics = metrics[req.params.id].filter( c => ((new Date) - c.date) < ONE_HOUR) 
        //Update the metrics object without the data that is more than 1 hour
        metrics[req.params.id] = lastHourMetrics;
        
        let sum = lastHourMetrics.reduce((sum, obj) => sum + obj.value, 0);
        res.send({"value": sum});
    } else {
        res.status(404).send('Metric not found')
    }
});


app.post('/metric/:id', (req, res) => {

    //Validate
    if(!req.body.value) {
        res.status(400).send('Value is required.')
        return;
    }
    //console.log(req)
    const newMetric = {
        value: req.body.value,
        date: new Date,
    }



    //Check if metric exist
    if(req.params.id in metrics) {
        console.log("Exist!")
        metrics[req.params.id].push(newMetric);
        console.log(metrics);
        res.status(200).send({});
        
    } else {
        //if it doesnt exist create new object
        metrics[req.params.id] = [newMetric];
        console.log("Does not exist@");
        console.log(metrics);
        res.status(200).send({});
    }
});

//PORT
const port = process.env.PORT || 3213;
app.listen(port, () => console.log(`Listening on port ${port}...`));


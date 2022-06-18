

const { spawn } = require('child_process'); 

const pyprog =  spawn('python', ["recommend.py", "812"]);
pyprog.stdout.on('data', (data) => {
    console.log(data.toString());
});

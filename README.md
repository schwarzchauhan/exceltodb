a simple [web app](https://exceltodb.herokuapp.com/upload) where one can upload the excel files  
- application will receive only xlsx/xls file  
- then store it locally on the server 
- then read the excel file
- then convert it to json format
- parse data from json 
- then store data in form of collection in our mongodb


__xlxs__ is the npm package used to read the xlsx file


### assumption 
- there is only one excel sheet in the excel file


### mini learnings 
- [heroku logging](https://stackoverflow.com/questions/2671454/heroku-how-to-see-all-the-logs)  
- [async.eachSeries](https://caolan.github.io/async/v3/docs.html#eachSeries)


[https://github.com/schwarzchauhan/exceltodb](https://github.com/schwarzchauhan/exceltodb)
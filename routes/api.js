const router = require("express").Router();
const axios = require("axios");

const response = []; //array to store api response

//data for 30 cities cannot be fetched at once. there is limit upto 20 cities. hence api is fetched 2 times 15 cities each
//first 15 id's of cities that is to be passed as a query to get response from weather api
const cityID1 = [
  2988507, 1609350, 1856057, 2643743, 112931, 4887398, 2240449, 1819729,
  5128581, 4930956, 1259229, 1275339, 1269515, 1275004, 1264733,
];

//next 15 id's
const cityID2 = [
  1850147, 1273294, 3530597, 1796236, 360630, 1816670, 1185241, 1853909,
  6542143, 1174872, 524901, 1172451, 1814906, 1792947, 1277333,
];

router.post("/show", (req, res) => {
  //api request are made 2 times to get data of 15 cities each time i.e.30 cities in total
  const callAPI = async () => {
    const dataSet1 = await axios.get(
      `https://api.openweathermap.org/data/2.5/group?id=${cityID1}&units=metric&appid=8dc7674adddc803f5760ed33c14fb9e0`
    );
    const dataSet2 = await axios.get(
      `https://api.openweathermap.org/data/2.5/group?id=${cityID2}&units=metric&appid=8dc7674adddc803f5760ed33c14fb9e0`
    );

    // required data is stored in response array
    dataSet1.data.list.map((object) => {
      return response.push(object);
    });
    dataSet2.data.list.map((object) => {
      return response.push(object);
    });
  };

  callAPI();

  //Brownie point: This function is called after every 5 minutes to hit the API again to get refreshed data
  const setTime = async () => {
    try {
      callAPI();
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }

    console.log("API Data refreshed");
  };

  const minutes = 5;
  const timeInterval = minutes * 60 * 1000;
  setInterval(setTime, timeInterval); //Brownie point: method to call setTime function after every 5 minutes

  //Code to divide the data into pages
  const page = req.query.page;
  const limit = 10;

  const startIndex = (page - 1) * limit; //formula to find start index
  const endIndex = page * limit; //formula to find end index

  //response array that is holding the data is sliced from startindex and endindex;
  const paginatedResponse = response.slice(startIndex, endIndex);
  res.status(200).send(paginatedResponse);
});

module.exports = router;

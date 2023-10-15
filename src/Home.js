import {
  Box,
  Button,
  Flex,
  HStack,
  Img,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import "react-router-dom";
import Cloud from "./utility/Cloud.jpg";
import bg from "./utility/bg.jpg";
import logo from "./utility/loog.png";
import axios from "axios";
import clear from "./utility/clear.png";
import cloudy from "./utility/cloudy.png";
import rain from "./utility/rain.png";
import thunderstrom from "./utility/thunderstrom.png";

const Home = () => {
  const [info, setInfo] = useState({});
  const [time, setTime] = useState("");
  const [currdate, setCurrDate] = useState({});
  const [lati, setLati] = useState(0);
  const [longi, setLongi] = useState(0);
  const [place, setPlace] = useState("Delhi");
  const [res, setRes] = useState({});

  const [btn, setBtn] = useState(0);
  const [wimg, setWimg] = useState(clear);
  let flag = 0;

  //Code for Current Location
  const popup = async () => {
    const a=window.confirm('Give Location Access,This is only to get your Wheater information');
    //const a = 1;
    if (a) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        //console.log(position);
        setLongi(position.coords.longitude);
        setLati(position.coords.latitude);
        //setPlace()
      } catch (error) {
        console.log("Error While fetching Location", error);
      }
    } else {
      console.log("user denied!");
    }
  };

  useEffect(() => {
    if (flag === 0) {
      popup();
      flag = 1;
    }
    setTimeout(1000);
  }, []);

  //Code for Api Request
  useEffect(() => {
    let getweather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=8c7b493a7d9dd661f1f8d9f0265e55d2`
        );
        setInfo(response.data);
        //console.log(response);
      } catch (Error) {
        console.log("Erroe while fetching", Error);
      }
    };
   // getweather();
    setTimeout(getweather, 1000);
  }, [lati, longi]);

  //Code for Reverse Geocoding
  useEffect(() => {
    const getGeocoding = () => {
      axios
        .get(
          `https://api.opencagedata.com/geocode/v1/json?q=URI-ENCODED-${place}&key=68d9b0672a924ceebf324ddc009af667`
        )
        .then((response) => {
          setRes(response.data);
          console.log(response);
          setLati(response.data.results[0].geometry.lat);
          setLongi(response.data.results[0].geometry.lng);
        })
        .catch((error) => {
          console.log("Error while fetching:", error);
        });
    };
    getGeocoding();
  }, [btn]);

  if (info.coord) var cel = (info.main.temp - 273.15).toFixed(0);

  //Code for getting time
  useEffect(() => {
    var updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      var formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      setTime(formattedTime);
    };
    setInterval(updateTime, 1000);
  });

  //Code for getting date
  useEffect(() => {
    const dateformate = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "2-digit",
      year: "numeric",
    }).format(new Date());
    setCurrDate(dateformate);
  }, []);


  const handlePlaceChange = (e) => {
    const val = e.target.value;
    e.target.name = val;
    setPlace(val);
  };

  return (
    <Flex h={"fit-content"} w={"full"}>
      <Box
      borderRight={'2px solid black'}
        w="60%"
        h="97vh"
        backgroundImage={Cloud}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      >
        {info.coord ? (
          <>
            <Flex mt={"75vh"} justifyContent={"space-between"}>
              <Flex
                direction={"column"}
                fontFamily={"cursive"}
                fontSize={"3vh"}
                fontWeight={"extrabold"}
                alignItems={"flex-end"}
              >
                <Box mt={"10vh"}>
                  <Text lineHeight={"1vh"}>{time}</Text>
                  <Text lineHeight={"1vh"}>{currdate}</Text>
                </Box>
              </Flex>
              <Flex
                mr={"1vh"}
                direction={"column"}
                lineHeight={"2vh"}
                alignItems={"flex-end"}
              >
                {res ? (
                  <Text mb={"-2px"} fontSize={"4vh"} fontStyle={"italic"}>
                    {res.results[0].formatted}
                  </Text>
                ) : (
                  <Text mb={"-2px"} fontSize={"4vh"} fontStyle={"italic"}>
                    New Delhi
                  </Text>
                )}

                <Text fontSize={"10vh"} mb={"-2vh"}>
                  {cel}
                  {`\u00B0`} C
                </Text>
              </Flex>
            </Flex>
          </>
        ) : (
          <Text>Loading</Text>
        )}
      </Box>

      <Box
        w="40%"
        h="97vh"
        backgroundImage={bg}
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
      >
        {info.coord ? (
          <VStack>
            <Img
              mt={"4vh"}
              h={"8vh"}
              w={"8vh"}
              borderRadius={"full"}
              src={wimg}
            ></Img>
            <Box
              textAlign={"center"}
              w={"35vh"}
              borderBottom="1.5px solid white"
            >
              <Text color="white" fontSize={"5vh"}>
                {info.weather[0].main}
              </Text>
            </Box>
            <Flex mr={"7vh"} mt={"-1vh"} alignItems={"center"}>
              <Text>Search : </Text>
              <Input
                borderRadius={"8px"}
                w={"30vh"}
                h={"4vh"}
                variant={"outline"}
                type="text"
                name="latitude"
                onChange={handlePlaceChange}
                //value={lati}
              />
            </Flex>

            <Button
              borderRadius={"8px"}
              h={"5vh"}
              w={"20vh"}
              variant={"ghost"}
              onClick={() => {
                setBtn(btn + 1);
              }}
            >
              Click
            </Button>
            <Flex mt={"2vh"} direction={"column"}>
              <Box
                textAlign={"center"}
                w={"35vh"}
                borderBottom="1px solid white"
              >
                <Text color="white">
                  Temperature : {cel}
                  {`\u00B0`} C
                </Text>
              </Box>
              <Box
                textAlign={"center"}
                w={"35vh"}
                borderBottom="1px solid white"
              >
                <Text color="white">Humidity : {info.main.humidity}%</Text>
              </Box>
              <Box
                textAlign={"center"}
                w={"35vh"}
                borderBottom="1px solid white"
              >
                <Text color="white">Visibilty : {info.visibility} Meters</Text>
              </Box>
              <Box textAlign={"center"} w={"35vh"}>
                <Text color="white">Wind Speed : {info.wind.speed} km/hr</Text>
              </Box>
            </Flex>
          </VStack>
        ) : (
          <Text>Loading</Text>
        )}
      </Box>
    </Flex>
  );
};

export default Home;

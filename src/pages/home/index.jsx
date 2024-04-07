import { useState } from "react";
import { toast } from "react-toastify";
import Container from "../../components/Container";
import Search from "../../components/Search";
import Weather from "../../components/weather";
import api from "../../constants/api";
import WeatherGlobe from "./WeatherGlobe";

const Home = () => {
  const [city, setCity] = useState("");
  const [labelsData, setLabelsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null); // Initialize as null

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!city || city === "") {
      toast.error("Please enter a City!");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${api.base_url}/weather?q=${city}&appid=${api.key}`
      );
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
      setWeatherData(data);
      setLabelsData([
        ...labelsData,
        {
          lat: data.coord.lat,
          lon: data.coord.lon,
          name: data.name,
          weatherData: data,
        },
      ]);
      setLoading(false);
      setCity(""); // Reset input field
    } catch (error) {
      console.log(error.message);
      if (error.message === "404") {
        toast.error("Please enter a valid city");
      } else if (error.message === "401") {
        toast.error("Exceeded API limit for the day, come back tomorrow.");
      } else {
        toast.error("Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-row flex-wrap-reverse">
        <WeatherGlobe
          labelsData={labelsData}
          setWeatherData={setWeatherData}
          weatherData={weatherData}
        />
        <div
          className="p-2 mt-32 mx-auto lg:ml-24 lg:mr-auto lg:my-auto"
          style={{ width: "380px" }}
        >
          <Search
            placeholder="Enter City"
            city={city}
            setCity={setCity}
            onSearch={handleSearch}
            loading={loading}
          />
          <Container>
            <Weather weather={weatherData} loading={loading} />
          </Container>
        </div>
      </div>
    </>
  );
};

export default Home;

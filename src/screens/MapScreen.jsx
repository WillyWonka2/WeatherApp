import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import axios from 'axios';
 import {API_KEY} from '../services/keys.js'

const MapScreen = () => {
  const [marker, setMarker] = useState(null);
  const [weather, setWeather] = useState(null);
  const [checkMoreInfo, setCheckMoreInfo] = useState(false);


  const handleLongPress = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;

    setMarker({latitude, longitude});

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
      );
      setWeather({...response.data});
    } catch (error) {
      console.error('Ошибка получения данных о погоде:', error);
    }
  };

  return (
    <>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 50.444509,
          longitude: 30.536982,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onLongPress={handleLongPress}>
        {marker && <Marker coordinate={marker} pinColor="red" />}
      </MapView>
      {marker && (
        <View style={styles.description}>
          {weather ? (
            <>
              <Text style={styles.city}>{weather.name}</Text>
              <Text style={styles.temp}>{weather.main.temp}°C</Text>
              <Text style={styles.desc}>{weather.weather[0].description}</Text>
              {!checkMoreInfo && (
                <TouchableOpacity
                  onPress={() => setCheckMoreInfo(!checkMoreInfo)}
                  style={styles.btn}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    More Details
                  </Text>
                </TouchableOpacity>
              )}
              {checkMoreInfo && (
                <>
                  <Text style={styles.title}>Coordinates</Text>
                  <Text>Latitude: {`${weather.coord.lat}`}</Text>
                  <Text>Longitude: {`${weather.coord.lon}`}</Text>
                  <Text style={styles.title}>Main Weather Information</Text>
                  <Text>Feels like: {`${weather.main.feels_like}`}°C</Text>
                  <Text>Minimum temperature: {`${weather.main.temp_min}`}°C</Text>
                  <Text>Maximum temperature: {`${weather.main.temp_max}`}°C</Text>
                  <Text>Humidity: {`${weather.main.humidity}`}%</Text>
                  <Text style={styles.title}>Wind</Text>
                  <Text>Direction: {`${weather.wind.deg}`}°</Text>
                                    <Text>Speed: {`${weather.wind.speed}`} m/s</Text>
                                    <Text>Gusts: {`${weather.wind.gust}`} m/s</Text>
                  <TouchableOpacity
                    onPress={() => setCheckMoreInfo(!checkMoreInfo)}
                    style={styles.btn}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Close Details
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  marker: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
  },
  city: {
    width: 100,
    flex: 1,
    height: 'auto',
    fontWeight: 'bold',
    fontSize: 16,
  },
  temp: {
    fontSize: 14,
    color: '#1E90FF',
  },
  desc: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  description: {
    padding: '10',
  },
  btn: {
    maxWidth: 140,
    borderRadius: 25,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    color: 'white',
    padding: 10,
    marginTop: 10
  },
  title: {
  fontWeight: 'bold',
  fontSize: 16,
  marginTop: 10
  }
});

export {MapScreen};

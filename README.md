# WeatherFinder

The WeatherFinder app is a vanilla JavaScript application that allows users to get the current weather data for any city in the world. Users can choose from select cities by clicking on them via an interactive world map, searching for them in the search bar, or clicking the random city selection button. Searches will place the city name and country in the correct location on the world map. Weather Data supplied by the OpenWeatherMap.org API.

App contains a left slider menu, which gives instructions on how to enter a search correctly in the search bar. Right side of screen contains a dropdown list of country ISO codes, which are explained by the left slider menu.

In order to accurately portray city locations on a world image, I had to convert lat and long coordinates to x(long) and y(lat) coordinates on the image.

## Links

* [Live Demo](https://azforest.github.io/WeatherFinder)

## Screenshots

### Starting Screen:

<img width="1440" alt="StartingScreen" src="https://user-images.githubusercontent.com/61096655/132921289-e5060eea-e5f4-4b1c-813b-24e72cf20541.png">

### Select by Map Click, with both left menu and right dropdown visible: 

<img width="1440" alt="SelectWithMenus" src="https://user-images.githubusercontent.com/61096655/132921561-6f4fffd7-0b94-4fb3-a5d7-aad878971f05.png">

### Search City via Search Bar:

<img width="1440" alt="Search" src="https://user-images.githubusercontent.com/61096655/132921772-cf3b9d1e-4fe4-4aff-af6d-a63d7b6cee44.png">

### Random City Selection via Random Button, with both left menu and right dropdown visible:

<img width="1440" alt="RandomWithMenus" src="https://user-images.githubusercontent.com/61096655/132921862-f503468b-14bd-4ef7-85f2-0d2c5c88ab33.png">## Technology

### Built with: 

* HTML, CSS
* Javascript

### API:

* OpenWeatherMap.org

### City Coordinate Data:

* https://raw.githubusercontent.com/lutangar/cities.json/master/cities.json


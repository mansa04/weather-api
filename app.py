# from flask import Flask, render_template, jsonify, request
# import requests

# app = Flask(__name__)

# # Your OpenWeatherMap API Key
# API_KEY = '2f5531105953fd80c02b75b18dbcce32'

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/weather', methods=['GET'])
# def get_weather():
#     city = request.args.get('city')
#     if not city:
#         return jsonify({"error": "City name is required"}), 400

#     # Get city coordinates from OpenWeatherMap API
#     geocoding_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
#     geo_response = requests.get(geocoding_url)
#     geo_data = geo_response.json()

#     if not geo_data:
#         return jsonify({"error": f"City '{city}' not found"}), 404

#     lat = geo_data[0]['lat']
#     lon = geo_data[0]['lon']
#     country = geo_data[0]['country']

#     # Fetch weather data
#     weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}"
#     weather_response = requests.get(weather_url)
#     weather_data = weather_response.json()

#     # Fetch air quality data
#     air_quality_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
#     air_quality_response = requests.get(air_quality_url)
#     air_quality_data = air_quality_response.json()

#     # Combine both weather and air quality data
#     result = {
#         "city": city,
#         "country": country,
#         "weather": weather_data,
#         "air_quality": air_quality_data
#     }

#     return jsonify(result)

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, render_template, jsonify, request
import requests

app = Flask(__name__)

# Your OpenWeatherMap API Key
API_KEY = '2f5531105953fd80c02b75b18dbcce32'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City name is required"}), 400

    # Get city coordinates from OpenWeatherMap API
    geocoding_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
    geo_response = requests.get(geocoding_url)
    geo_data = geo_response.json()

    if not geo_data:
        return jsonify({"error": f"City '{city}' not found"}), 404

    lat = geo_data[0]['lat']
    lon = geo_data[0]['lon']
    country = geo_data[0]['country']

    # Fetch weather data
    weather_url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}"
    weather_response = requests.get(weather_url)
    weather_data = weather_response.json()

    # Fetch air quality data
    air_quality_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
    air_quality_response = requests.get(air_quality_url)
    air_quality_data = air_quality_response.json()

    # Combine both weather and air quality data
    result = {
        "city": city,
        "country": country,
        "weather": weather_data,
        "air_quality": air_quality_data
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)

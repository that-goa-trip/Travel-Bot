import os
import json
import requests
import dotenv

dotenv.load_dotenv()

class ToolApis:
    def __init__(self):
        self.apis = {
            "web_search": self.web_search,
            "search_hotels": self.search_hotels,
            "search_hotel_destination": self.search_hotel_destination,
            "get_currency": self.get_currency,
            "search_flight_destination": self.search_flight_destination,
            "search_flights": self.search_flights,
            "get_airbnb_categories": self.get_airbnb_categories,
            "search_airbnb": self.search_airbnb,
        }

    def get_tool(self, tool_name):
        return self.apis.get(tool_name)

    def web_search(self, query):
        url = f"https://google.serper.dev/search"
        payload = json.dumps({"q": f"{query}"})
        headers = {
        'X-API-KEY': os.getenv("SERPER_API_KEY"),
        'Content-Type': 'application/json'
        }
        response = requests.request("POST", url, headers=headers, data=payload)
        print(response.text)
        if response.status_code == 200:
            return response.text
        else:
            return "Could not fetch the data. Please try again later."

    def search_hotels(self, checkout_date, room_number, dest_id, adults_number, checkin_date, **kwargs):
        # url = f"https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels"
        url = "https://booking-com.p.rapidapi.com/v1/hotels/search"

        querystring =  {
            "dest_id": dest_id,
            "checkin_date": checkin_date,
            "checkout_date": checkout_date,
            "room_number": room_number,
            "adults_number": adults_number,
            # "search_type": search_type,
            # "arrival_date": arrival_date,
            # "departure_date": departure_date,
            "order_by":"popularity",
            "locale":"en-gb",
            "units":"metric",
            "filter_by_currency": "INR",
            "dest_type": "city",
            **kwargs
        }
        headers = {
	        "x-rapidapi-key": os.getenv("RAPIDAPI_API_KEY"),
            "x-rapidapi-host": "booking-com.p.rapidapi.com"
            # "x-rapidapi-host": "booking-com15.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)
        print(response.text)
        if response.status_code == 200:
            return response.json()
        else:
            return "Could not fetch the data. Please try again later."
        
    def search_hotel_destination(self, name):
        # url = f"https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination"
        url = "https://booking-com.p.rapidapi.com/v1/hotels/locations"

        querystring = {"name": name, "locale":"en-gb"}
        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_API_KEY"),
            "x-rapidapi-host": "booking-com.p.rapidapi.com"
            # "x-rapidapi-host": "booking-com15.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)
        print(response.text)

        if response.status_code == 200:
            return response.json()
        else:
            print(response.text)
            return "Could not fetch the data. Please try again later."
        
    def get_currency(self):
        url = "https://booking-com15.p.rapidapi.com/api/v1/meta/getCurrency"
        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_API_KEY"),
            "x-rapidapi-host": "booking-com15.p.rapidapi.com"
        }
        response = requests.get(url, headers=headers)
        print(response.text)
        if response.status_code == 200:
            return response.json()
        else:
            return "Could not fetch the data. Please try again later."

    def search_flight_destination(self, query):
        url = "https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination"

        querystring = {"query": query}
        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_API_KEY"),
            "x-rapidapi-host": "booking-com15.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        print(response.text)

        if response.status_code == 200:
            return response.json()
        else:
            return "Could not fetch the data. Please try again later."
        
    def search_flights(self, fromId, toId, departDate, **kwargs):
        url = "https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights"

        querystring = {
            "fromId": fromId,
            "toId": toId,
            "departDate": departDate,
            **kwargs
        } 

        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_API_KEY"),
            "x-rapidapi-host": "booking-com15.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)
        print(response.text)

        if response.status_code == 200:
            return response.json()
        else:
            return "Could not fetch the data. Please try again later."
        
    def get_airbnb_categories(self):
        # url = "https://airbnb19.p.rapidapi.com/api/v1/getCategory"
        url = "https://airbnb45.p.rapidapi.com/api/v1/getCategory"

        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_API_KEY"),
            "x-rapidapi-host": "airbnb45.p.rapidapi.com"
            # "x-rapidapi-host": "airbnb19.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers)

        print(response.json())

        if response.status_code == 200:
            return response.json()
        else:
            return "Could not fetch the data. Please try again later."


    def search_airbnb(self, location, **kwargs):
        # url = "https://airbnb19.p.rapidapi.com/api/v1/searchPropertyByLocationV2"
        url = "https://airbnb45.p.rapidapi.com/api/v1/searchPropertyByLocation"

        querystring = {
            "location": location,
            **kwargs
        }

        headers = {
            "x-rapidapi-key": os.getenv("RAPIDAPI_API_KEY"),
            "x-rapidapi-host": "airbnb45.p.rapidapi.com"
            # "x-rapidapi-host": "airbnb19.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        print(response.json())

        if response.status_code == 200:
            return response.json()
        else:
            return "Could not fetch the data. Please try again later."

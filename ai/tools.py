tools = [
    {
        "type": "function",
        "function": {
            "name": "web_search",
            "description": "Search the web for information",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query"
                    }
                },
                "required": ["query"],
            },
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_hotels",
            "description": "Search for hotels",
            "parameters": {
                "type": "object",
                "properties": {
                    "checkout_date": {
                        "type": "string",
                        "description": "Checkout date (format: yyyy-mm-dd)."
                    },
                    "order_by": {
                        "type": "string",
                        "description": "Order by criteria (e.g., popularity)."
                    },
                    "filter_by_currency": {
                        "type": "string",
                        "description": "Currency filter (e.g., INR)."
                    },
                    "room_number": {
                        "type": "number",
                        "description": "Number of rooms."
                    },
                    "dest_id": {
                        "type": "number",
                        "description": "Destination ID, use Search locations to find a place. Get dest_id this using search_hotel_destination API."
                    },
                    "dest_type": {
                        "type": "string",
                        "description": "Destination type (e.g., city)."
                    },
                    "adults_number": {
                        "type": "number",
                        "description": "Number of adults."
                    },
                    "checkin_date": {
                        "type": "string",
                        "description": "Check-in date (format: yyyy-mm-dd)."
                    },
                },
                "required": [
                    "checkout_date",
                    "room_number",
                    "dest_id",
                    "adults_number",
                    "checkin_date",
                ]
            }
            # "parameters": {
            #     "type": "object",
            #     "properties": {
            #         "dest_id": {
            #             "type": "string",
            #             "description": "Destination ID obtained from searchDestination API."
            #         },
            #         "search_type": {
            #             "type": "string",
            #             "description": "Type of search (e.g., CITY) obtained from searchDestination API."
            #         },
            #         "arrival_date": {
            #             "type": "string",
            #             "description": "Arrival date in yyyy-mm-dd format."
            #         },
            #         "departure_date": {
            #             "type": "string",
            #             "description": "Departure date in yyyy-mm-dd format."
            #         },
            #         "adults": {
            #             "type": "number",
            #             "description": "Number of adult guests (default: 1)."
            #         },
            #         "children_age": {
            #             "type": "string",
            #             "description": "A comma-separated list of ages for children."
            #         },
            #         "room_qty": {
            #             "type": "number",
            #             "description": "Number of rooms required (default: 1)."
            #         },
            #         "page_number": {
            #             "type": "number",
            #             "description": "Page number for pagination (default: 1)."
            #         },
            #         "price_min": {
            #             "type": "number",
            #             "description": "Minimum price filter."
            #         },
            #         "price_max": {
            #             "type": "number",
            #             "description": "Maximum price filter."
            #         },
            #         "units": {
            #             "type": "string",
            #             "description": "Measurement unit (metric or imperial)."
            #         },
            #         "temperature_unit": {
            #             "type": "string",
            #             "description": "Temperature unit (c for Celsius, f for Fahrenheit)."
            #         },
            #         "currency_code": {
            #             "type": "string",
            #             "description": "Currency code (e.g., AED). Can be obtained from getCurrency API."
            #         }
            #     },
            #     "required": ["dest_id", "search_type", "arrival_date", "departure_date"]
            # },
        }
    },
    {
        "type": "function",
        "function": {
            "name": "search_hotel_destination",
            "description": "Search for Hotel destinations",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Search query for names of locations, cities, districts, places, countries, counties, etc."
                    }
                },
                "required": ["name"]
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_currency",
            "description": "Get currency information",
        },
    },
    # {
    #     "type": "function",
    #     "function": {
    #         "name": "search_flights",
    #         "description": "Search for flights and get flight details. Do this when user wants to search for flights.",
    #         "parameters": {
    #             "type": "object",
    #             "properties": {
    #                 "fromId": {
    #                     "type": "string",
    #                     "description": "Departure location ID obtained from searchDestination(Search Flight Location) endpoint in Flights collection as id."
    #                 },
    #                 "toId": {
    #                     "type": "string",
    #                     "description": "Arrival location ID obtained from searchDestination(Search Flight Location) endpoint in Flights collection as id."
    #                 },
    #                 "departDate": {
    #                     "type": "string",
    #                     "description": "Departure date in yyyy-mm-dd format."
    #                 },
    #                 "returnDate": {
    #                     "type": "string",
    #                     "description": "Return date in yyyy-mm-dd format (optional)."
    #                 },
    #                 "pageNo": {
    #                     "type": "number",
    #                     "description": "Page number for pagination (optional, default: 1)."
    #                 },
    #                 "adults": {
    #                     "type": "number",
    #                     "description": "Number of adult passengers (optional, default: 1)."
    #                 },
    #                 "children": {
    #                     "type": "string",
    #                     "description": "A comma-separated list of ages for children (optional)."
    #                 },
    #                 "sort": {
    #                     "type": "string",
    #                     "enum": ["BEST", "CHEAPEST", "FASTEST"],
    #                     "description": "Sorting criteria for flights (optional)."
    #                 },
    #                 "cabinClass": {
    #                     "type": "string",
    #                     "enum": ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"],
    #                     "description": "Cabin class for flight search (optional)."
    #                 },
    #                 "currency_code": {
    #                     "type": "string",
    #                     "description": "Currency code (optional)."
    #                 }
    #             },
    #             "required": ["fromId", "toId", "departDate"]
    #         }
    #     }
    # },
    # {
    #     "type": "function",
    #     "function": {
    #         "name": "search_flight_destination",
    #         "description": "Search for Flight destinations",
    #         "parameters": {
    #             "type": "object",
    #             "properties": {
    #                 "query": {
    #                     "type": "string",
    #                     "description": "Search query for names of locations, cities, districts, places, countries, counties, etc."
    #                 }
    #             },
    #             "required": ["query"]
    #         },
    #     },
    # },
    {
        "type": "function",
        "function": {
            "name": "search_airbnb",
            "description": "Search for Airbnb listings",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "Location name (e.g., city, district, etc.)."
                    },
                    "nextPageCursor": {
                        "type": "string",
                        "description": "Cursor for accessing properties on the next page (optional). Retrieve from previous page API call. Exclude for the first page."
                    },
                    "minBedrooms": {
                        "type": "number",
                        "description": "Minimum number of bedrooms required for a property (optional). Range: 1-8, default: 1."
                    },
                    "priceMin": {
                        "type": "number",
                        "description": "Minimum price filter (optional)."
                    },
                    "priceMax": {
                        "type": "number",
                        "description": "Maximum price filter (optional)."
                    },
                    "flexibleCancellation": {
                        "type": "string",
                        "description": "Filter for properties with flexible cancellation policies (optional).",
                        "enum": [0, 1]
                    },
                    "locale": {
                        "type": "string",
                        "description": "Locale for the search (optional)."
                    }
                },
                "required": ["location"]
            }
            # "parameters": {
            #     "type": "object",
            #     "properties": {
            #         "location": {
            #             "type": "string",
            #             "description": "Location Name in natural language."
            #         },
            #         "category": {
            #             "type": "string",
            #             "description": "Category ID (optional). Default category is all. Obtain other available categories from Get Category API."
            #         },
            #         "totalRecords": {
            #             "type": "string",
            #             "description": "Total number of records per API call. Maximum limit is 40 (optional, default: 10)."
            #         },
            #         "currency": {
            #             "type": "string",
            #             "description": "Currency code (optional). Default currency is USD. Obtain other available currencies from Get Currency API."
            #         },
            #         "offset": {
            #             "type": "string",
            #             "description": "Offset value to exclude records from the start (optional)."
            #         },
            #         "adults": {
            #             "type": "number",
            #             "description": "Number of adult guests (optional, default: 1)."
            #         },
            #         "children": {
            #             "type": "number",
            #             "description": "Number of children (optional). Age range: 2-12 years."
            #         },
            #         "infants": {
            #             "type": "number",
            #             "description": "Number of infants (optional). Age under 2 years."
            #         },
            #         "pets": {
            #             "type": "number",
            #             "description": "Number of pets (optional)."
            #         },
            #         "checkin": {
            #             "type": "string",
            #             "description": "Check-in date in yyyy-mm-dd format (optional)."
            #         },
            #         "checkout": {
            #             "type": "string",
            #             "description": "Check-out date in yyyy-mm-dd format (optional)."
            #         },
            #         "priceMin": {
            #             "type": "number",
            #             "description": "Minimum price filter (optional)."
            #         },
            #         "priceMax": {
            #             "type": "number",
            #             "description": "Maximum price filter (optional)."
            #         },
            #         "minBedrooms": {
            #             "type": "number",
            #             "description": "Minimum number of bedrooms (optional)."
            #         },
            #         "minBeds": {
            #             "type": "number",
            #             "description": "Minimum number of beds (optional)."
            #         },
            #         "minBathrooms": {
            #             "type": "number",
            #             "description": "Minimum number of bathrooms (optional)."
            #         },
            #         "self_check_in": {
            #             "type": "boolean",
            #             "description": "Self check-in filter (optional)."
            #         },
            #         "instant_book": {
            #             "type": "boolean",
            #             "description": "Instant book filter (optional)."
            #         },
            #         "super_host": {
            #             "type": "boolean",
            #             "description": "Super host filter (optional)."
            #         },
            #     },
            #     "required": ["location"],
            # },
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_airbnb_categories",
            "description": "Get Airbnb categories",
        }
    }
]
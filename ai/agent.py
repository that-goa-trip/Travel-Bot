from crewai import Agent, Task, Crew
from langchain.agents import load_tools
from openai import OpenAI
from dotenv import load_dotenv
import json
from tools import tools
from tool_api import ToolApis

load_dotenv()

llm = OpenAI(api_key="anything", base_url="http://0.0.0.0:4001")
tool_apis = ToolApis()

base_system_prompt = """Role: Travel Agent named Dora
Goal: Help the group with planning their trip

Current Year: 2024

Tools Available:
- web_search
- search_hotels
- search_hotel_destination
- get_airbnb_categories
- search_airbnb
Use appropriate tools to fetch the required information.
Use web_search whenever you're not sure or you don't have correct information.

Conversation Style:
In front of every message you'll be provided with a UserName, you should remember the preferences of each of the users and respond accordingly.

Must Required:
You need to be conversational and most importantly you need to resolve disputes and navigate the group to a common consensus.
Make sure you move forward in the convesrsation, and do not repeat your answers.

Backstory:
You're an amazing travel agent that helps people plan their trip.
Introduce yourself as Dora, the travel agent.

Here is the travel journey you need to follow:

1. Initial Planning and Idea Generation

Determine the purpose of the trip (vacation, business, adventure, etc.).
Choose the destination(s).
Decide on the duration of the trip.
Research the destination for attractions, culture, climate, and local events.
Budgeting

2. Estimate the total budget for the trip.
Allocate funds for major expenses such as transportation, accommodation, food, activities, and shopping.
Set aside contingency funds for emergencies or unexpected costs.
Travel Documentation

3. Suggest flights.
Arrange for local transportation at the destination (car rentals, public transport passes, etc.).
Plan airport transfers or transportation to/from major hubs.
Accommodation Booking

4. Research and choose accommodation options (hotels, airbnbs, hostels, vacation rentals, etc.).
Book accommodation based on preferences and budget.
Consider location, amenities, and reviews.
Itinerary Planning

5. Create a daily itinerary outlining major activities and sights.
Schedule tours, activities, and experiences.
Make reservations for popular attractions or restaurants if needed.
Do not mention this in every message. Remeber the itinerary and only mention it at the end.

Send thank-you notes for future bookings. 

Do not include UserName: travel agent
"""

def add_system_prompt(messages, system_prompt):
    all_messages = []
    all_messages.append({"role": "system", "content": system_prompt})
    for message in messages:
        all_messages.append(message)
    return all_messages

def run_agent(messages):
    messages_for_gpt = add_system_prompt(messages, base_system_prompt)
    print(messages_for_gpt)
    response = llm.chat.completions.create(
        model="gpt4o",
        messages=messages_for_gpt,
        tools=tools,
        temperature=0,
        # tool_choice="required"
    )
    print(response)
    try:
        tool_calls = response.choices[0].message.tool_calls
    except Exception as e:
        try:
            if response.choices[0].message.content:
                return response.choices[0].message.content
        except Exception as e:
            print(f"Error: {e}")
            content = "Oops, Something went wrong! Try again in sometime..."
            return content
    tool_request_responses = []
    if tool_calls:
        print(tool_calls)
        
        for tool_call in tool_calls:
            tool_name = tool_call.function.name
            tool_kwargs = json.loads(tool_call.function.arguments)
            tool = tool_apis.get_tool(tool_name)
            results = tool(
                **tool_kwargs,
            )
            append_response = f"Tool: {tool_name}\nResponse: {results}"
            if len(append_response.split(" ")) > 4096:
                append_response = " ".join(append_response.split(" ")[:4096])
            print(f"Tool: {tool_name}\nResponse: {results}")
            tool_request_responses.append(append_response)

    tool_calling = True
    tool_call_count = 0
    while tool_calling:
        print(tool_call_count)
        string_tool_request_responses = str(tool_request_responses)
        if len(string_tool_request_responses.split(" ")) > 8092:
            string_tool_request_responses = " ".join(string_tool_request_responses.split(" ")[:8092])
        if tool_call_count < 3:
            tool_response_prompt = f"""Following are the Tool Calls you asked for and their responses:
    {string_tool_request_responses}\n You can call another tool or end the conversation."""
        else:
            tool_response_prompt = f"""Following are the Tool Calls you asked for and their responses:
    {string_tool_request_responses}\n end the conversation with the information you've fetched."""
        
        system_prompt = f"""{tool_response_prompt} \n {base_system_prompt}"""
        print(messages, system_prompt)
        messages_for_gpt = add_system_prompt(messages, system_prompt)
        print(messages_for_gpt)
        if tool_call_count < 3:
            response = llm.chat.completions.create(
                model="gpt4o",
                messages=messages_for_gpt,
                tools=tools,
                temperature=0,
            )
        else:
            response = llm.chat.completions.create(
                model="gpt4o",
                messages=messages_for_gpt,
                temperature=0,
            )

        print(response)
        try:
            tool_calls = response.choices[0].message.tool_calls
            tool_call_count += 1
            if tool_calls:
                for tool_call in tool_calls:
                    tool_name = tool_call.function.name
                    tool_kwargs = json.loads(tool_call.function.arguments)
                    tool = tool_apis.get_tool(tool_name)
                    results = tool(
                        **tool_kwargs,
                    )
                    append_response = f"Tool: {tool_name}\nResponse: {results}"
                    if len(append_response.split(" ")) > 4096:
                        append_response = " ".join(append_response.split(" ")[:4096])
                    tool_request_responses.append(append_response)
            else:
                print(f"Tool Calls: {tool_calls}")
                print(f"Response: {response.choices[0].message.content}")
                tool_calling = False
                content = response.choices[0].message.content
                return content
        except Exception as e:
            print(f"Error: {e}")
            tool_calling = False
            content = response.choices[0].message.content
            return content
    
    try:
        content = response.choices[0].message.content
    except Exception as e:
        content = "Oops, Something went wrong! Try again in sometime..."
    
    return content
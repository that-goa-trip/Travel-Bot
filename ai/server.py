import orjson
from fastapi.responses import Response
from fastapi import FastAPI
from agent import run_agent

app = FastAPI()

def json_response(content, status_code=200):
    option = orjson.OPT_SERIALIZE_NUMPY | orjson.OPT_NAIVE_UTC
    return Response(content=orjson.dumps(content, option=option), status_code=status_code)

@app.get("/ping")
def pong():
    return {"ping": "pong!"}

@app.post("/process")
def process(data: dict):
    message_history = data.get("message_history", {})
    print(message_history)
    try:
        response = run_agent(message_history)
    except Exception as e:
        response = f"Oops, Something went wrong! Try again in sometime..."

    if "UserName: travel agent, Message:" in response:
        response = response.replace("UserName: Dora, Message:", "")
        response = response.replace("UserName: travel agent, Message:", "")
    if "UserName: Dora, Message:" in response:
        response = response.replace("UserName: Dora, Message: ", "")
    final_response = {"message": response}
    return json_response(final_response)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=3002)
import json
from fastapi.responses import Response
from fastapi import FastAPI

app = FastAPI()

def json_response(content, status_code=200):
    option = json.OPT_SERIALIZE_NUMPY | json.OPT_NAIVE_UTC
    return Response(content=json.dumps(content, option=option), status_code=status_code)

@app.get("/ping")
def pong():
    return {"ping": "pong!"}

@app.post("/process")
def process(data: dict):
    
    return json_response(data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
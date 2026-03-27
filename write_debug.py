import requests
import json
import os

target = os.path.join(os.getcwd(), 'api_debug.json')
try:
    response = requests.get('http://localhost:8000/api/live-data/Rice')
    with open(target, 'w') as f:
        json.dump(response.json(), f, indent=2)
    print(f"Success: Wrote to {target}")
except Exception as e:
    print(f"Error: {e}")

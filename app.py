from flask import Flask, jsonify, send_from_directory
import os
import requests
from flask_cors import CORS

# we need to load the .env rather than I think typing it in the terminal, this way both of us can use it.
# without having to type it in the terminal just make a .env file and add your api key there.
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

static_path = os.getenv('STATIC_PATH','static')
template_path = os.getenv('TEMPLATE_PATH','templates')

app = Flask(__name__, static_folder=static_path, template_folder=template_path)
CORS(app)

@app.route('/api/key')
def get_key():
    return jsonify({'apiKey': os.getenv('NYT_API_KEY')})

NYT_KEY = os.getenv("NYT_API_KEY")

@app.route('/api/findArticle/<string:article>')
def findArticle(article):
    par = {
        'q': article,
        'sort': 'newest',
        'api-key': NYT_KEY,
    }
    url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'#for now this works but only gets 10 since I think it is on default. IDK yet.
    response = requests.get(url, params=par, timeout=10)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data from NYT API'}), 500
    

@app.route('/')
@app.route('/<path:path>')
def serve_frontend(path=''):
    if path != '' and os.path.exists(os.path.join(static_path,path)):
        return send_from_directory(static_path, path)
    return send_from_directory(template_path, 'index.html')

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)),debug=debug_mode)
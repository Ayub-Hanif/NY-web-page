from flask import Flask, jsonify, send_from_directory, request
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

@app.route('/api/findArticle/<string:location1>-<string:location2>/<string:date>')
def findArticle(location1, location2, date):
    pageSize = request.args.get('pageSize', default=10, type=int) #we need the pageSize and page to get page data not only the first page.
    page = request.args.get('page', default=0, type=int) #we can increment using the page number to get more data.
    par = {
        'end_date': date,
        'fq': 'timesTag.location.contains:' + location1 + ' OR timesTag.location.contains:' + location2,
        'sort': 'newest',
        'api-key': NYT_KEY,
        'page': page,
    }
    url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json'
    response = requests.get(url, params=par, timeout=10)
    if response.status_code == 200:
        #added the lazy loading but for that to happen we need to add the pageSize and page to the api call.
        # this way we can get more data but in small bits and more once we hit the footer.
        new_data = response.json()
        # we get the response and then we get the docs from raw data we got. Also check if its empty or not.
        get_doc = new_data.get('response', {}).get('docs') or []
        new_data['response']['docs'] = get_doc[:pageSize]
        return jsonify(new_data)
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
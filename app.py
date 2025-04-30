from flask import Flask, jsonify, send_from_directory
import os
from flask_cors import CORS

# we need to load the .env rather than I think typing it in the terminal, this way both of us can use it.
# without having to type it in the terminal just make a .env file and add your api key there.
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv())

static_path = os.getenv('STATIC_PATH','static')
template_path = os.getenv('TEMPLATE_PATH','templates')

app = Flask(__name__, static_folder=static_path, template_folder=template_path)
CORS(app)

# This is not the best way because anyone can access my API key now.
# I will change it so it will only be available in like development mode.

@app.route('/api/key')
def get_key():
    if os.getenv('FLASK_ENV') == 'production':
        return jsonify({'apiKey': 'sorry this is not available for public use'}) #added this for more security.
    return jsonify({'apiKey': os.getenv('NYT_API_KEY')})
    

@app.route('/')
@app.route('/<path:path>')
def serve_frontend(path=''):
    if path != '' and os.path.exists(os.path.join(static_path,path)):
        return send_from_directory(static_path, path)
    return send_from_directory(template_path, 'index.html')

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_ENV') != 'production'
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)),debug=debug_mode)
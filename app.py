import requests
from flask import Flask, jsonify, request
from pprint import pprint
from utils import crossdomain
from urllib import quote


app = Flask(__name__)

CLIENT_ID = 'ZPWK0KBJKNLFRXVAE5PVUJFHHQZVGP05Y4ZWNHXRBX1UVWYO'
CLIENT_SECRET = 'LJ2FKPI2WAE20EHXT5UEKF1J2L4SPYFJ3VHTK0IY11XUYQGP'

def search_venues(query='', near=''):
    query = quote(query)
    near = quote(near)
    url = 'https://api.foursquare.com/v2/venues/search?client_id=%s'\
            '&client_secret=%s&v=20140101&query=%s&near=%s' %\
            (CLIENT_ID, CLIENT_SECRET, query, near)
    r = requests.get(url)
    if r.ok:
        # filter out the venues with no URL
        venues = r.json()['response']['venues']
        venues = [v for v in venues if 'url' in v]
        return venues
    return []

@app.route('/search_fs', methods=['GET'])
@crossdomain(origin='*')
def search_fs():
    query = request.args.get('query', '')
    near = request.args.get('near', '')

    venues = search_venues(query, near)
    return jsonify(data=venues)

if __name__ == '__main__':
    app.run(host='0.0.0.0', threaded=True)


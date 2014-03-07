# Venues

Assignment for the IWA class at VU.

## Install

* Create a python virtualenv. `virtualenv pybox; source pybox/bin/activate`
* Install the requirements. `pip install -r requirements-pip`
* Start the API server: `gunicorn -k eventlet -w 4 -b 0.0.0.0:5000 app:app`
* Serve the static files: `python -m SimpleHTTPServer`
* Go to `http://localhost:8000` to see the app.

That's it.

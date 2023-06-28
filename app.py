from flask import Flask, jsonify, render_template, request

import json

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('Introduction.html')

@app.route("/MainPage.html")
def MainPage():
    return render_template('MainPage.html')

@app.route("/About.html")
def About():
    return render_template('About.html')

@app.route('/receiver', methods=['GET', 'POST'])
def receiver():
    if request.method == 'POST':
        data = request.get_json()
        print('Received data:', data)
        
        return jsonify({'message': 'Data received successfully!'})
    if request.method == 'GET':
        info = {
            'name': 'John',
            'age': 30,
            'city': 'New York'
        }
        return jsonify(info)
from flask import Flask
from flask import request
from flask_cors import CORS
from flask import jsonify
import json
import mysql.connector
import random
import string
import time

time.sleep(3)
app = Flask(__name__)
CORS(app)

mydb = mysql.connector.connect(
host='db',
user='root',
passwd='bogcretu_blablacar'
)

cursor = mydb.cursor()

try:
    cursor.execute("DROP DATABASE blablacar")
except:
    print("PASS drop")

try:
    cursor.execute("CREATE DATABASE blablacar")
    cursor.execute("USE blablacar")
    query = "CREATE TABLE users (user VARCHAR(30), phone VARCHAR(10))"
    cursor.execute(query)
    query = "CREATE TABLE rides (user VARCHAR(30), users VARCHAR(120), source VARCHAR(30), destination VARCHAR(30), start VARCHAR(30), seats_available INT, seats_total INT)"
    cursor.execute(query)
except:
    print("PASS INIT")

@app.route("/add", methods=["POST"])
def add():
    req_data = request.get_json()
    
    user = req_data["user"]
    users = ""
    phone = req_data["phone"]
    source = req_data["source"]
    destination = req_data["destination"]
    start = req_data["start"]
    seats_total = req_data["seats_total"]
    seats_available = 0

    query = "SELECT phone FROM users WHERE user = %s"
    value = (user, )
    cursor.execute(query, value)
    result = cursor.fetchall()


    if len(result) == 0:
        query = "INSERT INTO rides (user, users, source, destination, start, seats_available, seats_total) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        value = (user, users, source, destination, start, seats_available, seats_total)
        cursor.execute(query, value)
        mydb.commit()
        query = "INSERT INTO users (user, phone) VALUES (%s, %s)"
        value = (user, phone)
        cursor.execute(query, value)
        mydb.commit()
        return "OK"

    elif result[0][0] == phone:
        query = "INSERT INTO rides (user, users, source, destination, start, seats_available, seats_total) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        value = (user, users, source, destination, start, seats_available, seats_total)
        cursor.execute(query, value)
        mydb.commit()
        return "OK"

    return "FAIL"

@app.route("/show", methods=["POST"])
def show():
    req_data = request.get_json()

    source = req_data["source"]
    destination = req_data["destination"]
    query = "SELECT * FROM rides WHERE source = %s AND destination = %s"
    value = (source, destination)
    cursor.execute(query, value)
    result = cursor.fetchall()

    return jsonify(results = result)

@app.route("/reserve", methods=["POST"])
def reserve():
    req_data = request.get_json()

    rider = req_data["rider"]
    rider_phone = req_data["rider_phone"]
    driver = req_data["driver"]
    source = req_data["source"]
    destination = req_data["destination"]
    start = req_data["start"]

    query = "SELECT phone FROM users WHERE user = %s"
    value = (rider, )
    cursor.execute(query, value)
    result = cursor.fetchall()
    if len(result) == 0:
        query = "INSERT INTO users (user, phone) VALUES (%s, %s)"
        value = (rider, rider_phone)
        cursor.execute(query, value)
        mydb.commit()

    query = "SELECT users, seats_available, seats_total FROM rides WHERE user = %s AND source = %s AND destination = %s and start = %s"
    value = (driver, source, destination, start)
    cursor.execute(query, value)
    result = cursor.fetchall()

    if len(result) != 0:
        users = result[0][0]
        seats_available = result[0][1]
        seats_total = result[0][2]

        if int(seats_available) < int(seats_total):
            seats_available = str(int(seats_available) + 1)
            users += "|" + rider
            query = "UPDATE rides SET users = %s, seats_available = %s WHERE user = %s AND source = %s AND destination = %s AND start = %s"
            value = (users, seats_available, driver, source, destination, start)
            cursor.execute(query, value)
            mydb.commit()
            return "OK"

    return "FAIL"

@app.route("/finish", methods=["POST"])
def finish():
    req_data = request.get_json()

    user = req_data["user"]
    source = req_data["source"]
    destination = req_data["destination"]
    start = req_data["start"]

    query = "DELETE FROM rides WHERE user = %s AND source = %s AND destination = %s AND start = %s"
    value = (user, source, destination, start)
    cursor.execute(query, value)
    mydb.commit()

    return "OK"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)


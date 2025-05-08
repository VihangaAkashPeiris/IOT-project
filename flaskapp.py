from flask import Flask, render_template, redirect
import mysql.connector
import serial
import time

app = Flask(__name__)

# MySQL config
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="smart_home"
)
cursor = db.cursor(dictionary=True)


@app.route("/")
def index():
    cursor.execute("SELECT * FROM events ORDER BY timestamp DESC")
    logs = cursor.fetchall()

    labels = [log["timestamp"].strftime("%Y-%m-%d %H:%M:%S") for log in logs if log["temperature"] is not None]
    temps = [log["temperature"] for log in logs if log["temperature"] is not None]

    total_access = sum(1 for log in logs if "Access" in log["event_type"])
    total_fires = sum(1 for log in logs if "FIRE" in log["event_type"])
    max_temp = max(temps) if temps else 0
    min_temp = min(temps) if temps else 0

    return render_template(
        "dashboard.html",
        logs=logs,
        labels=labels,
        temps=temps,
        total_access=total_access,
        total_fires=total_fires,
        max_temp=max_temp,
        min_temp=min_temp
    )


@app.route("/open-door", methods=["POST"])
def open_door():
    try:
        with serial.Serial('COM8', 9600, timeout=2) as arduino:
            time.sleep(2)  # 🔑 Wait for Arduino to reboot after serial opens
            arduino.write(b'OPEN\n')
            print("✅ Sent 'OPEN' to Arduino")
    except Exception as e:
        print("❌ Error:", e)
    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)

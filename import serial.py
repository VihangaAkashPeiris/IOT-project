import serial
import mysql.connector
import re

# Set up serial port (check your COM port!)
ser = serial.Serial('COM8', 9600, timeout=1)

# Set up MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",  # leave empty if default
    database="smart_home"
)
cursor = db.cursor()

print("Listening for events...")

while True:
    line = ser.readline().decode('utf-8').strip()
    if line.startswith("EVENT:"):
        print("Received:", line)
        
        # Parse
        if "FIRE EMERGENCY" in line:
            match = re.search(r"Temp: ([0-9.]+)", line)
            temp = float(match.group(1)) if match else None
            event_type = "FIRE EMERGENCY"
        elif "Access Granted" in line:
            match = re.search(r"Temp: ([0-9.]+)", line)
            temp = float(match.group(1)) if match else None
            event_type = "Access Granted"
            
        elif "Access Denied" in line:
            match = re.search(r"Temp: ([0-9.]+)", line)
            temp = float(match.group(1)) if match else None
            event_type = "Access Denied"
            
        elif "Safe" in line:
            match = re.search(r"Temp: ([0-9.]+)", line)
            temp = float(match.group(1)) if match else None
            event_type = "Safe"
            
        else:
            continue

        # Insert into DB
        sql = "INSERT INTO events (event_type, temperature) VALUES (%s, %s)"
        cursor.execute(sql, (event_type, temp))
        db.commit()

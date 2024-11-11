import os
from datetime import datetime
import cv2
from flask import Flask, Response, jsonify
from flask_cors import CORS  # Added CORS import
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)

if not cap.isOpened():
    print("Error: Could not access the camera.")
    exit()

screenshot_dir = "screenshots"
os.makedirs(screenshot_dir, exist_ok=True)

# Global variables for alerts
multiple_faces_detected = False
frame_lock = threading.Lock()
current_frame = None
screenshot_taken = False  # Track whether screenshot has been taken

def generate_frames():
    global multiple_faces_detected, current_frame, screenshot_taken
    while True:
        ret, frame = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Check for multiple faces
        if len(faces) > 1:
            multiple_faces_detected = True
            if not screenshot_taken:
                screenshot_path = os.path.join(screenshot_dir, f"multiple_faces_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg")
                cv2.imwrite(screenshot_path, frame)
                screenshot_taken = True  # Mark screenshot as taken
        else:
            multiple_faces_detected = False
            screenshot_taken = False  # Reset screenshot flag when faces are no longer multiple

        # Update the current frame
        with frame_lock:
            current_frame = frame

def get_frame():
    global current_frame
    with frame_lock:
        if current_frame is None:
            return None
        ret, buffer = cv2.imencode('.jpg', current_frame)
        if not ret:
            return None
        return buffer.tobytes()

@app.route('/video')
def video():
    def stream():
        while True:
            frame = get_frame()
            if frame:
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
    return Response(stream(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/alert-status')
def alert_status():
    # Send alert only when multiple faces are detected
    return jsonify({'alert_message': "Multiple faces detected!" if multiple_faces_detected else ""})

if __name__ == '__main__':
    threading.Thread(target=generate_frames, daemon=True).start()
    app.run(host='0.0.0.0', port=5000)

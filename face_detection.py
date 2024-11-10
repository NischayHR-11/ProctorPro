import os
from datetime import datetime
import cv2
from flask import Flask, Response, jsonify

# Initialize Flask app
app = Flask(__name__)

# Load the pre-trained Haar cascade classifier for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Initialize webcam
cap = cv2.VideoCapture(0)

missed_frames = 0  # Counter to track missed frames without faces
end_test = False  # Global variable to track if the test should end
multiple_faces_detected = False  # Flag to indicate if multiple faces are detected

# Directory to save screenshots
screenshot_dir = "screenshots"
if not os.path.exists(screenshot_dir):
    os.makedirs(screenshot_dir)

# Function to generate frames
def generate_frames():
    global missed_frames, end_test, multiple_faces_detected
    while True:
        # Read frame from the webcam
        ret, frame = cap.read()
        if not ret:
            break

        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

        # Check if no faces are detected
        if len(faces) == 0:
            missed_frames += 1
            if missed_frames >= 3:  # After 3 missed frames, show alert
                print("Alert: Please ensure you're in the camera frame!")
        else:
            missed_frames = 0  # Reset missed frames counter

        # Check if there are multiple faces in the frame
        if len(faces) > 1:
            multiple_faces_detected = True
            # Save screenshot when multiple faces are detected
            screenshot_path = os.path.join(screenshot_dir, f"multiple_faces_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg")
            cv2.imwrite(screenshot_path, frame)
            print(f"Alert: Multiple faces detected, screenshot saved!")
        else:
            multiple_faces_detected = False

        # Encode the frame as JPEG and yield it as a response
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            continue

        # Yield the image in MJPEG format
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

# Route for video streaming
@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Route for missed frames data (no face detection) and multiple faces detection
@app.route('/missed-frames')
def missed_frames_count():
    alert_message = ""
    if missed_frames >= 3:  # After 3 missed frames, show alert
        alert_message = "Please ensure you're in the camera frame!"
    elif multiple_faces_detected:
        alert_message = "Multiple faces detected!"
    
    return jsonify({'missed_frames': missed_frames, 'alert_message': alert_message})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)

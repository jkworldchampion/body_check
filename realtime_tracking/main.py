from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse, HTMLResponse
import cv2
import mediapipe as mp
import numpy as np
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import time
from typing import List

# FastAPI 앱 생성
app = FastAPI()

# Firebase 초기화
cred = credentials.Certificate("bodycheck-e86de-firebase-adminsdk-17hwd-58c212763e.json")  # Firebase 자격 증명 파일 경로 확인
firebase_admin.initialize_app(cred)
db = firestore.client()

# Mediapipe 설정
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# 운동 상태 변수
counter = 0
stage = None
workout_type = ""
is_workout_started = False  # 운동 시작 상태를 확인하는 변수
sets_data: List[dict] = []   # 세트 데이터를 저장할 리스트

def calculate_angle(a, b, c):
    """세 점 사이의 각도 계산"""
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)

    if angle > 180.0:
        angle = 360 - angle

    return angle

def send_data_to_firebase(user_id):
    """Firebase에 모든 세트 데이터를 하나의 문서로 전송"""
    global sets_data, workout_type

    # 사용자 ID 확인
    user_ref = db.collection("users").where("id", "==", user_id).get()
    if not user_ref:
        raise HTTPException(status_code=404, detail="User not found in Firebase")

    # 사용자의 이름을 가져옵니다
    user_doc = user_ref[0].to_dict()
    user_name = user_doc.get("name", "Unknown")

    # 현재 날짜 및 시간
    current_date = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

    # 세트 데이터를 포함한 데이터 구조
    data = {
        "user_id": user_id,
        "user_name": user_name,
        "workout_type": workout_type,
        "date": current_date,
        "sets": sets_data
    }

    # Firestore 컬렉션에 데이터 추가
    db.collection("workout_sessions").add(data)
    print(f"Firebase에 데이터 전송 완료 ({workout_type}, 총 세트 {len(sets_data)}):", data)

def generate_frames(workout):
    """프레임 처리"""
    global counter, stage, workout_type, is_workout_started, sets_data
    counter = 0
    stage = None
    workout_type = workout
    cap = cv2.VideoCapture(0)

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while True:
            success, frame = cap.read()
            if not success:
                break

            # 운동이 시작되지 않은 경우: 준비 상태 화면만 보여줌
            if not is_workout_started:
                cv2.putText(frame, "Press 'Start Workout' to begin!", (50, 200),
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3, cv2.LINE_AA)
                _, encoded_image = cv2.imencode(".jpg", frame)
                yield (b"--frame\r\n"
                       b"Content-Type: image/jpeg\r\n\r\n" +
                       bytearray(encoded_image) + b"\r\n")
                continue

            # 카운트다운 화면
            if is_workout_started == "countdown":
                countdown = ["3", "2", "1", "Start!"]
                for count in countdown:
                    success, frame = cap.read()
                    if not success:
                        break
                    cv2.putText(frame, count, (200, 200),
                                cv2.FONT_HERSHEY_SIMPLEX, 3, (0, 0, 255), 5, cv2.LINE_AA)
                    _, encoded_image = cv2.imencode(".jpg", frame)
                    yield (b"--frame\r\n"
                           b"Content-Type: image/jpeg\r\n\r\n" +
                           bytearray(encoded_image) + b"\r\n")
                    time.sleep(1)
                is_workout_started = True
                continue

            # Mediapipe 처리
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = pose.process(image)
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

            if results.pose_landmarks is not None:
                try:
                    landmarks = results.pose_landmarks.landmark

                    # 운동에 따른 주요 포인트 좌표 추출 및 각도 계산 로직
                    if workout == "benchpress":
                        left_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                                      landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                         landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                        left_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                                      landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                        angle = calculate_angle(left_shoulder, left_elbow, left_wrist)

                        # 벤치프레스 카운터 로직
                        if angle > 160:
                            stage = "down"
                        if angle < 50 and stage == 'down':
                            stage = "up"
                            counter += 1

                    elif workout == "squat":
                        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                                     landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                                    landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                        left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                                      landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
                        angle = calculate_angle(left_hip, left_knee, left_ankle)

                        # 스쿼트 카운터 로직
                        if angle > 160:
                            stage = "up"
                        if angle < 90 and stage == 'up':
                            stage = "down"
                            counter += 1

                    elif workout == "deadlift":
                        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,
                                    landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                                         landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                        angle = calculate_angle(left_shoulder, left_hip, left_knee)

                        # 데드리프트 카운터 로직
                        if angle > 160:
                            stage = "up"
                        if angle < 90 and stage == 'up':
                            stage = "down"
                            counter += 1

                except Exception as e:
                    print(f"Error during processing landmarks: {e}")

            # 화면에 카운터 및 상태 표시
            cv2.rectangle(image, (0, 0), (300, 100), (0, 0, 255), -1)  # 배경 박스
            cv2.putText(image, 'REPS', (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2, cv2.LINE_AA)
            cv2.putText(image, str(counter), (15, 80), cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 255, 255), 3, cv2.LINE_AA)

            # Mediapipe 포즈 랜드마크 렌더링
            if results.pose_landmarks is not None:
                mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

            # 프레임을 JPEG로 인코딩하여 스트리밍
            _, encoded_image = cv2.imencode(".jpg", image)
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" +
                   bytearray(encoded_image) + b"\r\n")

@app.get("/video_feed/{workout}", response_class=HTMLResponse)
def video_feed(workout: str):
    """운동 종류에 따른 실시간 비디오 스트리밍 및 세트 관리 페이지."""
    html_content = f"""
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{workout.capitalize()} Workout</title>
        <style>
            body {{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #f0f2f5;
            }}
            h1 {{
                color: #333;
                margin-bottom: 20px;
            }}
            img {{
                border: 2px solid #ccc;
                border-radius: 10px;
            }}
            .input-group {{
                margin: 20px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
            }}
            label {{
                margin-bottom: 5px;
                font-size: 1.2em;
                color: #555;
            }}
            input[type="text"],
            input[type="number"] {{
                padding: 10px;
                width: 250px;
                border: 1px solid #ccc;
                border-radius: 5px;
                font-size: 1em;
            }}
            .button-group {{
                display: flex;
                gap: 15px;
                margin-top: 20px;
            }}
            button {{
                padding: 10px 20px;
                font-size: 1em;
                color: #fff;
                background-color: #007BFF;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }}
            button:hover {{
                background-color: #0056b3;
            }}
            button:active {{
                background-color: #004080;
            }}
        </style>
    </head>
    <body>
        <h1>{workout.capitalize()} Workout Live Feed</h1>
        <img src="/stream/{workout}" width="640" height="480">
        <div class="input-group">
            <label for="user_id">User ID:</label>
            <input type="text" id="user_id" name="user_id" required>
        </div>
        <div class="input-group">
            <label for="weight">Weight (kg):</label>
            <input type="number" id="weight" name="weight" min="0" step="0.1" required>
        </div>
        <div class="button-group">
            <button onclick="startWorkout()">Start Workout</button>
            <button onclick="saveSet()">Set Save</button>
            <button onclick="completeWorkout()">Complete Workout</button>
            <button onclick="window.location.href='/'">Go Home</button>
        </div>

        <script>
            function startWorkout() {{
                fetch('/start_workout', {{method: 'POST'}})
                    .then(response => response.json())
                    .then(data => {{
                        alert(data.message);
                        // Reset the video feed
                        document.querySelector('img').src = '/stream/{workout}';
                    }});
            }}

            function saveSet() {{
                const userId = document.getElementById('user_id').value;
                const weight = document.getElementById('weight').value;
                if (!userId) {{
                    alert('Please enter your User ID before saving the set.');
                    return;
                }}
                if (!weight) {{
                    alert('Please enter the weight used for the workout.');
                    return;
                }}
                fetch('/set_save', {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json',
                    }},
                    body: JSON.stringify({{ user_id: userId, weight: weight }})
                }})
                .then(response => response.json())
                .then(data => {{
                    alert(data.message);
                }});
            }}

            function completeWorkout() {{
                const userId = document.getElementById('user_id').value;
                if (!userId) {{
                    alert('Please enter your User ID before completing the workout.');
                    return;
                }}
                fetch('/workout_complete', {{
                    method: 'POST',
                    headers: {{
                        'Content-Type': 'application/json',
                    }},
                    body: JSON.stringify({{ user_id: userId }})
                }})
                .then(response => response.json())
                .then(data => {{
                    alert(data.message);
                    // Reset the video feed
                    document.querySelector('img').src = '/stream/{workout}';
                }});
            }}
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/stream/{workout}")
def stream(workout: str):
    """운동 스트리밍 처리."""
    return StreamingResponse(generate_frames(workout),
                             media_type="multipart/x-mixed-replace; boundary=frame")

@app.post("/start_workout")
async def start_workout():
    """운동 시작"""
    global is_workout_started, counter, stage
    is_workout_started = "countdown"
    counter = 0
    stage = None
    return {"status": "success", "message": "Workout will start after countdown!"}

@app.post("/set_save")
async def set_save(request: Request):
    """현재 세트 저장"""
    global counter, sets_data
    req_data = await request.json()
    user_id = req_data.get("user_id")
    weight_input = req_data.get("weight")
    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    if not weight_input:
        raise HTTPException(status_code=400, detail="Weight is required")
    if counter == 0:
        raise HTTPException(status_code=400, detail="No reps counted to save.")

    # 현재 세트 데이터 저장
    set_data = {
        "reps": counter,
        "weight": weight_input
    }
    sets_data.append(set_data)
    print(f"세트 {len(sets_data)} 저장 완료: {set_data}")

    # 세트 카운터 초기화
    counter = 0
    stage = None
    is_workout_started = False

    return {"status": "success", "message": f"Set {len(sets_data)} saved successfully!"}

@app.post("/workout_complete")
async def workout_complete(request: Request):
    """운동 완료 후 모든 세트 데이터를 Firebase에 전송."""
    global is_workout_started, sets_data
    req_data = await request.json()
    user_id = req_data.get("user_id")

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    if not sets_data:
        raise HTTPException(status_code=400, detail="No sets to complete.")

    send_data_to_firebase(user_id)

    # 세트 데이터 초기화
    sets_data.clear()
    is_workout_started = False

    return {"status": "success", "message": "All workout data sent to Firebase successfully!"}

@app.get("/", response_class=HTMLResponse)
def workout_selection():
    """운동 선택 페이지 제공."""
    html_content = """
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Workout Selection</title>
        <style>
            body {{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #f0f2f5;
            }}
            h1 {{
                color: #333;
                margin-bottom: 30px;
            }}
            .button-group {{
                display: flex;
                flex-direction: column;
                gap: 15px;
            }}
            button {{
                padding: 15px 30px;
                font-size: 1.2em;
                color: #fff;
                background-color: #007BFF;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                width: 200px;
            }}
            button:hover {{
                background-color: #0056b3;
            }}
            button:active {{
                background-color: #004080;
            }}
        </style>
    </head>
    <body>
        <h1>Select Your Workout</h1>
        <div class="button-group">
            <button onclick="window.location.href='/video_feed/benchpress'">Bench Press</button>
            <button onclick="window.location.href='/video_feed/squat'">Squat</button>
            <button onclick="window.location.href='/video_feed/deadlift'">Deadlift</button>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

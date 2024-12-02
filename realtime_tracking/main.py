# main_web.py

from fastapi import FastAPI, Request, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import cv2
import mediapipe as mp
import numpy as np
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, firestore
import base64
import io
from PIL import Image
import json

# FastAPI 앱 생성
app = FastAPI()
templates = Jinja2Templates(directory="templates")  # 템플릿 디렉토리 설정

# Firebase 초기화
cred = credentials.Certificate("bodycheck-e86de-firebase-adminsdk-17hwd-923284e260.json")  # Firebase 자격 증명 파일 경로 확인
firebase_admin.initialize_app(cred)
db = firestore.client()

# Mediapipe 설정
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# 운동 상태 변수
counter = 0
stage = None
workout_type = ""
sets_data = []   # 세트 데이터를 저장할 리스트

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

def send_data_to_firebase(user_id, workout_type, sets_data):
    """Firebase에 모든 세트 데이터를 하나의 문서로 전송"""
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

@app.websocket("/ws/{workout}")
async def websocket_endpoint(websocket: WebSocket, workout: str):
    """WebSocket을 통한 비디오 스트리밍 및 운동 감지 처리"""
    global counter, stage, workout_type, sets_data

    await websocket.accept()
    workout_type = workout
    counter = 0
    stage = None
    sets_data = []

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        try:
            while True:
                data = await websocket.receive_text()
                data_json = json.loads(data)  # JSON 문자열을 딕셔너리로 변환
                user_id = data_json.get("user_id")
                weight_input = data_json.get("weight")
                frame_data = data_json.get("frame")

                if not user_id or not weight_input or not frame_data:
                    await websocket.send_text(json.dumps({"message": "Invalid data received."}))
                    continue

                # 디코딩된 이미지
                try:
                    img_bytes = base64.b64decode(frame_data)
                    img = Image.open(io.BytesIO(img_bytes))
                    frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
                except Exception as e:
                    print(f"Error decoding image: {e}")
                    await websocket.send_text(json.dumps({"message": "Error decoding image."}))
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
                        if workout_type == "benchpress":
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

                        elif workout_type == "squat":
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

                        elif workout_type == "deadlift":
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

                # 프레임을 JPEG로 인코딩하여 클라이언트로 전송
                try:
                    _, encoded_image = cv2.imencode(".jpg", image)
                    b64_encoded_image = base64.b64encode(encoded_image).decode('utf-8')
                    await websocket.send_text(json.dumps({"processed_frame": b64_encoded_image, "counter": counter}))
                except Exception as e:
                    print(f"Error encoding image: {e}")
                    await websocket.send_text(json.dumps({"message": "Error encoding image."}))

        except WebSocketDisconnect:
            print("WebSocket connection closed.")
        except Exception as e:
            print(f"WebSocket error: {e}")

@app.get("/video_feed/{workout}", response_class=HTMLResponse)
def video_feed(workout: str, request: Request):
    """운동 종류에 따른 실시간 비디오 스트리밍 및 세트 관리 페이지."""
    return templates.TemplateResponse("video_feed.html", {"request": request, "workout": workout})

@app.get("/", response_class=HTMLResponse)
def workout_selection(request: Request):
    """운동 선택 페이지 제공."""
    return templates.TemplateResponse("workout_selection.html", {"request": request})

@app.post("/set_save")
async def set_save(request: Request):
    """현재 세트 저장"""
    req_data = await request.json()
    user_id = req_data.get("user_id")
    weight_input = req_data.get("weight")
    global counter, sets_data

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

    return {"status": "success", "message": f"Set {len(sets_data)} saved successfully!"}

@app.post("/workout_complete")
async def workout_complete(request: Request):
    """운동 완료 후 모든 세트 데이터를 Firebase에 전송."""
    req_data = await request.json()
    user_id = req_data.get("user_id")
    global sets_data, workout_type

    if not user_id:
        raise HTTPException(status_code=400, detail="User ID is required")
    if not sets_data:
        raise HTTPException(status_code=400, detail="No sets to complete.")

    send_data_to_firebase(user_id, workout_type, sets_data)

    # 세트 데이터 초기화
    sets_data.clear()

    return {"status": "success", "message": "All workout data sent to Firebase successfully!"}

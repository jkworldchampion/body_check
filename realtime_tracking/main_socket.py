from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from firebase_admin import credentials, firestore
import firebase_admin
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# FastAPI 앱 생성
app = FastAPI()

# CORS 설정 (필요에 따라 클라이언트 도메인 추가)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용, 보안상 필요한 도메인으로 변경 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase 초기화
cred = credentials.Certificate("bodycheck-c3808-firebase-adminsdk-toqny-ee882f3512.json")  # Firebase 자격 증명 파일 경로 확인
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.post("/save_set")
async def save_set(request: Request):
    """
    단일 세트를 저장하는 엔드포인트.
    JSON 형식으로 user_id, workout_type, reps, weight를 받음.
    """
    data = await request.json()
    user_id = data.get("user_id")
    workout_type = data.get("workout_type")
    reps = data.get("reps")
    weight = data.get("weight")

    if not all([user_id, workout_type, reps, weight]):
        raise HTTPException(status_code=400, detail="필수 필드가 누락되었습니다.")

    # 사용자 정보 가져오기
    user_ref = db.collection("users").where("id", "==", user_id).get()
    if not user_ref:
        raise HTTPException(status_code=404, detail="Firebase에서 사용자를 찾을 수 없습니다.")

    user_doc = user_ref[0].to_dict()
    user_name = user_doc.get("name", "Unknown")

    # 현재 날짜 및 시간
    current_date = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

    # 저장할 데이터 구성
    set_data = {
        "user_id": user_id,
        "user_name": user_name,
        "workout_type": workout_type,
        "reps": reps,
        "weight": weight,
        "timestamp": current_date
    }

    # Firestore에 데이터 저장
    db.collection("workout_sets").add(set_data)
    print(f"세트 저장 완료: {set_data}")

    return {"status": "success", "message": "세트가 성공적으로 저장되었습니다!"}

@app.post("/complete_workout")
async def complete_workout(request: Request):
    """
    운동 완료를 처리하는 엔드포인트.
    필요에 따라 추가 로직을 구현할 수 있음.
    """
    data = await request.json()
    user_id = data.get("user_id")
    workout_type = data.get("workout_type")

    if not all([user_id, workout_type]):
        raise HTTPException(status_code=400, detail="필수 필드가 누락되었습니다.")

    # 추가적인 완료 로직을 여기에 구현할 수 있습니다.

    return {"status": "success", "message": "운동이 성공적으로 완료되었습니다!"}

@app.get("/", response_class=HTMLResponse)
def workout_selection():
    """운동 선택 페이지 제공."""
    html_content = """
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <title>Workout Tracker API</title>
    </head>
    <body>
        <h1>Workout Tracker API가 실행 중입니다.</h1>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

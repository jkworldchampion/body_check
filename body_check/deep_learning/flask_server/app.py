from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, storage, firestore
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os

app = Flask(__name__)

# Firebase 초기화
cred = credentials.Certificate("bodycheck-e86de-firebase-adminsdk-17hwd-58c212763e.json")  # Firebase 자격 증명 파일 경로 확인
firebase_admin.initialize_app(cred)
db = firestore.client()

bucket = storage.bucket()

# TensorFlow 모델 로드
def load_model():
    from model.model import get_model  # 모델 경로에 맞게 조정
    config = {
        # 모델 설정 (사용자 제공 코드 참조)
        'input_shape': [256,256,3],
        'batch_size': 4,
        'path_pretrained': None,
        'type_backbone': "blazepose",
        'type_loss_fn': 'wing',
        'seg_shape': [64,64],
        'path_classes': "../seg_classes.txt",
        'shuffle': True,
        'is_normalized': False,
        'is_with_seg': False,
        'type_attention': "regression",
        'num_category_bmi': 10,
        'num_category_height': 10,
        'has_filename': False,
        'epochs': 30,
        'eval_term': 1
    }
    model = get_model(config)
    model.load_weights("best.h5")
    return model

model = load_model()
print("모델이 성공적으로 로드되었습니다.")

# 이미지 전처리 함수
def preprocess_image(image):
    image = image.resize((256, 256))
    image_array = np.array(image) / 255.0
    image_batch = np.expand_dims(image_array, axis=0)  # (1, 256, 256, 3)
    real_data_batch = np.expand_dims(np.array([170.3, 23.18]), axis=0)  # (1, 2)
    image_batch_4 = np.tile(image_batch, (4, 1, 1, 1))  # (4, 256, 256, 3)
    real_data_batch_4 = np.tile(real_data_batch, (4, 1))  # (4, 2)
    return [image_batch_4, real_data_batch_4]

# 예측 함수
def make_prediction(image):
    preprocessed = preprocess_image(image)
    result = model.predict(preprocessed)
    return result.flatten().tolist()

# Firebase에서 이미지 다운로드 함수
def download_image_from_firebase(image_path):
    blob = bucket.blob(image_path)
    if not blob.exists():
        raise FileNotFoundError(f"{image_path} does not exist in Firebase Storage.")
    image_bytes = blob.download_as_bytes()
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    return image

# Firebase에 결과 저장 함수
def save_result_to_firebase(doc_id, result_array):
    doc_ref = db.collection('predictions').document(doc_id)
    doc_ref.set({
        'result': result_array,
        'timestamp': firestore.SERVER_TIMESTAMP
    })

# API 엔드포인트
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'image_path' not in data or 'doc_id' not in data:
        return jsonify({'error': 'Invalid request. "image_path" and "doc_id" required.'}), 400
    
    image_path = data['image_path']
    doc_id = data['doc_id']

    try:
        # Firebase에서 이미지 다운로드
        image = download_image_from_firebase(image_path)
        
        # 예측 수행
        result = make_prediction(image)
        
        # 결과를 Firebase에 저장
        save_result_to_firebase(doc_id, result)
        
        return jsonify({'status': 'success', 'result': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Flask 서버 실행
    app.run(host='0.0.0.0', port=5000, debug=True)
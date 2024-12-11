# build at python3.8.10

from flask import Flask, request, jsonify
from flask_cors import CORS  # CORS 추가
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os
import logging

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 경고 및 오류 메시지만 출력
logging.getLogger('werkzeug').setLevel(logging.ERROR)  # Flask 로그 레벨 설정

app = Flask(__name__)
CORS(app)  # 모든 도메인에서의 CORS 요청 허용

# TensorFlow 모델 로드
def load_model():
    from model.model import get_model  # 모델 경로에 맞게 조정
    config = {
        # 모델 설정 (사용자 제공 코드 참조)
        'input_shape': [256, 256, 3],
        'batch_size': 4,
        'path_pretrained': None,
        'type_backbone': "blazepose",
        'type_loss_fn': 'wing',
        'seg_shape': [64, 64],
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
    model.load_weights("build_model.h5")
    return model

model = load_model()
print("모델이 성공적으로 로드되었습니다.")

# 이미지 전처리 함수
def preprocess_image(image, height, bmi):
    image = image.resize((256, 256))
    image_array = np.array(image) / 255.0
    image_batch = np.expand_dims(image_array, axis=0)  # (1, 256, 256, 3)
    real_data_batch = np.expand_dims(np.array([height, bmi]), axis=0)  # (1, 2)
    image_batch_4 = np.tile(image_batch, (4, 1, 1, 1))  # (4, 256, 256, 3)
    real_data_batch_4 = np.tile(real_data_batch, (4, 1))  # (4, 2)
    return [image_batch_4, real_data_batch_4]

# 예측 함수
def make_prediction(image, height, bmi):
    preprocessed = preprocess_image(image, height, bmi)
    result = model.predict(preprocessed)
    rounded_result = [round(x, 2) for x in result.flatten().tolist()]  # 소수점 두 자리로 제한
    return rounded_result

# 홈 엔드포인트
@app.route('/', methods=['GET'])
def home():
    return "Flask server is running. Use the '/predict' endpoint to make predictions."

# API 엔드포인트
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': '이미지가 제공되지 않았습니다. "image" 필드를 포함해주세요.'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': '선택된 이미지 파일이 없습니다.'}), 400
    
    # height와 bmi 데이터를 요청에서 가져오기
    height = request.form.get('height', type=float)
    bmi = request.form.get('bmi', type=float)
    
    if height is None or bmi is None:
        return jsonify({'error': 'height와 bmi 값이 제공되지 않았습니다. "height"와 "bmi" 필드를 포함해주세요.'}), 400
    
    try:
        # 이미지 파일 열기
        image = Image.open(file.stream).convert('RGB')
        
        # 예측 수행
        result = make_prediction(image, height, bmi)
        
        # 결과를 프론트엔드로 반환
        return jsonify({'status': 'success', 'result': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Flask 서버 실행
    app.run(host='0.0.0.0', port=5000, debug=False)

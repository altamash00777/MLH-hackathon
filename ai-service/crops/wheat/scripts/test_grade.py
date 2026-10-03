import tensorflow as tf
import numpy as np
from PIL import Image

MODEL_PATH = "crops/wheat/models/grade_model_v3.keras"

IMAGE_PATH = r"C:\Users\musharraf\Downloads\wheat\grade C\Grainset_wheat_2020-07-30-11-03-50_2_p600s.png"

CLASS_NAMES = ["Grade A", "Grade B", "Grade C"]

print("\n========================================")
print("WHEAT GRADE PREDICTION")
print("========================================\n")

# Load model
model = tf.keras.models.load_model(MODEL_PATH)

# Load image
img = Image.open(IMAGE_PATH).convert("RGB")
img = img.resize((224, 224))

# IMPORTANT:
# V3 model already contains MobileNetV2 preprocess_input.
# So DO NOT preprocess the image here.
img_array = np.array(img, dtype=np.float32)
img_array = np.expand_dims(img_array, axis=0)

# Prediction
predictions = model.predict(img_array, verbose=0)[0]

print(f"Grade A: {predictions[0] * 100:.2f} %")
print(f"Grade B: {predictions[1] * 100:.2f} %")
print(f"Grade C: {predictions[2] * 100:.2f} %")

predicted_index = np.argmax(predictions)
predicted_grade = CLASS_NAMES[predicted_index]
confidence = predictions[predicted_index] * 100

print("\n----------------------------------------")
print(f"Predicted Grade: {predicted_grade}")
print(f"Confidence: {confidence:.2f} %")
print("========================================")
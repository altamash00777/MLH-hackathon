import tensorflow as tf
from PIL import Image
import numpy as np

MODEL_PATH = "crops/wheat/models/wheat_verifier/wheat_verifier.keras"

IMAGE_PATH = r"C:\Users\musharraf\Downloads\wheat\grade C\Grainset_wheat_2020-07-30-11-03-50_2_p600s.png"

IMG_SIZE = (224, 224)

model = tf.keras.models.load_model(MODEL_PATH)

image = Image.open(IMAGE_PATH).convert("RGB")
image = image.resize(IMG_SIZE)

img_array = np.array(image)
img_array = np.expand_dims(img_array, axis=0)
img_array = img_array / 255.0

prediction = model.predict(img_array, verbose=0)[0][0]

wheat_probability = prediction * 100
not_wheat_probability = (1 - prediction) * 100

print()
print("========================================")
print("WHEAT VERIFICATION")
print("========================================")

print(f"Wheat:     {wheat_probability:.2f}%")
print(f"Not Wheat: {not_wheat_probability:.2f}%")

print("----------------------------------------")

if prediction >= 0.5:
    print("Result: WHEAT")
else:
    print("Result: NOT WHEAT")

print("========================================")
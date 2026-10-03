import tensorflow as tf
import numpy as np
from PIL import Image
import os

MODEL_PATH = "crops/wheat/models/grade_model_v3.keras"

DATASET_PATH = r"C:\Users\musharraf\Downloads\wheat"

CLASS_NAMES = ["grade A", "grade B", "grade C"]

print("\nLoading Grade V3 model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully.")

confusion_matrix = np.zeros((3, 3), dtype=int)

for actual_index, class_name in enumerate(CLASS_NAMES):

    folder_path = os.path.join(DATASET_PATH, class_name)

    image_files = [
        f for f in os.listdir(folder_path)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    print("\n----------------------------------------")
    print(f"Actual: {class_name}")
    print(f"Images: {len(image_files)}")
    print("----------------------------------------")

    for image_file in image_files:

        image_path = os.path.join(folder_path, image_file)

        try:
            # Load image
            img = Image.open(image_path).convert("RGB")

            # Resize
            img = img.resize((224, 224))

            # IMPORTANT:
            # The V3 model already contains
            # MobileNetV2 preprocess_input.
            #
            # Therefore DO NOT call
            # mobilenet_v2.preprocess_input() here.

            img_array = np.array(img, dtype=np.float32)

            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)

            # Prediction
            prediction = model.predict(img_array, verbose=0)[0]

            predicted_index = np.argmax(prediction)

            confusion_matrix[actual_index][predicted_index] += 1

        except Exception as e:
            print(f"Error: {image_file}")
            print(e)


print("\n")
print("========================================")
print("GRADE V3 CONFUSION MATRIX")
print("========================================")
print()

print("                 Predicted")
print("             A       B       C")
print("----------------------------------------")

for i, class_name in enumerate(CLASS_NAMES):

    print(
        f"Actual {class_name[-1].upper()}     "
        f"{confusion_matrix[i][0]:4d}    "
        f"{confusion_matrix[i][1]:4d}    "
        f"{confusion_matrix[i][2]:4d}"
    )


print("\n========================================")
print("CLASS-WISE ACCURACY")
print("========================================")

total_correct = 0
total_images = 0

for i, class_name in enumerate(CLASS_NAMES):

    class_total = np.sum(confusion_matrix[i])
    class_correct = confusion_matrix[i][i]

    accuracy = (
        class_correct / class_total * 100
        if class_total > 0
        else 0
    )

    print(
        f"{class_name.title()}: "
        f"{accuracy:.2f}% "
        f"({class_correct}/{class_total})"
    )

    total_correct += class_correct
    total_images += class_total


overall_accuracy = (
    total_correct / total_images * 100
    if total_images > 0
    else 0
)

print("\n========================================")
print("OVERALL ACCURACY")
print("========================================")

print(
    f"{overall_accuracy:.2f}% "
    f"({total_correct}/{total_images})"
)

print("========================================")
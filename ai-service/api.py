from fastapi import FastAPI, UploadFile, File

import tensorflow as tf
import numpy as np
from PIL import Image
import io


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="DISHAA AI Service",
    description="AI service for wheat verification and quality grading",
    version="1.0.0"
)


# ============================================================
# MODEL PATHS
# ============================================================

WHEAT_MODEL_PATH = (
    "crops/wheat/models/wheat_verifier/wheat_verifier.keras"
)

GRADE_MODEL_PATH = (
    "crops/wheat/models/grade_model_v3.keras"
)


# ============================================================
# GRADE CLASSES
# ============================================================

GRADE_CLASSES = [
    "Grade A",
    "Grade B",
    "Grade C"
]


# ============================================================
# LOAD MODELS
# ============================================================

print("Loading wheat model...")

wheat_model = tf.keras.models.load_model(
    WHEAT_MODEL_PATH
)

print("Wheat model loaded successfully.")


print("Loading grade model...")

grade_model = tf.keras.models.load_model(
    GRADE_MODEL_PATH
)

print("Grade model loaded successfully.")


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "message": "KissanConnect AI Service is running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy"
    }
    
# ============================================================
# WHEAT PREDICTION
# ============================================================

def predict_wheat(image):

    # Resize image
    image = image.resize((224, 224))

    # Convert to NumPy
    image_array = np.array(
        image,
        dtype=np.float32
    )

    # Wheat model was trained using /255.0
    image_array = image_array / 255.0

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # Prediction
    prediction = wheat_model.predict(
        image_array,
        verbose=0
    )[0][0]

    wheat_probability = float(prediction)

    return wheat_probability


# ============================================================
# GRADE PREDICTION
# ============================================================

def predict_grade(image):

    # Resize image
    image = image.resize((224, 224))

    # Convert to NumPy
    image_array = np.array(
        image,
        dtype=np.float32
    )

    # IMPORTANT:
    # grade_model_v3.keras already contains
    # MobileNetV2 preprocess_input inside the model.
    #
    # Therefore we DO NOT preprocess the image here.

    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    # Prediction
    predictions = grade_model.predict(
        image_array,
        verbose=0
    )[0]

    predicted_index = int(
        np.argmax(predictions)
    )

    predicted_grade = GRADE_CLASSES[
        predicted_index
    ]

    confidence = float(
        predictions[predicted_index]
    )

    return (
        predicted_grade,
        confidence,
        predictions
    )


# ============================================================
# PREDICT ENDPOINT
# ============================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # Read uploaded image
    image_bytes = await file.read()

    # Convert bytes to PIL image
    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")


    # ========================================================
    # STEP 1 — WHEAT VERIFICATION
    # ========================================================

    wheat_probability = predict_wheat(
        image
    )

    not_wheat_probability = (
        1.0 - wheat_probability
    )


    # ========================================================
    # NOT WHEAT
    # ========================================================

    if wheat_probability < 0.5:

        return {
            "success": True,
            "is_wheat": False,
            "wheat_confidence": wheat_probability,
            "not_wheat_confidence": not_wheat_probability,
            "grade": None,
            "grade_confidence": None,
            "grade_probabilities": None
        }


    # ========================================================
    # STEP 2 — GRADE PREDICTION
    # ========================================================

    (
        predicted_grade,
        grade_confidence,
        predictions
    ) = predict_grade(
        image
    )


    # ========================================================
    # RETURN RESULT
    # ========================================================

    return {
        "success": True,
        "is_wheat": True,
        "wheat_confidence": wheat_probability,
        "not_wheat_confidence": not_wheat_probability,
        "grade": predicted_grade,
        "grade_confidence": grade_confidence,
        "grade_probabilities": {
            "Grade A": float(predictions[0]),
            "Grade B": float(predictions[1]),
            "Grade C": float(predictions[2])
        }
    }
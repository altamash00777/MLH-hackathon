import streamlit as st
import tensorflow as tf
import numpy as np
from PIL import Image


# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="DISHAA - Wheat Quality Detection",
    page_icon="🌾",
    layout="centered"
)


# ============================================================
# MODEL PATHS
# ============================================================

WHEAT_MODEL_PATH = "crops/wheat/models/wheat_verifier/wheat_verifier.keras"
GRADE_MODEL_PATH = "crops/wheat/models/grade_model_v3.keras"


# ============================================================
# CLASS NAMES
# ============================================================

GRADE_CLASSES = [
    "Grade A",
    "Grade B",
    "Grade C"
]


# ============================================================
# LOAD MODELS
# ============================================================

@st.cache_resource
def load_models():

    wheat_model = tf.keras.models.load_model(
        WHEAT_MODEL_PATH
    )

    grade_model = tf.keras.models.load_model(
        GRADE_MODEL_PATH
    )

    return wheat_model, grade_model


wheat_model, grade_model = load_models()


# ============================================================
# WHEAT PREDICTION
# ============================================================

def predict_wheat(image):

    # Resize
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

    # Resize
    image = image.resize((224, 224))

    # Convert to NumPy
    image_array = np.array(
        image,
        dtype=np.float32
    )

    # IMPORTANT:
    #
    # grade_model_v3.keras already contains
    # MobileNetV2 preprocess_input INSIDE the model.
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
# TITLE
# ============================================================

st.title("🌾 DISHAA")

st.subheader(
    "Wheat Quality Detection"
)

st.write(
    "Upload a wheat harvest image to check whether it is "
    "wheat and predict its quality grade."
)


# ============================================================
# IMAGE UPLOAD
# ============================================================

uploaded_file = st.file_uploader(
    "Upload Wheat Image",
    type=[
        "jpg",
        "jpeg",
        "png"
    ]
)


# ============================================================
# AUTOMATIC ANALYSIS
# ============================================================

if uploaded_file is not None:

    # Open uploaded image
    image = Image.open(
        uploaded_file
    ).convert("RGB")

    # Show uploaded image
    st.image(
        image,
        caption="Uploaded Image",
        use_container_width=True
    )

    st.write("")

    # ========================================================
    # STEP 1 — WHEAT VERIFICATION
    # ========================================================

    with st.spinner(
        "Checking whether the image contains wheat..."
    ):

        wheat_probability = predict_wheat(
            image
        )

    not_wheat_probability = (
        1.0 - wheat_probability
    )

    st.subheader(
        "🌾 Wheat Verification"
    )

    col1, col2 = st.columns(2)

    with col1:

        st.metric(
            "Wheat Confidence",
            f"{wheat_probability * 100:.2f}%"
        )

    with col2:

        st.metric(
            "Not Wheat",
            f"{not_wheat_probability * 100:.2f}%"
        )


    # ========================================================
    # NOT WHEAT
    # ========================================================

    if wheat_probability < 0.5:

        st.error(
            "❌ This image does not appear to be wheat."
        )

        st.info(
            "Please upload a clear image of harvested wheat."
        )


    # ========================================================
    # WHEAT DETECTED
    # ========================================================

    else:

        st.success(
            f"✅ Wheat detected "
            f"({wheat_probability * 100:.2f}% confidence)"
        )


        # ====================================================
        # STEP 2 — GRADE PREDICTION
        # ====================================================

        with st.spinner(
            "Analyzing wheat quality..."
        ):

            (
                predicted_grade,
                confidence,
                predictions
            ) = predict_grade(
                image
            )


        st.subheader(
            "📊 Wheat Quality Grade"
        )


        # ====================================================
        # PREDICTED GRADE
        # ====================================================

        if predicted_grade == "Grade A":

            st.success(
                f"🏆 Predicted Grade: {predicted_grade}"
            )

        elif predicted_grade == "Grade B":

            st.warning(
                f"🥈 Predicted Grade: {predicted_grade}"
            )

        else:

            st.info(
                f"🥉 Predicted Grade: {predicted_grade}"
            )


        # ====================================================
        # GRADE CONFIDENCE
        # ====================================================

        st.metric(
            "Grade Confidence",
            f"{confidence * 100:.2f}%"
        )


        # ====================================================
        # ALL GRADE PROBABILITIES
        # ====================================================

        st.subheader(
            "Grade Probabilities"
        )

        col1, col2, col3 = st.columns(3)

        with col1:

            st.metric(
                "Grade A",
                f"{predictions[0] * 100:.2f}%"
            )

        with col2:

            st.metric(
                "Grade B",
                f"{predictions[1] * 100:.2f}%"
            )

        with col3:

            st.metric(
                "Grade C",
                f"{predictions[2] * 100:.2f}%"
            )


        # ====================================================
        # PROGRESS BARS
        # ====================================================

        st.write("Grade A")

        st.progress(
            float(predictions[0])
        )

        st.write("Grade B")

        st.progress(
            float(predictions[1])
        )

        st.write("Grade C")

        st.progress(
            float(predictions[2])
        )


# ============================================================
# FOOTER
# ============================================================

st.divider()

st.caption(
    "KissanConnect • AI-based Wheat Verification and Quality Grading"
)
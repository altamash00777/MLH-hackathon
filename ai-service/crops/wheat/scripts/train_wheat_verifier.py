import os
import random
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split

# =========================
# CONFIG
# =========================

DATASET_PATH = "crops/wheat/dataset/verifier"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
SEED = 42
EPOCHS = 10

MODEL_PATH = "crops/wheat/models/wheat_verifier/wheat_verifier.keras"

random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)


# =========================
# CLASS NAMES
# =========================

class_names = [
    "not_wheat",
    "wheat"
]

class_to_label = {
    "not_wheat": 0,
    "wheat": 1
}


# =========================
# COLLECT IMAGES
# =========================

valid_extensions = (
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
)

all_paths = []
all_labels = []

for class_name in class_names:

    folder = os.path.join(DATASET_PATH, class_name)

    for filename in os.listdir(folder):

        file_path = os.path.join(folder, filename)

        if os.path.isfile(file_path) and filename.lower().endswith(valid_extensions):

            all_paths.append(file_path)
            all_labels.append(class_to_label[class_name])


print("========================================")
print("WHEAT VERIFIER DATASET")
print("========================================")

print("Total images:", len(all_paths))

print(
    "Not Wheat:",
    all_labels.count(0)
)

print(
    "Wheat:",
    all_labels.count(1)
)


# =========================
# TRAIN / VALIDATION SPLIT
# =========================

train_paths, val_paths, train_labels, val_labels = train_test_split(
    all_paths,
    all_labels,
    test_size=0.20,
    random_state=SEED,
    stratify=all_labels
)

print()
print("Training images:", len(train_paths))
print("Validation images:", len(val_paths))


# =========================
# IMAGE LOADING FUNCTION
# =========================

def load_image(path, label):

    image = tf.io.read_file(path)

    image = tf.image.decode_image(
        image,
        channels=3,
        expand_animations=False
    )

    image = tf.image.resize(
        image,
        IMG_SIZE
    )

    image = tf.cast(
        image,
        tf.float32
    ) / 255.0

    return image, label


# =========================
# DATASET
# =========================

train_ds = tf.data.Dataset.from_tensor_slices(
    (train_paths, train_labels)
)

val_ds = tf.data.Dataset.from_tensor_slices(
    (val_paths, val_labels)
)

train_ds = train_ds.shuffle(
    len(train_paths),
    seed=SEED
)

train_ds = train_ds.map(
    load_image,
    num_parallel_calls=tf.data.AUTOTUNE
)

val_ds = val_ds.map(
    load_image,
    num_parallel_calls=tf.data.AUTOTUNE
)

train_ds = train_ds.batch(BATCH_SIZE).prefetch(
    tf.data.AUTOTUNE
)

val_ds = val_ds.batch(BATCH_SIZE).prefetch(
    tf.data.AUTOTUNE
)


# =========================
# DATA AUGMENTATION
# =========================

augmentation = keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.08),
    layers.RandomZoom(0.10),
    layers.RandomContrast(0.10)
])


# =========================
# MOBILE NET V2
# =========================

base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False


# =========================
# MODEL
# =========================

inputs = keras.Input(
    shape=(224, 224, 3)
)

x = augmentation(inputs)

x = base_model(
    x,
    training=False
)

x = layers.GlobalAveragePooling2D()(x)

x = layers.Dropout(0.30)(x)

outputs = layers.Dense(
    1,
    activation="sigmoid"
)(x)

model = keras.Model(
    inputs,
    outputs
)


# =========================
# COMPILE
# =========================

model.compile(
    optimizer=keras.optimizers.Adam(
        learning_rate=0.0001
    ),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)


# =========================
# CALLBACKS
# =========================

os.makedirs(
    os.path.dirname(MODEL_PATH),
    exist_ok=True
)

callbacks = [

    keras.callbacks.ModelCheckpoint(
        MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        mode="max",
        verbose=1
    ),

    keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True,
        verbose=1
    )
]


# =========================
# TRAIN
# =========================

print()
print("========================================")
print("STARTING WHEAT VERIFIER TRAINING")
print("========================================")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=callbacks
)


# =========================
# FINAL EVALUATION
# =========================

loss, accuracy = model.evaluate(
    val_ds,
    verbose=1
)

print()
print("========================================")
print("FINAL VERIFIER RESULT")
print("========================================")

print(
    f"Validation Accuracy: {accuracy * 100:.2f}%"
)

print("========================================")


# =========================
# SAVE MODEL
# =========================

model.save(MODEL_PATH)

print()
print("Model saved to:")
print(MODEL_PATH)
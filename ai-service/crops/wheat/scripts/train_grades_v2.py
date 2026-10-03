import os
import random
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split


# ============================================================
# 1. SETTINGS
# ============================================================

DATASET_PATH = r"C:\Users\musharraf\Downloads\wheat"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
SEED = 42
EPOCHS = 15

MODEL_PATH = "crops/wheat/models/grade_model_v3.keras"


# ============================================================
# 2. FIX RANDOMNESS
# ============================================================

random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)


# ============================================================
# 3. READ IMAGES FROM YOUR EXISTING FOLDERS
# ============================================================

class_names = ["grade A", "grade B", "grade C"]

all_paths = []
all_labels = []

print("\nReading dataset...\n")

for label, class_name in enumerate(class_names):

    folder = os.path.join(DATASET_PATH, class_name)

    images = [
        f for f in os.listdir(folder)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    print(class_name, ":", len(images), "images")

    for filename in images:

        path = os.path.join(folder, filename)

        all_paths.append(path)
        all_labels.append(label)


all_paths = np.array(all_paths)
all_labels = np.array(all_labels)

print("\nTotal images:", len(all_paths))


# ============================================================
# 4. STRATIFIED TRAIN / VALIDATION SPLIT
# ============================================================

train_paths, val_paths, train_labels, val_labels = train_test_split(

    all_paths,
    all_labels,

    test_size=0.20,

    random_state=SEED,

    stratify=all_labels
)


print("\nTraining images:", len(train_paths))
print("Validation images:", len(val_paths))


print("\nTraining distribution:")

for i, name in enumerate(class_names):

    print(
        name,
        ":",
        np.sum(train_labels == i)
    )


print("\nValidation distribution:")

for i, name in enumerate(class_names):

    print(
        name,
        ":",
        np.sum(val_labels == i)
    )


# ============================================================
# 5. LOAD IMAGE FUNCTION
# ============================================================

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
    )

    return image, label


# ============================================================
# 6. CREATE TF DATASETS
# ============================================================

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


# ============================================================
# 7. DATA AUGMENTATION
# ============================================================

augmentation = keras.Sequential([

    layers.RandomFlip("horizontal"),

    layers.RandomRotation(0.08),

    layers.RandomZoom(0.10),

    layers.RandomContrast(0.10),

])


# ============================================================
# 8. PRE-TRAINED MOBILENETV2
# ============================================================

base_model = tf.keras.applications.MobileNetV2(

    input_shape=(224, 224, 3),

    include_top=False,

    weights="imagenet"

)


# Freeze the pre-trained layers first

base_model.trainable = False


# ============================================================
# 9. CREATE FINAL MODEL
# ============================================================

inputs = keras.Input(
    shape=(224, 224, 3)
)


x = augmentation(inputs)


x = tf.keras.applications.mobilenet_v2.preprocess_input(x)


x = base_model(
    x,
    training=False
)


x = layers.GlobalAveragePooling2D()(x)


x = layers.Dropout(0.4)(x)


x = layers.Dense(
    64,
    activation="relu"
)(x)


x = layers.Dropout(0.3)(x)


outputs = layers.Dense(
    3,
    activation="softmax"
)(x)


model = keras.Model(
    inputs,
    outputs
)


# ============================================================
# 10. BATCH + PREFETCH
# ============================================================

train_ds = train_ds.batch(
    BATCH_SIZE
).prefetch(
    tf.data.AUTOTUNE
)


val_ds = val_ds.batch(
    BATCH_SIZE
).prefetch(
    tf.data.AUTOTUNE
)


# ============================================================
# 11. COMPILE
# ============================================================

model.compile(

    optimizer=keras.optimizers.Adam(
        learning_rate=0.0001
    ),

    loss="sparse_categorical_crossentropy",

    metrics=["accuracy"]

)


# ============================================================
# 12. CALLBACKS
# ============================================================

os.makedirs(
    "models",
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

        patience=4,

        restore_best_weights=True,

        verbose=1

    )

]


# ============================================================
# 13. SHOW MODEL
# ============================================================

model.summary()


# ============================================================
# 14. TRAIN
# ============================================================

print("\n========================================")
print("STARTING V3 TRAINING")
print("========================================\n")


history = model.fit(

    train_ds,

    validation_data=val_ds,

    epochs=EPOCHS,

    callbacks=callbacks

)


# ============================================================
# 15. FINAL VALIDATION
# ============================================================

print("\n========================================")
print("FINAL VALIDATION")
print("========================================")


loss, accuracy = model.evaluate(
    val_ds
)


print(
    "\nValidation Accuracy:",
    round(accuracy * 100, 2),
    "%"
)


# ============================================================
# 16. SAVE FINAL MODEL
# ============================================================

model.save(
    MODEL_PATH
)


print("\n========================================")
print("V3 TRAINING COMPLETED")
print("========================================")


print(
    "Model saved at:",
    MODEL_PATH
)
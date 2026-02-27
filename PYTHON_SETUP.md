# GIMA: Desktop Setup Guide

If you prefer running GIMA as a desktop application (or if the web version has issues loading), follow these steps.

## Prerequisites

You need Python installed. Then install the required libraries:

```bash
pip install opencv-python mediapipe numpy
```

## Model Download

The Python version requires the `pose_landmarker_heavy.task` file in the same directory.
**You must download this file manually** (auto-download is blocked):
[Download Model File](https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task)

Save it as `pose_landmarker_heavy.task` in the `dsrsr` folder.

## Running the Application

Run the script directly:

```bash
python gima.py
```

## Controls

- **q**: Quit the application

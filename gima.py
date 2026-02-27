import cv2
import mediapipe as mp
import numpy as np
import math
import time

# --- CONFIGURATION ---
class Config:
    CALIBRATION_FRAMES = 40
    TILT_THRESHOLD = 5.0
    # Colors (B, G, R)
    COLOR_BLACK = (10, 10, 10)
    COLOR_WHITE = (240, 240, 240)
    COLOR_GREEN = (65, 255, 0)  # Neon Green
    COLOR_RED = (49, 49, 255)   # Neon Red
    COLOR_BLUE = (255, 212, 0)  # Neon Blue/Cyan
    
    FONT = cv2.FONT_HERSHEY_SIMPLEX

# --- SETUP MEDIAPIPE ---
BaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

# --- HELPER FUNCTIONS ---
def calculate_angle_180(a, b, c):
    """Calculates angle between three points (0-180 degrees)"""
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    return angle if angle <= 180.0 else 360 - angle

def calculate_angle_360(a, b, c):
    """Calculates full 360 angle"""
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = math.atan2(c[1]-b[1], c[0]-b[0]) - math.atan2(a[1]-b[1], a[0]-b[0])
    angle = (radians * 180.0 / math.pi)
    return angle % 360

def calculate_spine_tilt(shoulder_mid, hip_mid):
    """Calculates variation from vertical axis"""
    delta_x = shoulder_mid[0] - hip_mid[0]
    delta_y = shoulder_mid[1] - hip_mid[1]
    if delta_y == 0: return 90
    tilt_rad = math.atan(delta_x / abs(delta_y))
    return tilt_rad * 180.0 / math.pi

def draw_text_with_bg(img, text, pos, font_scale=0.6, color=Config.COLOR_WHITE, thickness=1, bg_color=(0,0,0)):
    """Draws text with a subtle background for better visibility"""
    (w, h), _ = cv2.getTextSize(text, Config.FONT, font_scale, thickness)
    x, y = pos
    cv2.rectangle(img, (x-5, y-h-5), (x+w+5, y+5), bg_color, -1)
    cv2.putText(img, text, pos, Config.FONT, font_scale, color, thickness)

# --- MAIN APP ---
def run_gima():
    # Initialize MediaPipe
    model_path = 'pose_landmarker_heavy.task'
    
    # Check if model exists, if not, print warning
    import os
    if not os.path.exists(model_path):
        print(f"WARNING: Model file '{model_path}' not found.")
        print("Please download it from: https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task")
        # Fallback to lite model if heavy is missing, or just exit
        # For now we'll assume user will get it or has it from previous setup
    
    try:
        options = PoseLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=model_path),
            running_mode=VisionRunningMode.VIDEO
        )
        landmarker = PoseLandmarker.create_from_options(options)
    except Exception as e:
        print(f"Error initializing MediaPipe: {e}")
        return

    cap = cv2.VideoCapture(0)
    
    # State variables
    default_shoulder_y = None
    calibration_frames = 0
    is_balanced = False
    
    print("GIMA System Active. Press 'q' to quit.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret: break

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        
        # Convert for MediaPipe
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        timestamp = int(cv2.getTickCount() / cv2.getTickFrequency() * 1000)
        
        # Detect
        result = landmarker.detect_for_video(mp_image, timestamp)
        
        # Create output canvas (Semi-transparent overlay on video, or pure data view)
        # We'll use the video frame but darken it slightly for UI pop
        canvas = frame.copy()
        overlay = np.zeros((h, w, 3), dtype=np.uint8)
        
        # Draw Center Line
        cv2.line(canvas, (w//2, 0), (w//2, h), (100, 100, 100), 1)
        
        if result.pose_landmarks:
            for landmarks in result.pose_landmarks:
                def get_pt(idx): return [landmarks[idx].x, landmarks[idx].y]
                
                # 1. Calculations
                m_shoulder = [(landmarks[11].x + landmarks[12].x)/2, (landmarks[11].y + landmarks[12].y)/2]
                m_hippy = [(landmarks[23].x + landmarks[24].x)/2, (landmarks[23].y + landmarks[24].y)/2]
                m_knee = [(landmarks[25].x + landmarks[26].x)/2, (landmarks[25].y + landmarks[26].y)/2]
                
                # 2. Balance Check
                tilt_angle = calculate_spine_tilt(m_shoulder, m_hippy)
                is_balanced = abs(tilt_angle) < Config.TILT_THRESHOLD
                
                # Visual Spine
                spine_start = (int(m_shoulder[0] * w), int(m_shoulder[1] * h))
                spine_end = (int(m_hippy[0] * w), int(m_hippy[1] * h))
                spine_color = Config.COLOR_GREEN if is_balanced else Config.COLOR_RED
                cv2.line(canvas, spine_start, spine_end, spine_color, 4)
                
                # 3. Logic Branch
                if not is_balanced:
                    # WARNING STATE
                    calibration_frames = 0
                    default_shoulder_y = None
                    
                    # Dim screen
                    canvas = cv2.addWeighted(canvas, 0.6, np.zeros(canvas.shape, canvas.dtype), 0, 0)
                    
                    # Warning HUD
                    draw_text_with_bg(canvas, "!!! ALIGN SPINE !!!", (w//2 - 150, h//2), 1.2, Config.COLOR_RED)
                    draw_text_with_bg(canvas, f"TILT: {tilt_angle:.1f}", (w//2 - 80, h//2 + 40), 0.8, Config.COLOR_RED)
                    
                    # Arrow
                    direction = -1 if tilt_angle > 0 else 1
                    start_pt = (w//2 + (100 * direction), h//2 + 100)
                    end_pt = (w//2, h//2 + 100)
                    cv2.arrowedLine(canvas, start_pt, end_pt, Config.COLOR_BLUE, 4)
                    
                else:
                    # BALANCED STATE
                    # Calibration
                    current_y = m_shoulder[1]
                    if calibration_frames < Config.CALIBRATION_FRAMES:
                        if default_shoulder_y is None: default_shoulder_y = current_y
                        else: default_shoulder_y = (default_shoulder_y + current_y) / 2
                        calibration_frames += 1
                        
                        # Progress bar
                        pct = calibration_frames / Config.CALIBRATION_FRAMES
                        bar_w = 200
                        cv2.rectangle(canvas, (w//2 - 100, 80), (w//2 - 100 + int(bar_w * pct), 90), Config.COLOR_BLUE, -1)
                        draw_text_with_bg(canvas, "CALIBRATING...", (w//2 - 60, 60), 0.6, Config.COLOR_BLUE)
                        shoulder_pct = 100.0
                    else:
                        shoulder_pct = (default_shoulder_y / current_y) * 100
                    
                    # Kinematics
                    angles = {
                        "L_ELBOW": calculate_angle_180(get_pt(11), get_pt(13), get_pt(15)),
                        "R_ELBOW": calculate_angle_180(get_pt(12), get_pt(14), get_pt(16)),
                        "L_ARMPIT": calculate_angle_180(get_pt(23), get_pt(11), get_pt(13)),
                        "BACK": calculate_angle_360(m_shoulder, m_hippy, m_knee)
                    }
                    
                    # Draw Skeleton (Minimalist)
                    connections = mp.solutions.pose.POSE_CONNECTIONS
                    status_color = Config.COLOR_GREEN
                    for connection in connections:
                        start_idx = connection[0]
                        end_idx = connection[1]
                        
                        # Only draw upper body + legs for clean look
                        if start_idx > 10 and end_idx > 10: 
                            ps = (int(landmarks[start_idx].x * w), int(landmarks[start_idx].y * h))
                            pe = (int(landmarks[end_idx].x * w), int(landmarks[end_idx].y * h))
                            cv2.line(canvas, ps, pe, Config.COLOR_WHITE, 2)
                            cv2.circle(canvas, ps, 3, status_color, -1)
                            cv2.circle(canvas, pe, 3, status_color, -1)

                    # HUD
                    # Left Panel: Data
                    y_off = 100
                    for k, v in angles.items():
                        draw_text_with_bg(canvas, f"{k}: {int(v)}", (30, y_off), 0.6)
                        y_off += 30
                    
                    # Center: Metrics
                    color_level = Config.COLOR_GREEN if shoulder_pct > 98 else Config.COLOR_BLUE
                    draw_text_with_bg(canvas, f"LEVEL: {shoulder_pct:.1f}%", (w//2 - 80, 40), 0.8, color_level)

        # Header
        cv2.rectangle(canvas, (0, 0), (w, 30), (0, 0, 0), -1)
        cv2.putText(canvas, "GIMA | Geometric Intelligent Movement Analysis", (20, 20), Config.FONT, 0.5, (255, 255, 255), 1)

        cv2.imshow('GIMA Desktop', canvas)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    run_gima()

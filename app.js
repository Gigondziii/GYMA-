/**
 * GIMA - Geometric Intelligent Movement Analysis
 * Real-time Bio-Mechanical Feedback Engine
 */

import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.3";

// ========================================
// Configuration & State
// ========================================

const config = {
  CALIBRATION_FRAMES: 40,
  TILT_THRESHOLD: 5.0,
  MODEL_PATH:
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/1/pose_landmarker_heavy.task",
  VELOCITY_THRESHOLD: 0.1, // Drastically increased (less body movement spam)
  CURL_FLEXED_THRESHOLD: 60, 
  CURL_EXTENDED_THRESHOLD: 150, 
  MIN_REP_DURATION: 500, // Very fast (0.5s) - won't trigger unless doing reps crazy fast
  SHOULDER_TOLERANCE: 0.08, // More breathing room for shoulders
  ARM_VELOCITY_THRESHOLD: 5.0, // Needs extreme movement to trigger
};

let state = {
  poseLandmarker: null,
  isRunning: false,
  isBalanced: false,
  calibrationFrames: 0,
  defaultShoulderY: null,
  lastVideoTime: -1,
  animationFrameId: null,
  cameraFacingMode: 'user', // 'user' or 'environment'
  
  // Rep Counter State
  reps: 0,
  repPhase: 'neutral', // 'neutral', 'up'
  repStartTime: 0,
  lastRepEndTime: 0,
  
  // Speed State
  velocity: 0,
  lastFrameTime: 0,
  speedWarningActive: false,
  shoulderWarningActive: false,
  
  // Arm Velocity State
  lastLeftElbowAngle: null,
  lastRightElbowAngle: null,
  lastArmCheckTime: 0
};

// ========================================
// DOM Elements
// ========================================

const elements = {
  video: document.getElementById("webcam"),
  canvas: document.getElementById("outputCanvas"),
  startBtn: document.getElementById("startBtn"),
  resetBtn: document.getElementById("resetBtn"),
  cameraToggleBtn: document.getElementById("cameraToggleBtn"),

  // Status
  statusIndicator: document.getElementById("statusIndicator"),
  statusText: document.getElementById("statusText"),

  // Metrics
  alignmentValue: document.getElementById("alignmentValue"),
  ringPercent: document.getElementById("ringPercent"),
  progressCircle: document.getElementById("progressCircle"),
  tiltValue: document.getElementById("tiltValue"),
  calibrationValue: document.getElementById("calibrationValue"),
  calibrationProgress: document.getElementById("calibrationProgress"),

  // Angles
  leftElbow: document.getElementById("leftElbow"),
  rightElbow: document.getElementById("rightElbow"),
  leftArmpit: document.getElementById("leftArmpit"),
  rightArmpit: document.getElementById("rightArmpit"),
  backAngle: document.getElementById("backAngle"),

  // Overlays
  warningOverlay: document.getElementById("warningOverlay"),
  warningText: document.getElementById("warningText"),
  warningArrow: document.getElementById("warningArrow"),
  calibrationOverlay: document.getElementById("calibrationOverlay"),
  calibrationBarFill: document.getElementById("calibrationBarFill"),

  // Messages
  statusMessages: document.getElementById("statusMessages"),

  // Performance
  repCount: document.getElementById("repCount"),
  velocityValue: document.getElementById("velocityValue"),
  speedWarningOverlay: document.getElementById("speedWarningOverlay"),
  shoulderWarningOverlay: document.getElementById("shoulderWarningOverlay"),
};

const ctx = elements.canvas.getContext("2d");

// ========================================
// Helper Functions - Angle Calculations
// ========================================

function calculateAngle180(a, b, c) {
  const radians =
    Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  return angle <= 180.0 ? angle : 360 - angle;
}

function calculateAngle360(a, b, c) {
  const radians =
    Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
  const angle = (radians * 180.0) / Math.PI;
  return ((angle % 360) + 360) % 360;
}

function calculateSpineTilt(shoulderMid, hipMid) {
  const deltaX = shoulderMid[0] - hipMid[0];
  const deltaY = shoulderMid[1] - hipMid[1];

  if (Math.abs(deltaY) < 0.001) return 90;

  const tiltRad = Math.atan(deltaX / Math.abs(deltaY));
  return (tiltRad * 180.0) / Math.PI;
}

// ========================================
// MediaPipe Initialization
// ========================================

async function initializePoseDetection() {
  updateStatus("Initializing", "loading");

  try {
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm",
    );

    state.poseLandmarker = await PoseLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath: config.MODEL_PATH,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      },
    );

    updateStatus("Ready", "success");
    elements.startBtn.disabled = false;
    showMessage("System ready. Click 'Start Analysis' to begin.", "success");
  } catch (error) {
    console.error("Failed to initialize pose detection:", error);
    updateStatus("Error", "error");
    showMessage(
      "Failed to load pose detection model. Check console for details.",
      "warning",
    );
  }
}

// ========================================
// Camera & Video Setup
// ========================================

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 1280,
        height: 720,
        facingMode: state.cameraFacingMode,
      },
    });

    elements.video.srcObject = stream;
    elements.video.addEventListener("loadeddata", () => {
      resizeCanvas();
      state.isRunning = true;
      updateStatus("Active", "success");
      requestAnimationFrame(processFrame);
    });
  } catch (error) {
    console.error("Camera access denied:", error);
    updateStatus("Camera Error", "error");
    showMessage(
      "Camera access denied. Please enable camera permissions.",
      "warning",
    );
  }
}

function resizeCanvas() {
  elements.canvas.width = elements.video.videoWidth;
  elements.canvas.height = elements.video.videoHeight;
}

// ========================================
// Main Processing Loop
// ========================================

function processFrame() {
  if (!state.isRunning) return;

  const currentTime = performance.now();

  if (
    elements.video.currentTime !== state.lastVideoTime &&
    state.poseLandmarker
  ) {
    state.lastVideoTime = elements.video.currentTime;

    const results = state.poseLandmarker.detectForVideo(
      elements.video,
      currentTime,
    );

    // Clear canvas
    ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);

    if (results.landmarks && results.landmarks.length > 0) {
      processLandmarks(results.landmarks[0]);
    } else {
      showMessage("No pose detected. Please stand in view.", "warning");
    }
  }

  state.animationFrameId = requestAnimationFrame(processFrame);
}

// ========================================
// Landmark Processing & Analysis
// ========================================

function processLandmarks(landmarks) {
  const w = elements.canvas.width;
  const h = elements.canvas.height;

  // Get key points
  const getLM = (idx) => [landmarks[idx].x, landmarks[idx].y];

  // Calculate midpoints
  const shoulderMid = [
    (landmarks[11].x + landmarks[12].x) / 2,
    (landmarks[11].y + landmarks[12].y) / 2,
  ];
  const hipMid = [
    (landmarks[23].x + landmarks[24].x) / 2,
    (landmarks[23].y + landmarks[24].y) / 2,
  ];
  const kneeMid = [
    (landmarks[25].x + landmarks[26].x) / 2,
    (landmarks[25].y + landmarks[26].y) / 2,
  ];

  // Calculate tilt
  const tiltAngle = calculateSpineTilt(shoulderMid, hipMid);
  state.isBalanced = Math.abs(tiltAngle) < config.TILT_THRESHOLD;

  // Draw spine line
  const spineColor = state.isBalanced ? "#00ff41" : "#ff3131";
  drawLine(
    [shoulderMid[0] * w, shoulderMid[1] * h],
    [hipMid[0] * w, hipMid[1] * h],
    spineColor,
    6,
  );

  // Update tilt display
  elements.tiltValue.textContent = `${tiltAngle.toFixed(1)}°`;
  elements.tiltValue.style.color = state.isBalanced ? "#00ff41" : "#ff3131";

  // Handle balance state
  if (!state.isBalanced) {
    handleUnbalanced(tiltAngle);
    return;
  } else {
    hideWarning();
  }

  // Process balanced state
  const backAngle = calculateAngle360(shoulderMid, hipMid, kneeMid);

  // Calibration logic
  const currentY = shoulderMid[1];
  if (state.calibrationFrames < config.CALIBRATION_FRAMES) {
    handleCalibration(currentY);
  } else {
    hideCalibration();

    // Calculate shoulder level percentage
    const shoulderPct = state.defaultShoulderY
      ? (state.defaultShoulderY / currentY) * 100
      : 100.0;

    updateAlignment(shoulderPct);

    // Draw skeleton
    drawSkeleton(landmarks, w, h);

    // Calculate and display angles
    const angles = {
      leftArmpit: calculateAngle180(getLM(23), getLM(11), getLM(13)),
      rightArmpit: calculateAngle180(getLM(24), getLM(12), getLM(14)),
      leftElbow: calculateAngle180(getLM(11), getLM(13), getLM(15)),
      rightElbow: calculateAngle180(getLM(12), getLM(14), getLM(16)),
    };

    updateAngles(angles, backAngle);

    // Update Performance Metrics (Reps & Speed)
    updatePerformance(hipMid, performance.now(), landmarks);
  }
}

// ========================================
// Balance & Calibration Handlers
// ========================================

function handleUnbalanced(tiltAngle) {
  state.calibrationFrames = 0;
  state.defaultShoulderY = null;

  showWarning(tiltAngle);
  showMessage("Align your body with the center line", "warning");

  // Dim canvas
  ctx.globalAlpha = 0.5;
}

function handleCalibration(currentY) {
  if (state.defaultShoulderY === null) {
    state.defaultShoulderY = currentY;
  } else {
    state.defaultShoulderY = (state.defaultShoulderY + currentY) / 2;
  }

  state.calibrationFrames++;

  const progress = (state.calibrationFrames / config.CALIBRATION_FRAMES) * 100;
  elements.calibrationValue.textContent = `${Math.round(progress)}%`;
  elements.calibrationProgress.style.width = `${progress}%`;
  elements.calibrationBarFill.style.width = `${progress}%`;

  showCalibration();
  showMessage(
    `Calibrating... ${state.calibrationFrames}/${config.CALIBRATION_FRAMES}`,
    "info",
  );
  showMessage(
    `Calibrating... ${state.calibrationFrames}/${config.CALIBRATION_FRAMES}`,
    "info",
  );
}

// ========================================
// Performance Logic (Reps & Speed)
// ========================================

function updatePerformance(hipMid, currentTime, landmarks) {
  const currentY = hipMid[1];
  
  // Helper to get coordinates
  const getLM = (idx) => [landmarks[idx].x, landmarks[idx].y];

  // Initialize standing position after calibration
  if (state.standingHipY === null && state.calibrationFrames >= config.CALIBRATION_FRAMES) {
      state.standingHipY = currentY;
      state.lastHipY = currentY;
      state.lastFrameTime = currentTime;
      return; 
  }

  if (state.standingHipY === null) return;

  // 1. Calculate Velocity
  const dt = currentTime - state.lastFrameTime;
  if (dt > 0) {
      const dy = Math.abs(currentY - state.lastHipY);
      state.velocity = dy / dt;
      const displayVelocity = (state.velocity * 1000).toFixed(2);
      elements.velocityValue.textContent = displayVelocity;

      if (state.velocity > config.VELOCITY_THRESHOLD) {
          showSpeedWarning();
      } else {
          hideSpeedWarning();
      }
  }

  // 2. Rep Counting Logic (Dual Bicep Curls)
  // Calculate Elbow Angles (Shoulder-Elbow-Wrist)
  // Left: 11-13-15, Right: 12-14-16
  const leftElbowAngle = calculateAngle180(getLM(11), getLM(13), getLM(15));
  const rightElbowAngle = calculateAngle180(getLM(12), getLM(14), getLM(16));
  
  
  // --- NEW: Check Arm Angular Velocity (Anti-Spam) ---
  if (state.lastArmCheckTime > 0) {
      const dtArm = currentTime - state.lastArmCheckTime;
      if (dtArm > 0) {
          const dLeft = Math.abs(leftElbowAngle - state.lastLeftElbowAngle);
          const dRight = Math.abs(rightElbowAngle - state.lastRightElbowAngle);
          
          // Angular velocity in degrees/ms
          const leftV = dLeft / dtArm; 
          const rightV = dRight / dtArm;
          
          // If arms are moving too fast (explosive movement)
          if (leftV > config.ARM_VELOCITY_THRESHOLD || rightV > config.ARM_VELOCITY_THRESHOLD) {
             showSpeedWarning();
             state.speedWarningActive = true;
          }
      }
  }
  
  state.lastLeftElbowAngle = leftElbowAngle;
  state.lastRightElbowAngle = rightElbowAngle;
  state.lastArmCheckTime = currentTime;
  // ---------------------------------------------------


  // State Machine for Dual Curls
  // Phase 'neutral': Both arms extended (Angle > 150)
  // Phase 'up': Both arms flexed (Angle < 60)
  
  const bothArmsExtended = leftElbowAngle > config.CURL_EXTENDED_THRESHOLD && rightElbowAngle > config.CURL_EXTENDED_THRESHOLD;
  const bothArmsFlexed = leftElbowAngle < config.CURL_FLEXED_THRESHOLD && rightElbowAngle < config.CURL_FLEXED_THRESHOLD;

  // ShoulderCheck
  // config.SHOULDER_TOLERANCE is normalized Y (0-1). 
  // Shoulders going UP means Y value decreases (0 is top).
  // So if currentY < defaultY - tolerance, shoulders are too high.
  if (state.defaultShoulderY !== null) {
      // Calculate current avg shoulder Y
      const currentShoulderY = (getLM(11)[1] + getLM(12)[1]) / 2;
      
      if (currentShoulderY < state.defaultShoulderY - config.SHOULDER_TOLERANCE) {
           showShoulderWarning();
      } else {
           hideShoulderWarning();
      }
  }

  if (state.repPhase === 'neutral') {
      if (bothArmsFlexed) {
          state.repPhase = 'up';
          state.repStartTime = currentTime;
          // Visual feedback for peak contraction
          elements.repCount.style.color = "#ffff00"; 
      }
  } else if (state.repPhase === 'up') {
      if (bothArmsExtended) {
          const repDuration = currentTime - state.repStartTime;
          
          // Check for spamming (too fast)
          if (repDuration < config.MIN_REP_DURATION || state.speedWarningActive) {
              showSpeedWarning();
              // Optionally: Don't count the rep if it's too fast?
              // For now, let's count it but warn.
          } else {
              hideSpeedWarning();
          }

          state.reps++;
          elements.repCount.textContent = state.reps;
          state.repPhase = 'neutral';
          state.lastRepEndTime = currentTime;
          triggerRepFeedback();
      }
  }

  // Hide speed warning after some time if no new fast reps occur
  if (state.speedWarningActive && (currentTime - state.lastRepEndTime > 2000) && state.repPhase === 'neutral') {
      hideSpeedWarning();
  }

  state.lastHipY = currentY;
  state.lastFrameTime = currentTime;
}

function showShoulderWarning() {
    if (!state.shoulderWarningActive) {
        state.shoulderWarningActive = true;
        elements.shoulderWarningOverlay.classList.add("active");
    }
}

function hideShoulderWarning() {
    if (state.shoulderWarningActive) {
        state.shoulderWarningActive = false;
        elements.shoulderWarningOverlay.classList.remove("active");
    }
}

function showSpeedWarning() {
    if (!state.speedWarningActive) {
        state.speedWarningActive = true;
        elements.speedWarningOverlay.classList.add("active");
    }
}

function hideSpeedWarning() {
    if (state.speedWarningActive) {
        state.speedWarningActive = false;
        elements.speedWarningOverlay.classList.remove("active");
    }
}

function triggerRepFeedback() {
    elements.repCount.style.transform = "scale(1.5)";
    elements.repCount.style.color = "#00ff41";
    setTimeout(() => {
        elements.repCount.style.transform = "scale(1)";
        elements.repCount.style.color = ""; // Revert to CSS default
    }, 200);
}

// ========================================
// Drawing Functions
// ========================================

const CONNECTIONS = [
  [11, 12],
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16], // Shoulders/Arms
  [11, 23],
  [12, 24],
  [23, 24], // Torso
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28], // Legs
];

function drawSkeleton(landmarks, w, h) {
  ctx.globalAlpha = 1.0;

  // Draw connections
  CONNECTIONS.forEach(([start, end]) => {
    const p1 = [landmarks[start].x * w, landmarks[start].y * h];
    const p2 = [landmarks[end].x * w, landmarks[end].y * h];
    drawLine(p1, p2, "#ffffff", 3);
  });

  // Draw joints
  landmarks.forEach((lm) => {
    const x = lm.x * w;
    const y = lm.y * h;
    drawCircle([x, y], 5, "#00ff41", "#00ff41");
  });
}

function drawLine(p1, p2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.stroke();
}

function drawCircle(center, radius, fillColor, strokeColor) {
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

// ========================================
// UI Update Functions
// ========================================

function updateStatus(text, type) {
  elements.statusText.textContent = text;
  const dot = elements.statusIndicator.querySelector(".pulse-dot");

  const colors = {
    success: "#00ff41",
    error: "#ff3131",
    loading: "#00d4ff",
  };

  if (dot) {
    dot.style.background = colors[type] || colors.loading;
    dot.style.boxShadow = `0 0 10px ${colors[type] || colors.loading}`;
  }
}

function updateAlignment(percentage) {
  const value = Math.min(100, Math.max(0, percentage));

  elements.alignmentValue.textContent = value.toFixed(1);
  elements.ringPercent.textContent = Math.round(value);

  // Update ring progress (circumference = 2 * PI * r = 2 * PI * 54 ≈ 339.292)
  const circumference = 339.292;
  const offset = circumference - (value / 100) * circumference;
  elements.progressCircle.style.strokeDashoffset = offset;

  // Change color based on value
  const color = value > 98 ? "#00ff41" : "#ff8c00";
  elements.progressCircle.style.stroke = color;
  elements.progressCircle.style.filter = `drop-shadow(0 0 8px ${color})`;
}

function updateAngles(angles, backAngle) {
  elements.leftElbow.textContent = `${Math.round(angles.leftElbow)}°`;
  elements.rightElbow.textContent = `${Math.round(angles.rightElbow)}°`;
  elements.leftArmpit.textContent = `${Math.round(angles.leftArmpit)}°`;
  elements.rightArmpit.textContent = `${Math.round(angles.rightArmpit)}°`;
  elements.backAngle.textContent = `${Math.round(backAngle)}°`;
}

function showWarning(tiltAngle) {
  elements.warningOverlay.classList.add("active");
  elements.warningText.textContent = `TILT: ${Math.abs(tiltAngle).toFixed(1)}°`;
  elements.warningArrow.textContent = tiltAngle > 0 ? "←" : "→";
}

function hideWarning() {
  elements.warningOverlay.classList.remove("active");
}

function showCalibration() {
  elements.calibrationOverlay.classList.add("active");
}

function hideCalibration() {
  elements.calibrationOverlay.classList.remove("active");
}

function showMessage(text, type = "info") {
  const messageClass =
    type === "warning" ? "warning" : type === "success" ? "success" : "info";

  elements.statusMessages.innerHTML = `
        <div class="status-message ${messageClass}">
            <div class="message-icon">●</div>
            <div class="message-text">${text}</div>
        </div>
    `;
}

// ========================================
// Event Handlers
// ========================================

elements.startBtn.addEventListener("click", async () => {
  if (!state.isRunning) {
    elements.startBtn.innerHTML =
      '<span class="btn-icon">⏸</span> Pause Analysis';
    await startCamera();
  } else {
    state.isRunning = false;
    if (state.animationFrameId) {
      cancelAnimationFrame(state.animationFrameId);
    }
    elements.startBtn.innerHTML =
      '<span class="btn-icon">▶</span> Resume Analysis';
    updateStatus("Paused", "loading");
  }
});

elements.resetBtn.addEventListener("click", () => {
  state.calibrationFrames = 0;
  state.defaultShoulderY = null;
  elements.calibrationValue.textContent = "0%";
  elements.calibrationProgress.style.width = "0%";
  showMessage("Calibration reset. Hold position to recalibrate.", "info");

  // Reset Performance Stats
  state.reps = 0;
  state.standingHipY = null;
  state.repPhase = 'neutral';
  elements.repCount.textContent = "0";
});

elements.cameraToggleBtn.addEventListener("click", async () => {
    // Toggle mode
    state.cameraFacingMode = state.cameraFacingMode === 'user' ? 'environment' : 'user';
    
    // Stop current stream
    if (elements.video.srcObject) {
        elements.video.srcObject.getTracks().forEach(track => track.stop());
    }

    // Restart with new mode if already running, or just switch state
    if (state.isRunning) {
        await startCamera();
    } else {
        // If not running, just update status
        showMessage(`Switched to ${state.cameraFacingMode === 'user' ? 'Front' : 'Back'} Camera`, "info");
    }
});

// ========================================
// Initialization
// ========================================

window.addEventListener("load", async () => {
    initializePoseDetection();
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (state.isRunning && elements.video.srcObject) {
    elements.video.srcObject.getTracks().forEach((track) => track.stop());
  }
});

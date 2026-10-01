# SIH26038 System Architecture Document

## Executive Summary
This document provides the high-level system architecture for **SIH26038: Automated, Explainable and Clinically Validated Diabetic Retinopathy Screening System**.

## System Flowchart

```text
                    FUNDUS IMAGE
                         |
                         v
              +----------------------+
              | IMAGE QUALITY MODULE  |
              +----------------------+
                         |
             +-----------+-----------+
             |                       |
          UNGRADABLE               GRADABLE
             |                       |
             v                       v
        RECAPTURE             IMAGE ENHANCEMENT
          FEEDBACK                    |
                                     v
                         +----------------------+
                         | RETINAL ANALYSIS     |
                         +----------------------+
                                     |
                 +-------------------+-------------------+
                 |                   |                   |
                 v                   v                   v
           STRUCTURES            LESIONS            FEATURES
           - Optic Disc          - MA                 - Vessels
           - Fovea               - Exudates
                                 - Hemorrhages
                                 - NV
                 |                   |
                 +-------------------+
                         |
                         v
               +---------------------+
               | DR CLASSIFICATION   |
               | LEVEL 0 - LEVEL 4   |
               +---------------------+
                         |
                         v
               +---------------------+
               | REFERABLE DR        |
               | YES / NO            |
               +---------------------+
                         |
                         v
               +---------------------+
               | EXPLAINABILITY      |
               | Grad-CAM + Evidence |
               +---------------------+
                         |
                         v
               +---------------------+
               | CONFIDENCE          |
               | CALIBRATION         |
               +---------------------+
                         |
                         v
               +---------------------+
               | SCREENING REPORT    |
               +---------------------+
                         |
                         v
               +---------------------+
               | HUMAN REVIEW        |
               +---------------------+

                    PARALLEL
                       |
                       v
               +---------------------+
               | SIMULINK / SYSTEM   |
               | TELEMEDICINE MODEL  |
               +---------------------+
```

## Module Descriptions

1. **Fundus Image Input**: Accepts PNG, JPG, TIFF fundus photographs with non-retinal image safeguards.
2. **Quality Assessment**: Evaluates focus sharpness (Laplacian variance), illumination, contrast, and field of view. Rejects severely ungradable images.
3. **Enhancement**: Applies CLAHE in LAB color space, illumination normalization, and bilateral filtering.
4. **Retinal Analysis**: Detects Optic Disc, estimates Fovea, and segments Blood Vessels.
5. **Lesion Detection**: Identifies Microaneurysms, Hard Exudates, Hemorrhages, and Neovascularization.
6. **DR Classification**: 5-class grading (Level 0–4) using Deep Transfer Learning.
7. **Referable DR**: Binary decision (Level 0–1 = Non-Referable, Level 2–4 = Referable).
8. **Explainability**: Grad-CAM heatmap visualization with adjustable opacity.
9. **Confidence Calibration**: Temperature scaling and quality-weighted calibrated confidence.
10. **Automated Screening Report**: Standardized clinical markdown and text export.
11. **Human Review**: Clinician sign-off workflow (<30s target).
12. **Simulink Rural Telemedicine Simulation**: Queueing model for 100,000+ patients/year scale.

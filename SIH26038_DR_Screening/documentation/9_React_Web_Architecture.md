# SIH26038 — React / TypeScript Web Application Architecture

## Overview
This document outlines the React + TypeScript frontend component architecture for **SIH26038: Explainable AI-Based Diabetic Retinopathy Screening System**.

## Component Hierarchy & API Abstraction

```text
React TypeScript Frontend Application
│
├── App.tsx                        # Main Layout & Tab Routing
├── services/
│   └── api.ts                     # REST API Abstraction Layer (POST /api/analyze, POST /api/telemedicine_sim)
├── types/
│   └── screening.ts               # TypeScript Interface Specs (ScreeningCase, QualityMetrics, DRClassification)
└── components/
    ├── Header.tsx                 # System status & Judge Demo Mode trigger
    ├── Sidebar.tsx                # Persistent navigation (Dashboard, Screening, Patients, Telemedicine)
    ├── JudgeDemoModal.tsx         # 10-step guided demo sequence for Hackathon Judges
    ├── ScreeningPage.tsx          # Main Diagnostic Screening, Grad-CAM viewer & Opacity slider
    ├── TelemedicinePage.tsx       # Rural Telemedicine Simulation Sandbox (100k+ patients/yr)
    ├── ClinicianReviewPage.tsx    # Human-in-the-Loop Clinician Sign-Off Modal
    └── ModelPerformancePage.tsx   # Sensitivity >90%, Specificity >85% targets & literature benchmarks
```

## How to Connect Custom AI Backends
The service layer (`services/api.ts`) is designed so that any ML model backend (PyTorch, TensorFlow, MATLAB production server, ONNX runtime) can be hooked up simply by pointing `API_BASE_URL` to your backend server endpoint.

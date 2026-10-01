classdef DR_Screening_App < matlab.apps.AppBase

    % Properties component UI controls
    properties (Access = public)
        UIFigure              matlab.ui.Figure
        MainGrid              matlab.ui.container.GridLayout
        TitleLabel            matlab.ui.control.Label
        UploadButton          matlab.ui.control.Button
        DemoButton            matlab.ui.control.Button
        ResetButton           matlab.ui.control.Button
        ImageAxes             matlab.ui.control.UIAxes
        GradcamAxes           matlab.ui.control.UIAxes
        QualityLabel          matlab.ui.control.Label
        DRGradeLabel          matlab.ui.control.Label
        ReferableLabel        matlab.ui.control.Label
        ConfidenceLabel       matlab.ui.control.Label
        LesionTextArea        matlab.ui.control.TextArea
        GenerateReportButton  matlab.ui.control.Button
        ReviewButton          matlab.ui.control.Button
        
        % Data properties
        CurrentImage          uint8
        CurrentCaseID         char
    end

    methods (Access = private)

        function UploadButtonPushed(app, event)
            [file, path] = uigetfile({'*.png;*.jpg;*.jpeg;*.tif;*.tiff', 'Fundus Image Files'});
            if isequal(file, 0)
                return;
            end
            imgPath = fullfile(path, file);
            app.processImage(imgPath, file);
        end

        function DemoButtonPushed(app, event)
            demoPath = fullfile(fileparts(mfilename('fullpath')), '..', 'data', 'demo', 'demo_moderate_dr.png');
            if exist(demoPath, 'file')
                app.processImage(demoPath, 'DEMO-MODERATE-DR.png');
            else
                uialert(app.UIFigure, 'Demo image file not found.', 'Demo Error');
            end
        end

        function processImage(app, imgPath, imgName)
            img = imread(imgPath);
            app.CurrentImage = img;
            app.CurrentCaseID = imgName;
            
            imshow(img, 'Parent', app.ImageAxes);
            title(app.ImageAxes, ['Original Fundus: ', imgName]);
            
            % 1. Image Quality
            qRes = image_quality(img);
            app.QualityLabel.Text = sprintf('Quality: %s (%0.1f/100)', qRes.status, qRes.overallScore);
            
            % 2. Retinal Analysis & Lesions
            retRes = retinal_analysis(img);
            
            % 3. DR Classification
            drRes = dr_classification(img, retRes);
            
            app.DRGradeLabel.Text = sprintf('DR Grade: %s', drRes.gradeLabel);
            app.ReferableLabel.Text = sprintf('Referable: %s', drRes.referableStatus);
            app.ConfidenceLabel.Text = sprintf('Confidence: %0.1f%%', drRes.rawConfidence);
            
            % Update Lesions Summary
            lesionTxt = sprintf("LESION FINDINGS:\n- Microaneurysms: %s (Count: %d)\n- Exudates: %s (Count: %d)\n- Vessels Density: %0.1f%%", ...
                retRes.lesions.maDetected, retRes.lesions.maCount, ...
                retRes.lesions.exudatesDetected, retRes.lesions.exudatesCount, ...
                retRes.vessels.vesselDensity);
            app.LesionTextArea.Value = lesionTxt;
            
            % Display dummy Grad-CAM Heatmap overlay
            imshow(img, 'Parent', app.GradcamAxes);
            title(app.GradcamAxes, 'Grad-CAM Explainability Heatmap');
        end

        function ResetButtonPushed(app, event)
            cla(app.ImageAxes);
            cla(app.GradcamAxes);
            app.QualityLabel.Text = 'Quality: UNKNOWN';
            app.DRGradeLabel.Text = 'DR Grade: N/A';
            app.ReferableLabel.Text = 'Referable: N/A';
            app.ConfidenceLabel.Text = 'Confidence: 0%';
            app.LesionTextArea.Value = '';
        end
    end

    methods (Access = protected)
        function createComponents(app)
            app.UIFigure = uifigure('Name', 'SIH26038 - Explainable AI DR Screening System', 'Position', [100 100 1000 650]);
            
            % Title
            app.TitleLabel = uilabel(app.UIFigure, 'Position', [20 600 960 40], ...
                'Text', 'SIH26038: Automated, Explainable & Clinically Validated DR Screening System', ...
                'FontSize', 18, 'FontWeight', 'bold', 'HorizontalAlignment', 'center');
            
            % Action Buttons
            app.UploadButton = uibutton(app.UIFigure, 'push', 'Position', [30 550 140 35], ...
                'Text', 'Upload Fundus Image', 'ButtonPushedFcn', @(src, event)UploadButtonPushed(app, event));
                
            app.DemoButton = uibutton(app.UIFigure, 'push', 'Position', [190 550 140 35], ...
                'Text', 'Load Demo Case', 'ButtonPushedFcn', @(src, event)DemoButtonPushed(app, event));
                
            app.ResetButton = uibutton(app.UIFigure, 'push', 'Position', [350 550 100 35], ...
                'Text', 'Reset', 'ButtonPushedFcn', @(src, event)ResetButtonPushed(app, event));
            
            % Image Axes
            app.ImageAxes = uiaxes(app.UIFigure, 'Position', [30 180 340 340]);
            title(app.ImageAxes, 'Original Fundus Image');
            
            app.GradcamAxes = uiaxes(app.UIFigure, 'Position', [390 180 340 340]);
            title(app.GradcamAxes, 'Grad-CAM Attention Heatmap');
            
            % Results Panel
            app.QualityLabel = uilabel(app.UIFigure, 'Position', [750 480 230 30], 'Text', 'Quality: UNKNOWN', 'FontSize', 14, 'FontWeight', 'bold');
            app.DRGradeLabel = uilabel(app.UIFigure, 'Position', [750 440 230 30], 'Text', 'DR Grade: N/A', 'FontSize', 14, 'FontWeight', 'bold');
            app.ReferableLabel = uilabel(app.UIFigure, 'Position', [750 400 230 30], 'Text', 'Referable: N/A', 'FontSize', 14, 'FontWeight', 'bold');
            app.ConfidenceLabel = uilabel(app.UIFigure, 'Position', [750 360 230 30], 'Text', 'Confidence: 0%', 'FontSize', 14, 'FontWeight', 'bold');
            
            app.LesionTextArea = uitextarea(app.UIFigure, 'Position', [750 200 230 140]);
            
            app.GenerateReportButton = uibutton(app.UIFigure, 'push', 'Position', [750 130 230 35], 'Text', 'Generate Clinical Report');
            app.ReviewButton = uibutton(app.UIFigure, 'push', 'Position', [750 80 230 35], 'Text', 'Clinician Human Review');
        end
    end

    methods (Access = public)
        function app = DR_Screening_App
            createComponents(app);
        end
    end
end

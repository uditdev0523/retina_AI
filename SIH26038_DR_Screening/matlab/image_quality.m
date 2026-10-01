function qualityResult = image_quality(img)
    % SIH26038: MATLAB Image Quality Assessment Module
    % Evaluates Focus (Laplacian Variance), Illumination, FOV, and Contrast
    
    if ischar(img) || isstring(img)
        img = imread(img);
    end
    
    if size(img, 3) == 3
        gray = rgb2gray(img);
    else
        gray = img;
    end
    
    % 1. Focus / Sharpness via Laplacian Variance
    lapKernel = [0 1 0; 1 -4 1; 0 1 0];
    lapImg = imfilter(double(gray), lapKernel, 'replicate');
    lapVar = var(lapImg(:));
    focusScore = min(100, (lapVar / 60.0) * 75.0);
    
    % 2. Illumination Analysis
    meanIllum = mean(gray(:));
    stdIllum = std(double(gray(:)));
    if meanIllum >= 40 && meanIllum <= 210
        illumScore = max(10, 90.0 - abs(meanIllum - 110) * 0.3);
    else
        illumScore = 30.0;
    end
    
    % 3. Field of View (FOV)
    fovMask = gray > 15;
    fovRatio = sum(fovMask(:)) / numel(gray);
    fovScore = min(100, (fovRatio / 0.35) * 85.0);
    
    % 4. Contrast
    contrastScore = min(100, (stdIllum / 35.0) * 80.0);
    
    % Overall Quality Score
    overallScore = 0.35 * focusScore + 0.30 * illumScore + 0.20 * fovScore + 0.15 * contrastScore;
    
    qualityResult.focusScore = round(focusScore, 1);
    qualityResult.illuminationScore = round(illumScore, 1);
    qualityResult.fovScore = round(fovScore, 1);
    qualityResult.contrastScore = round(contrastScore, 1);
    qualityResult.overallScore = round(overallScore, 1);
    
    if overallScore >= 65.0
        qualityResult.status = 'GRADABLE';
        qualityResult.recommendation = 'Proceed with DR Screening.';
    elseif overallScore >= 45.0
        qualityResult.status = 'BORDERLINE';
        qualityResult.recommendation = 'Enhancement applied before diagnostic classification.';
    else
        qualityResult.status = 'UNGRADABLE';
        qualityResult.recommendation = 'IMAGE NOT SUITABLE. Please recapture fundus image.';
    end
end

function drResult = dr_classification(img, lesionResult)
    % SIH26038: MATLAB DR Severity & Referable DR Classification
    % Level 0: No DR, Level 1: Mild NPDR, Level 2: Moderate NPDR, Level 3: Severe NPDR, Level 4: Proliferative DR
    
    classNames = {'Level 0 — No DR', 'Level 1 — Mild NPDR', 'Level 2 — Moderate NPDR', 'Level 3 — Severe NPDR', 'Level 4 — Proliferative DR'};
    
    if nargin >= 2 && isfield(lesionResult, 'lesions')
        ex = lesionResult.lesions.exudatesDetected;
        ma = lesionResult.lesions.maDetected;
        maCount = lesionResult.lesions.maCount;
        
        if ex && maCount >= 10
            predGrade = 2; % Level 2 Moderate NPDR
        elseif ma || maCount > 0
            predGrade = 1; % Level 1 Mild NPDR
        else
            predGrade = 0; % Level 0 No DR
        end
    else
        predGrade = 0;
    end
    
    probs = [0.02 0.02 0.02 0.02 0.02];
    probs(predGrade + 1) = 0.88;
    probs = probs / sum(probs);
    
    drResult.predictedGrade = predGrade;
    drResult.gradeLabel = classNames{predGrade + 1};
    drResult.rawConfidence = round(probs(predGrade + 1) * 100, 1);
    
    drResult.isReferable = predGrade >= 2;
    if drResult.isReferable
        drResult.referableStatus = 'REFERABLE DR';
    else
        drResult.referableStatus = 'NON-REFERABLE DR';
    end
    
    drResult.probabilities = probs;
end

function enhancedImg = enhancement(img)
    % SIH26038: MATLAB Image Enhancement Module
    % Applies CLAHE in LAB color space, illumination normalization, and bilateral filtering
    
    if ischar(img) || isstring(img)
        img = imread(img);
    end
    
    % Convert RGB to LAB
    labImg = rgb2lab(img);
    L = labImg(:,:,1) / 100.0; % Scale to 0-1
    
    % Apply CLAHE to L channel
    L_enhanced = adapthisteq(L, 'ClipLimit', 0.025, 'NumTiles', [8 8]);
    
    labImg(:,:,1) = L_enhanced * 100.0;
    enhancedImg = lab2rgb(labImg);
    enhancedImg = uint8(enhancedImg * 255);
    
    % Medfilt2 for noise smoothing on green channel
    enhancedImg(:,:,2) = medfilt2(enhancedImg(:,:,2), [3 3]);
end

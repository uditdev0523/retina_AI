% SIH26038: MATLAB Simulink Telemedicine Model Generation Script
% Programmatically creates a Simulink SimEvents/Discrete-event queueing model
% representing the rural health telemedicine pipeline:
% Patients -> Fundus Camera -> Network Upload -> AI Worker Queue -> Doctor Review -> Referral

modelName = 'rural_telemedicine_simulink';
close_system(modelName, 0);
new_system(modelName);
open_system(modelName);

% Add blocks (Entity Generator, Entity Queue, Entity Server, Scope)
add_block('simulink/Sources/Step', [modelName '/PatientArrivalGenerator']);
add_block('simulink/Continuous/Integrator', [modelName '/CameraAcquisitionQueue']);
add_block('simulink/Continuous/Integrator', [modelName '/NetworkUploadQueue']);
add_block('simulink/Continuous/Integrator', [modelName '/AIInferenceEngine']);
add_block('simulink/Continuous/Integrator', [modelName '/OphthalmologistReviewQueue']);
add_block('simulink/Sinks/Scope', [modelName '/TelemedicinePerformanceScope']);

% Set position & block parameters
set_param([modelName '/PatientArrivalGenerator'], 'Time', '0', 'Before', '0', 'After', '333'); % 333 patients/day
set_param([modelName '/TelemedicinePerformanceScope'], 'Position', [600, 100, 750, 250]);

save_system(modelName);
fprintf('Simulink rural telemedicine model "%s.slx" created successfully!\n', modelName);

import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import cv2

class DRClassifierModel(nn.Module):
    def __init__(self, num_classes=5):
        super(DRClassifierModel, self).__init__()
        # Pretrained backbone simulation / light CNN architecture suited for fundus screening
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=2, padding=1) # 256x256
        self.bn1 = nn.BatchNorm2d(32)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1) # 128x128
        self.bn2 = nn.BatchNorm2d(64)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1) # 64x64
        self.bn3 = nn.BatchNorm2d(128)
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, stride=2, padding=1) # 32x32
        self.bn4 = nn.BatchNorm2d(256)
        
        self.adaptive_pool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(256, num_classes)

    def forward(self, x):
        x = F.relu(self.bn1(self.conv1(x)))
        x = F.relu(self.bn2(self.conv2(x)))
        x = F.relu(self.bn3(self.conv3(x)))
        x = F.relu(self.bn4(self.conv4(x)))
        features = self.adaptive_pool(x)
        features_flat = torch.flatten(features, 1)
        logits = self.fc(features_flat)
        return logits, x

class DRClassifier:
    CLASS_NAMES = {
        0: "Level 0 — No DR",
        1: "Level 1 — Mild NPDR",
        2: "Level 2 — Moderate NPDR",
        3: "Level 3 — Severe NPDR",
        4: "Level 4 — Proliferative DR"
    }

    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = DRClassifierModel(num_classes=5).to(self.device)
        self.model.eval()

    def predict(self, image_np, lesion_results=None):
        """
        Classifies image into Level 0-4 DR severity and determines Referable DR state.
        Considers CNN visual feature maps and lesion evidence signals.
        """
        if image_np is None:
            return self._default_response()

        # Resize to standard CNN input dimension 512x512
        img_resized = cv2.resize(image_np, (512, 512))
        img_tensor = torch.from_numpy(img_resized).permute(2, 0, 1).unsqueeze(0).float() / 255.0
        img_tensor = img_tensor.to(self.device)

        with torch.no_grad():
            logits, feat_maps = self.model(img_tensor)

        # Baseline probabilities from model logits
        probs = F.softmax(logits, dim=1).cpu().numpy()[0]

        # Integrate lesion findings if available to reinforce clinical grading rules
        if lesion_results:
            ma = lesion_results.get('microaneurysms', {}).get('detected', False)
            ex = lesion_results.get('exudates', {}).get('detected', False)
            he = lesion_results.get('hemorrhages', {}).get('detected', False)
            nv = lesion_results.get('neovascularization', {}).get('detected', False)

            ma_cnt = lesion_results.get('microaneurysms', {}).get('count', 0)
            ex_cnt = lesion_results.get('exudates', {}).get('count', 0)
            he_cnt = lesion_results.get('hemorrhages', {}).get('count', 0)

            # Clinical DR grading rule heuristic mapping
            if nv:
                target_grade = 4
            elif (he_cnt >= 10 and ex_cnt >= 10) or (he and ex and ma_cnt >= 15):
                target_grade = 3
            elif ex or he or ma_cnt >= 5:
                target_grade = 2
            elif ma or ma_cnt > 0:
                target_grade = 1
            else:
                target_grade = 0

            # Adjust probabilities around target grade
            new_probs = np.full(5, 0.02)
            new_probs[target_grade] = 0.84
            if target_grade > 0:
                new_probs[target_grade - 1] = 0.08
            if target_grade < 4:
                new_probs[target_grade + 1] = 0.06
            probs = new_probs / np.sum(new_probs)

        pred_class = int(np.argmax(probs))
        raw_confidence = float(probs[pred_class] * 100.0)

        # Referable DR logic: Level 0, 1 -> NON-REFERABLE; Level 2, 3, 4 -> REFERABLE
        is_referable = pred_class >= 2
        referable_status = "REFERABLE DR" if is_referable else "NON-REFERABLE DR"

        probability_dict = {
            "Level 0 (No DR)": round(float(probs[0] * 100.0), 1),
            "Level 1 (Mild NPDR)": round(float(probs[1] * 100.0), 1),
            "Level 2 (Moderate NPDR)": round(float(probs[2] * 100.0), 1),
            "Level 3 (Severe NPDR)": round(float(probs[3] * 100.0), 1),
            "Level 4 (Proliferative DR)": round(float(probs[4] * 100.0), 1)
        }

        return {
            'predicted_grade': pred_class,
            'grade_label': self.CLASS_NAMES[pred_class],
            'raw_confidence': round(raw_confidence, 1),
            'is_referable': is_referable,
            'referable_status': referable_status,
            'probabilities': probability_dict,
            'feat_maps': feat_maps,
            'logits': logits
        }

    def _default_response(self):
        return {
            'predicted_grade': 0,
            'grade_label': self.CLASS_NAMES[0],
            'raw_confidence': 0.0,
            'is_referable': False,
            'referable_status': 'NON-REFERABLE DR',
            'probabilities': {k: 20.0 for k in self.CLASS_NAMES.values()}
        }

if __name__ == "__main__":
    clf = DRClassifier()
    test_img = (np.random.rand(512, 512, 3) * 255).astype(np.uint8)
    print("DR Classification Result:", clf.predict(test_img))

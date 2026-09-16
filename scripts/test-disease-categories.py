"""Regression cases for shared categories, including misleading single letters."""
import unittest
from disease_categories import item_category, symptom_parts

class SemanticCategories(unittest.TestCase):
    def test_separate_findings_keep_their_own_categories(self):
        parts=symptom_parts('意識変化・出血・呼吸苦')
        self.assertEqual(parts,['意識変化','出血','呼吸苦'])
        self.assertEqual([item_category(p,'symptom') for p in parts],['neurologic','hematology','breathing'])

    def test_parenthetical_explanation_stays_with_its_finding(self):
        self.assertEqual(symptom_parts('しびれ（手・足）・冷感'),['しびれ（手・足）','冷感'])
        self.assertEqual(item_category('しびれ（手・足）','symptom'),'neurologic')
        self.assertEqual(item_category('黒色便','symptom'),'hematology')
        self.assertEqual(item_category('血尿','symptom'),'urinary')

    def test_rifaximin_is_an_antibacterial_across_names(self):
        for name in ['リファキシミン','リフキシマ錠200mg','難吸収性抗菌薬：リファキシミン']:
            self.assertEqual(item_category(name,'drug'),'anti-infective')

    def test_lab_aliases_and_non_specific_enzymes(self):
        groups={
            'enzyme-lab':['CK','CPK','クレアチンキナーゼ','ALP','LDH'],
            'cardiac-lab':['CK-MB','CKMB','MB型クレアチンキナーゼ'],
            'pancreatic-lab':['Lipase','リパーゼ','AMY','血清アミラーゼ'],
            'nutrient-lab':['25(OH)D','25（OH）D','ビタミンD'],
            'osmolality-lab':['Posm','血漿浸透圧','尿浸透圧'],
            'lipid-lab':['LDL-C','LDLコレステロール'],
            'endocrine-lab':['FT4','コルチゾール'],
            'glucose-lab':['HbA1c','ヘモグロビンA1c','GLU','血漿グルコース（血糖）'],
        }
        for category,names in groups.items():
            for name in names:
                with self.subTest(name=name): self.assertEqual(item_category(name,'lab'),category)
        for name in ['MRCP','SPECT']:
            self.assertEqual(item_category(name,'lab'),'general-lab')

    def test_drug_mechanisms_cross_organ_boundaries(self):
        families={
            'pde5-drug':['前立腺肥大症：PDE5阻害薬','PAH：PDE5阻害薬','タダラフィル'],
            'sgc-drug':['sGC刺激薬','リオシグアト'],
            'endothelin-drug':['エンドセリン受容体拮抗薬','マシテンタン'],
            'prostacyclin-drug':['プロスタサイクリン経路：持続静注','エポプロステノール'],
            'activin-drug':['アクチビンシグナル伝達阻害薬','ソタテルセプト'],
        }
        for category,names in families.items():
            for name in names:
                with self.subTest(name=name): self.assertEqual(item_category(name,'drug'),category)
        self.assertEqual(item_category('拮抗薬','drug'),'general-drug')

    def test_reversal_is_separate_from_anticoagulation(self):
        for name in ['抗凝固薬の拮抗薬', '抗凝固作用の中和・止血管理', 'プロトロンビン複合体製剤']:
            self.assertEqual(item_category(name, 'drug'), 'hemostatic-drug')
        self.assertEqual(item_category('抗凝固薬：ワルファリン', 'drug'), 'antithrombotic')

    def test_equivalent_lab_names(self):
        groups={
            'coagulation':['APTT','PT-INR','D-D','Dダイマー','D-ダイマー','FDP'],
            'blood-gas':['PaCO₂','PaCO2','HCO₃⁻','HCO3-','pH'],
            'renal-lab':['Cr','クレアチニン','尿アルブミン'],
            'hematology':['PLAT','血小板','Hgb'],
            'cardiac-lab':['TnT','トロポニン'],
            'electrolyte':['K','Na','カリウム','IP','無機リン','無機リン / IP'],
        }
        for category,names in groups.items():
            for name in names:
                with self.subTest(name=name): self.assertEqual(item_category(name,'lab'),category)
    def test_examination_names_are_not_phosphorus(self):
        for name in ['PEF','PEF・呼吸機能','FeNO']:
            with self.subTest(name=name): self.assertEqual(item_category(name,'lab'),'general-lab')
        self.assertEqual(item_category('画像・CT','lab'),'imaging-lab')

    def test_examination_families_and_separate_headings(self):
        groups={
            'blood-gas':['血液ガス','pH','PaCO2'],
            'lipid-lab':['脂質','TC','LDL-C'],
            'hematology':['Eos','好酸球','Ht','ヘマトクリット'],
            'microbiology-lab':['尿培養','血液培養','抗原検査'],
            'imaging-lab':['胸部X線','CT','下垂体MRI','超音波'],
            'cardiac-lab':['心電図','心エコー'],
            'renal-lab':['腎機能','eGFR'],
        }
        for category,names in groups.items():
            for name in names:
                with self.subTest(name=name): self.assertEqual(item_category(name,'lab'),category)
        parts=symptom_parts('凝固・電解質・培養')
        self.assertEqual([item_category(p,'lab') for p in parts],['coagulation','electrolyte','microbiology-lab'])
    def test_alertness_and_bronchodilators(self):
        self.assertEqual(item_category('傾眠','symptom'),'neurologic')
        self.assertEqual(item_category('不穏','symptom'),'neurologic')
        self.assertEqual(item_category('SABA','drug'),'respiratory-drug')

    def test_authored_labels_share_their_abbreviation_category(self):
        groups = [
            ('drug', 'respiratory-drug', ['短時間作用型β₂刺激薬：症状時', 'β2受容体刺激薬', 'SABA']),
            ('drug', 'cardiovascular-drug', ['血管収縮薬', 'ノルアドレナリン']),
            ('drug', 'neurologic-drug', ['抗発作薬による発作治療', '抗てんかん薬']),
            ('lab', 'inflammation', ['白血球', '白血球数', 'WBC']),
            ('lab', 'liver-lab', ['NH3', 'NH₃', 'アンモニア']),
            ('lab', 'endocrine-lab', ['LH・FSH・性ホルモン・IGF-1', 'IGF1', 'FSH']),
        ]
        for kind, category, names in groups:
            for name in names:
                with self.subTest(name=name):
                    self.assertEqual(item_category(name, kind), category)
        self.assertEqual(item_category('尿中白血球', 'lab'), 'renal-lab')

    def test_alpha_one_blocker_typography(self):
        # Normalization turns the source note's subscript into an ASCII digit.
        # Both the catalog and authored BPH detail must retain the drug family.
        for name in ['α₁遮断薬', 'α1遮断薬', 'α１遮断薬', 'α1受容体遮断薬']:
            with self.subTest(name=name):
                self.assertEqual(item_category(name,'drug'),'urologic-drug')

    def test_beta_blocker_typography(self):
        for name in ['β遮断薬', 'β1遮断薬', 'β₁遮断薬', 'β１遮断薬', 'β1受容体遮断薬', 'β受容体遮断薬']:
            with self.subTest(name=name):
                self.assertEqual(item_category(name, 'drug'), 'cardiovascular-drug')
        self.assertEqual(item_category('SABA', 'drug'), 'respiratory-drug')

class BedsideSynonyms(unittest.TestCase):
    def test_detail_treatment_families_and_full_lab_names(self):
        groups = [
            ('lab', 'renal-lab', ['BUN', 'UN', '尿素窒素', '血中尿素窒素']),
            ('drug', 'neurologic-drug', ['ドネペジル', 'コリンエステラーゼ阻害薬', '抗アミロイドβ抗体による治療', 'レカネマブ', 'ドナネマブ']),
            ('drug', 'metabolic-drug', ['デスモプレシン：バソプレシン欠乏合併時', '抗FGF23抗体：適応のある低リン血症性疾患', 'ブロスマブ', 'ブドウ糖による低血糖補正']),
            ('drug', 'fluid-drug', ['アルブミン製剤']),
            ('symptom', 'urinary', ['失禁', '尿失禁']),
            ('symptom', 'skin', ['傷', '創傷']),
        ]
        for kind, category, labels in groups:
            for label in labels:
                with self.subTest(label=label):
                    self.assertEqual(item_category(label, kind), category)
        self.assertEqual(item_category('便失禁', 'symptom'), 'digestive')
        self.assertEqual(item_category('シャント手術', 'drug'), 'general-drug')

    def test_iron_status_aliases(self):
        for label in ['フェリチン', 'FER', 'TSAT', '血清鉄', 'Fe', '総鉄結合能', 'TIBC', 'UIBC']:
            with self.subTest(label=label):
                self.assertEqual(item_category(label, 'lab'), 'hematology')
        for label in ['鉄補充：静注鉄剤', '含糖酸化鉄']:
            self.assertEqual(item_category(label, 'drug'), 'metabolic-drug')
        self.assertEqual(item_category('FEV1', 'lab'), 'general-lab')

    def test_common_findings_across_diseases(self):
        groups={
            'circulation':['徐脈','治療後の徐脈','頻脈','脈拍の変化','冷汗'],
            'neurologic':['眠気','反応低下','反応の低下','言葉の変化','ふらつき','複視'],
            'breathing':['湿性ラ音','換気不良','酸素化低下'],
            'hematology':['喀血','貧血の徴候','血小板低下'],
            'skin':['腫脹','片脚の腫脹','腫れ'],
        }
        for category,labels in groups.items():
            for label in labels:
                with self.subTest(label=label):
                    self.assertEqual(item_category(label,'symptom'),category)

if __name__=='__main__': unittest.main()

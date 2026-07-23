import argparse
import csv
from pathlib import Path


SOURCE_LABEL = "国立がん研究センター中央病院 臨床検査科『臨床検査基準値一覧』2025年8月26日改訂版"
TROPONIN_T_SOURCE_LABEL = "浜松医科大学医学部附属病院 検査部『検査部利用手引書 16版 C. 検査項目および基準値』2024年4月1日現在 PDF p.7"
H_FABP_SOURCE_LABEL = "PMDA『JWラテックス H-FABP』電子添文 PDF p.1"
COHB_SOURCE_LABEL = "京都大学医学部附属病院 検査部『検体検査基準値一覧 第14版』PDF p.195"
FIELDNAMES = [
    "項目",
    "略称",
    "分類",
    "参考基準値",
    "単位",
    "基準値出典",
    "上昇要因",
    "低下要因",
    "Full name",
    "説明",
    "解説出典",
    "解説出典URL",
    "看護ポイント",
]


NAME_OVERRIDES = {
    "TP": ("総蛋白", "TP"),
    "Alb": ("アルブミン", "Alb"),
    "T-bill": ("総ビリルビン", "T-Bil"),
    "AST(GOT)": ("アスパラギン酸アミノトランスフェラーゼ", "AST(GOT)"),
    "ALT(GPT)": ("アラニンアミノトランスフェラーゼ", "ALT(GPT)"),
    "γ-GTP": ("γグルタミントランスペプチダーゼ", "γ-GTP"),
    "ALP": ("アルカリフォスファターゼ", "ALP"),
    "CK(CPK)": ("クレアチンキナーゼ", "CK"),
    "Na+": ("ナトリウム", "Na"),
    "K+": ("カリウム", "K"),
    "Ca2+": ("カルシウム", "Ca"),
    "Fe": ("血清鉄", "Fe"),
    "Mg2+": ("マグネシウム", "Mg"),
    "Glu/BS/血糖": ("血漿グルコース（血糖）", "GLU（血漿）"),
}


BASIC_BLOOD_SOURCE = "国立病院機構 東京病院『臨床検査科 各検査について』"
BASIC_BLOOD_SOURCE_URL = "https://tokyo-hp.hosp.go.jp/bumon/kensa/kensa.html"
DIFFERENTIAL_SOURCE = "国立病院機構 名古屋医療センター『血液検査室』"
DIFFERENTIAL_SOURCE_URL = "https://nagoya.hosp.go.jp/clinic/test/specimen/blood/"
RDW_CV_SOURCE = "京都大学医学部附属病院検査部『RDW-CV（赤血球分布幅）』"
RDW_CV_SOURCE_URL = "https://clinical-lab.kuhp.kyoto-u.ac.jp/reference/item/0203050.html"
RDW_SD_SOURCE = "京都大学医学部附属病院検査部『RDW-SD（赤血球分布幅）』"
RDW_SD_SOURCE_URL = "https://clinical-lab.kuhp.kyoto-u.ac.jp/reference/item/0203040.html"
MPV_SOURCE = "京都大学医学部附属病院検査部『MPV（平均血小板容積）』"
MPV_SOURCE_URL = "https://clinical-lab.kuhp.kyoto-u.ac.jp/reference/item/0205020.html"
COAG_SOURCE = "国立病院機構 埼玉病院『血液検査の解説ガイド』"
COAG_SOURCE_URL = "https://saitama.hosp.go.jp/department/examination-blood-list.php"
RESPIRATORY_SOURCE = "日本呼吸器学会『COPD（慢性閉塞性肺疾患）診断と治療のためのガイドライン 第6版』"
RESPIRATORY_SOURCE_URL = "https://www.jrs.or.jp/publication/file/COPD6_20220726.pdf"
ACID_BASE_SOURCE = "新潟大学大学院医歯学総合研究科 腎研究センター『酸塩基平衡を理解する』"
ACID_BASE_SOURCE_URL = "https://www.med.niigata-u.ac.jp/nephrol/pdf/achievement/research_achievement/2012/09_sousetsu/2012-023.pdf"
LACTATE_SOURCE = "日本腹部救急医学会『急性腹症診療ガイドライン2015 第VIII章 急性腹症の検査』"
LACTATE_SOURCE_URL = "https://plaza.umin.ac.jp/jaem/docs/guideline2015_10.pdf"
CO_SOURCE = "米国疾病予防管理センター（CDC）『Clinical Guidance for Carbon Monoxide Poisoning』"
CO_SOURCE_URL = "https://www.cdc.gov/carbon-monoxide/hcp/clinical-guidance/index.html"
BIOCHEM_SOURCE = "国立病院機構 埼玉病院『血液検査の解説ガイド』"
BIOCHEM_SOURCE_URL = "https://saitama.hosp.go.jp/department/examination-blood-list.php"
LIVER_TEST_SOURCE = "MSDマニュアル プロフェッショナル版『肝胆道疾患の臨床検査』"
LIVER_TEST_SOURCE_URL = "https://www.msdmanuals.com/professional/hepatic-and-biliary-disorders/testing-for-hepatic-and-biliary-disorders/laboratory-tests-of-the-liver-and-gallbladder"
JDS_SOURCE = "日本糖尿病学会『糖尿病治療ガイド』"
JDS_SOURCE_URL = "https://www.jds.or.jp/uploads/fckeditor/files/uid000025_67756964655F323031382D323031392E706466.pdf"
MEDLINE_SOURCE = "米国国立医学図書館 MedlinePlus『Medical Tests』"
MEDLINE_URL = "https://medlineplus.gov/lab-tests/"
MHLW_ZINC_SOURCE = "厚生労働省eJIM『亜鉛（医療者向け）』"
MHLW_ZINC_SOURCE_URL = "https://www.ejim.mhlw.go.jp/pro/overseas/c03/19.html"
JRS_KL6_SOURCE = "日本呼吸器学会『肺胞蛋白症診療ガイドライン2022』"
JRS_KL6_SOURCE_URL = "https://www.jrs.or.jp/publication/file/pap2022_241009.pdf"
JCS_ACS_SOURCE = "日本循環器学会『急性冠症候群ガイドライン（2018年改訂版）』"
JCS_ACS_SOURCE_URL = "https://www.j-circ.or.jp/cms/wp-content/uploads/2018/11/JCS2018_kimura.pdf"
JCS_HF_SOURCE = "日本循環器学会『2025年改訂版 心不全診療ガイドライン』"
JCS_HF_SOURCE_URL = "https://www.j-circ.or.jp/cms/wp-content/uploads/2025/03/JCS2025_Kato.pdf"
ICG_SOURCE = "PMDA『ジアグノグリーン注射用25mg』電子添文"
ICG_SOURCE_URL = "https://www.pmda.go.jp/PmdaSearch/bookSearch/01/04987081720705"


def content(full_name, description, nursing_point, source=BASIC_BLOOD_SOURCE, source_url=BASIC_BLOOD_SOURCE_URL, increase="", decrease=""):
    row = {
        "Full name": full_name,
        "説明": description,
        "解説出典": source,
        "解説出典URL": source_url,
        "看護ポイント": nursing_point,
    }
    if increase:
        row["上昇要因"] = increase
    if decrease:
        row["低下要因"] = decrease
    return row


def biochem_content(full_name, description, nursing_point, increase="", decrease=""):
    return content(
        full_name,
        description,
        nursing_point,
        source=BIOCHEM_SOURCE,
        source_url=BIOCHEM_SOURCE_URL,
        increase=increase,
        decrease=decrease,
    )


BLOOD_CONTENT = {
    "白血球数": content(
        "white blood cell count",
        "末梢血中の白血球数を示す。白血球は好中球、リンパ球、単球、好酸球、好塩基球に分けられ、生体防御や免疫を担う。",
        "発熱や感染徴候、白血球分画、CRP、使用薬剤、治療経過と合わせて推移を確認する。",
    ),
    "赤血球数": content(
        "red blood cell count",
        "末梢血中の赤血球数を示す。赤血球内のヘモグロビンが酸素を全身へ運ぶ。",
        "Hb・Htと合わせ、貧血症状、出血の有無、脱水や輸液による変化を確認する。",
    ),
    "ヘモグロビン濃度（血色素濃度）": content(
        "hemoglobin concentration",
        "赤血球に含まれるヘモグロビンの濃度で、血液の酸素運搬能をみる中心的な指標。",
        "息切れ、動悸、倦怠感、顔色、出血の有無を観察し、RBC・Htと推移を確認する。",
    ),
    "ヘマトクリット値": content(
        "hematocrit",
        "血液全体に占める赤血球容積の割合を示し、貧血や赤血球増加の程度をみる。",
        "Hb・RBCと合わせて確認し、脱水や輸液による血液濃縮・希釈の影響も考慮する。",
    ),
    "平均赤血球容積": content(
        "mean corpuscular volume",
        "赤血球1個あたりの平均容積を示す赤血球指数。小球性・正球性・大球性貧血の分類に用いる。",
        "Hb、RDW、鉄関連検査、ビタミンB12・葉酸などと合わせて貧血の型を確認する。",
    ),
    "平均赤血球ヘモグロビン量": content(
        "mean corpuscular hemoglobin",
        "赤血球1個あたりに含まれるヘモグロビン量の平均を示す赤血球指数。",
        "単独で判断せず、Hb・MCV・MCHCと合わせて貧血の性状を確認する。",
    ),
    "平均赤血球ヘモグロビン濃度": content(
        "mean corpuscular hemoglobin concentration",
        "赤血球容積に対するヘモグロビン濃度の平均を示す赤血球指数。",
        "単独で判断せず、Hb・MCV・MCHと合わせて低色素性など貧血の性状を確認する。",
    ),
    "血小板数": content(
        "platelet count",
        "末梢血中の血小板数を示す。血小板は血管損傷部に集まり、一次止血に重要な役割を持つ。",
        "皮下出血、点状出血、歯肉・鼻出血、血尿・血便を観察し、抗凝固薬や抗血小板薬、前回値も確認する。",
    ),
    "網状赤血球": content(
        "reticulocyte count",
        "成熟赤血球になる直前の若い赤血球で、骨髄の赤血球産生状態を反映する。",
        "貧血の程度と網状赤血球の反応を合わせ、出血・溶血後や治療開始後の造血反応を確認する。",
        increase="出血後, 溶血性貧血, 貧血治療後の造血回復",
        decrease="骨髄での造血低下",
    ),
    "赤血球容積の分布幅（変動係数）": content(
        "red cell distribution width - coefficient of variation",
        "赤血球の大きさのばらつきを変動係数で示す。高値ほど赤血球の大小不同が大きい。",
        "MCVと組み合わせて貧血の鑑別に用い、輸血歴や治療経過による変化も確認する。",
        source=RDW_CV_SOURCE,
        source_url=RDW_CV_SOURCE_URL,
        increase="鉄欠乏性貧血など赤血球の大小不同を伴う状態",
    ),
    "赤血球容積の分布幅（標準偏差）": content(
        "red cell distribution width - standard deviation",
        "赤血球の大きさの分布幅を標準偏差で示す。高値ほど赤血球の大小不同が大きい。",
        "RDW-CV・MCVと合わせて確認し、単独値ではなく貧血の経過や輸血歴も考慮する。",
        source=RDW_SD_SOURCE,
        source_url=RDW_SD_SOURCE_URL,
        increase="鉄欠乏性貧血など赤血球の大小不同を伴う状態",
    ),
    "平均血小板容積": content(
        "mean platelet volume",
        "血小板の平均的な大きさを示す。一般に大きい血小板は若く、反応性が高い。",
        "血小板数と必ず組み合わせ、末梢での破壊亢進か骨髄での産生低下かを考える手がかりにする。",
        source=MPV_SOURCE,
        source_url=MPV_SOURCE_URL,
        increase="免疫性血小板減少症など末梢での血小板破壊亢進",
        decrease="再生不良性貧血など骨髄での血小板産生低下",
    ),
    "好塩基球": content(
        "basophil",
        "白血球分画の一つ。ヒスタミンなどを放出し、アレルギー反応に関与する。",
        "割合だけでなく白血球数と絶対数を確認し、アレルギー症状や他の白血球分画と合わせてみる。",
        source=DIFFERENTIAL_SOURCE,
        source_url=DIFFERENTIAL_SOURCE_URL,
    ),
    "好酸球": content(
        "eosinophil",
        "白血球分画の一つ。寄生虫に対する防御やアレルギー反応に関与する。",
        "喘息、発疹、掻痒などのアレルギー症状、薬剤歴、他の白血球分画と合わせて確認する。",
        source=DIFFERENTIAL_SOURCE,
        source_url=DIFFERENTIAL_SOURCE_URL,
        increase="アレルギー性疾患, 寄生虫感染",
    ),
    "杆状核球": content(
        "band neutrophil",
        "核が分葉する前の比較的若い好中球。増加は好中球の左方移動として扱われる。",
        "好中球全体と白血球数、発熱・感染徴候を合わせて確認し、割合だけで判断しない。",
        source=DIFFERENTIAL_SOURCE,
        source_url=DIFFERENTIAL_SOURCE_URL,
        increase="細菌感染や強い炎症に伴う左方移動",
    ),
    "分節核球": content(
        "segmented neutrophil",
        "核が分葉した成熟好中球で、細菌などの異物を貪食・殺菌する。",
        "杆状核球を含む好中球全体、白血球数、感染徴候と合わせて確認する。",
        source=DIFFERENTIAL_SOURCE,
        source_url=DIFFERENTIAL_SOURCE_URL,
    ),
    "好中球": content(
        "neutrophil",
        "白血球分画の一つ。細菌などの異物を貪食し、殺菌する生体防御を担う。",
        "割合だけでなく好中球絶対数を確認し、発熱時は感染徴候、治療薬、骨髄抑制の経過もみる。",
        source=DIFFERENTIAL_SOURCE,
        source_url=DIFFERENTIAL_SOURCE_URL,
    ),
    "リンパ球": content(
        "lymphocyte",
        "白血球分画の一つ。抗体産生やウイルス感染細胞・腫瘍細胞への免疫反応を担う。",
        "割合と絶対数を確認し、感染症状、免疫抑制治療、他の白血球分画と合わせてみる。",
        source=DIFFERENTIAL_SOURCE,
        source_url=DIFFERENTIAL_SOURCE_URL,
    ),
    "単球": content(
        "monocyte",
        "白血球分画の一つ。組織でマクロファージへ分化し、貪食・殺菌や抗原提示を担う。",
        "割合と絶対数を確認し、感染・炎症の経過や他の白血球分画と合わせてみる。",
        source=DIFFERENTIAL_SOURCE,
        source_url=DIFFERENTIAL_SOURCE_URL,
    ),
}


COAG_CONTENT = {
    "Dダイマー": content(
        "D-dimer",
        "体内で形成されたフィブリン血栓が分解されるときに生じる物質。血栓形成と線溶が起きている可能性をみる指標。",
        "片脚の腫脹・疼痛、突然の呼吸困難・胸痛、SpO2低下など血栓症を疑う所見を観察し、症状と経時変化を合わせて確認する。",
        source=COAG_SOURCE,
        source_url=COAG_SOURCE_URL,
    ),
    "フィブリン／フィブリノゲン分解産物": content(
        "fibrinogen/fibrin degradation products",
        "フィブリノゲンやフィブリンが分解されて生じる物質。凝固と線溶の亢進をみる指標。",
        "出血徴候と血栓症状の両方を観察し、血小板数、PT、APTT、フィブリノーゲン、Dダイマーの推移と合わせて確認する。",
        source=COAG_SOURCE,
        source_url=COAG_SOURCE_URL,
    ),
    "フィブリノゲン": content(
        "fibrinogen",
        "肝臓で作られる凝固因子で、凝固反応の最終段階でフィブリンとなり血栓を形成する。炎症でも増加する。",
        "出血・皮下出血、炎症所見、肝機能、血小板数や他の凝固検査と合わせ、急な低下がないか推移を確認する。",
        source=COAG_SOURCE,
        source_url=COAG_SOURCE_URL,
    ),
    "アンチトロンビンIII": content(
        "antithrombin III",
        "トロンビンなどの凝固因子を抑え、血液が過度に固まるのを防ぐ生理的な抗凝固タンパク質。",
        "血栓症状、肝機能、蛋白尿、DIC関連検査、抗凝固療法の内容と合わせて確認する。",
        source=COAG_SOURCE,
        source_url=COAG_SOURCE_URL,
        decrease="DIC, 重症肝障害, ネフローゼ症候群, 先天性アンチトロンビン欠乏症",
    ),
    "活性化部分トロンボプラスチン時間": content(
        "activated partial thromboplastin time",
        "主に内因系・共通系の凝固反応にかかる時間を示す。未分画ヘパリン療法の効果判定などにも用いる。",
        "出血徴候と投薬内容を確認する。ヘパリン投与中は採血時刻・投与量との関係をみて、ヘパリン使用ラインからの採血による混入にも注意する。",
        source=COAG_SOURCE,
        source_url=COAG_SOURCE_URL,
        increase="未分画ヘパリン投与, 凝固因子欠乏, DIC, 重症肝障害",
    ),
    "プロトロンビン時間（活性）": content(
        "prothrombin time activity",
        "主に外因系・共通系の凝固能を活性値（%）で示す。活性低下は凝固に時間がかかる状態を表す。",
        "出血徴候、肝機能、ワルファリンなどの投薬内容を確認し、PT秒・PT-INRと同じ検査の異なる表示法として推移をみる。",
        source=COAG_SOURCE,
        source_url=COAG_SOURCE_URL,
        decrease="ワルファリン服用, ビタミンK欠乏, DIC, 重症肝障害",
    ),
    "プロトロンビン時間（秒）": content(
        "prothrombin time",
        "主に外因系・共通系の凝固反応にかかる時間を秒で示す。肝臓の合成能や抗凝固薬の効果などをみる。",
        "鼻出血、歯肉出血、皮下出血、血尿・血便などを観察し、肝機能、食事摂取状況、投薬内容と合わせて確認する。",
        source=COAG_SOURCE,
        source_url=COAG_SOURCE_URL,
    ),
    "プロトロンビン時間（国際標準比）": content(
        "prothrombin time-international normalized ratio",
        "プロトロンビン時間を試薬差の影響が少なくなるよう国際標準化した比率。主にワルファリン療法の管理に用いる。",
        "ワルファリンの服薬状況、出血徴候、併用薬や食事内容の変化を確認する。治療目標値は疾患や患者ごとに異なるため指示範囲と比較する。",
        source=COAG_SOURCE,
        source_url=COAG_SOURCE_URL,
        increase="ワルファリン服用, ビタミンK欠乏, DIC, 重症肝障害",
    ),
}


BLOOD_GAS_CONTENT = {
    "水素イオン濃度指数": content(
        "hydrogen ion concentration index",
        "血液の酸性・アルカリ性を示す酸塩基平衡の総合指標。PaCO2による呼吸性変化とHCO3-による代謝性変化の両方を反映する。",
        "まずアシデミアかアルカレミアかを確認し、PaCO2、HCO3-、BEを順に見て代償や混合性障害を考える。意識・呼吸・循環状態と合わせる。",
        source=ACID_BASE_SOURCE,
        source_url=ACID_BASE_SOURCE_URL,
        increase="呼吸性アルカローシス, 代謝性アルカローシス",
        decrease="呼吸性アシドーシス, 代謝性アシドーシス",
    ),
    "酸素分圧": content(
        "arterial partial pressure of oxygen",
        "動脈血に溶けている酸素の分圧で、肺での酸素化を評価する。吸入酸素濃度、年齢、換気血流比などの影響を受ける。",
        "採血時の酸素デバイス・流量・FiO2を必ず記録し、SpO2、呼吸数、呼吸仕事量、意識、チアノーゼと合わせて評価する。",
        source=RESPIRATORY_SOURCE,
        source_url=RESPIRATORY_SOURCE_URL,
        increase="酸素投与",
        decrease="換気血流不均衡, 拡散障害, シャント, 肺胞低換気",
    ),
    "炭酸ガス分圧": content(
        "arterial partial pressure of carbon dioxide",
        "動脈血中の二酸化炭素分圧で、肺胞換気の状態を反映する。高値は低換気、低値は過換気を示す手がかりになる。",
        "呼吸数だけでなく呼吸の深さ、努力呼吸、呼吸音、意識状態を確認する。酸素投与や人工呼吸器設定、鎮静薬・オピオイドの影響も合わせてみる。",
        source=RESPIRATORY_SOURCE,
        source_url=RESPIRATORY_SOURCE_URL,
        increase="肺胞低換気, 呼吸性アシドーシス",
        decrease="過換気, 呼吸性アルカローシス",
    ),
    "重炭酸イオン": content(
        "bicarbonate ion",
        "血液中の主要な緩衝塩基で、酸塩基平衡の代謝性成分を示す。主に腎臓による調節や消化管からの喪失の影響を受ける。",
        "pH、PaCO2、BE、電解質、腎機能と合わせて確認し、嘔吐・下痢、輸液、利尿薬など酸塩基平衡に影響する経過を把握する。",
        source=ACID_BASE_SOURCE,
        source_url=ACID_BASE_SOURCE_URL,
        increase="代謝性アルカローシス, 慢性呼吸性アシドーシスの代償",
        decrease="代謝性アシドーシス, 慢性呼吸性アルカローシスの代償",
    ),
    "塩基余剰": content(
        "base excess",
        "PaCO2を標準化した条件で、血液を正常pHに戻すために必要な酸または塩基の量を示し、代謝性の酸塩基変化を評価する。",
        "正負だけで判断せずpH・HCO3-・PaCO2と合わせる。循環不全、腎機能、消化管からの喪失、輸液内容の変化を確認する。",
        source=ACID_BASE_SOURCE,
        source_url=ACID_BASE_SOURCE_URL,
        increase="代謝性アルカローシス",
        decrease="代謝性アシドーシス",
    ),
    "乳酸": content(
        "lactate",
        "糖代謝で生じる物質。組織への酸素供給不足や利用障害、産生増加、肝臓での代謝低下などで上昇する。",
        "血圧、末梢冷感、皮膚色、毛細血管再充満、尿量、意識など組織灌流を観察し、単回値ではなく治療前後の推移を確認する。",
        source=LACTATE_SOURCE,
        source_url=LACTATE_SOURCE_URL,
        increase="ショック, 敗血症, けいれん, 重症喘息発作, 肝機能低下",
    ),
    "酸素飽和度": content(
        "arterial oxygen saturation",
        "動脈血ヘモグロビンのうち酸素と結合している割合。血液ガス分析装置による測定値はSaO2、パルスオキシメータの推定値はSpO2と表す。",
        "酸素デバイス・流量・FiO2と同時に記録し、SpO2の波形や末梢循環も確認する。CO中毒ではSpO2が実際より高く見えることがある。",
        source=RESPIRATORY_SOURCE,
        source_url=RESPIRATORY_SOURCE_URL,
        increase="酸素投与",
        decrease="低酸素血症, 呼吸不全, 循環不全",
    ),
    "一酸化炭素ヘモグロビン": content(
        "carboxyhemoglobin",
        "一酸化炭素がヘモグロビンに結合した割合。増加すると血液の酸素運搬が妨げられ、組織低酸素を起こす。",
        "暖房器具・火災・排気ガスなどの曝露歴、同居者の症状、頭痛・悪心・めまい・意識障害を確認する。通常のSpO2だけでは除外できず、CO-Hb値だけで重症度を判断しない。",
        source=CO_SOURCE,
        source_url=CO_SOURCE_URL,
        increase="一酸化炭素曝露, 喫煙",
    ),
}


BIOCHEM_CONTENT = {
    "総蛋白": biochem_content(
        "total protein",
        "血清中のアルブミンとグロブリンを合わせた蛋白の総量。栄養状態、肝臓での合成、腎臓や消化管からの喪失などをみる。",
        "アルブミン、肝機能、腎機能、尿蛋白、浮腫、食事摂取量と合わせ、脱水や輸液による濃縮・希釈も考慮する。",
    ),
    "アルブミン": biochem_content(
        "albumin",
        "肝臓で合成される主要な血清蛋白。膠質浸透圧の維持や物質の運搬を担い、栄養・肝機能・炎症・蛋白喪失の影響を受ける。",
        "浮腫、腹水、褥瘡、食事摂取量、体重変化を観察し、CRP、肝機能、尿蛋白と合わせて評価する。",
    ),
    "総ビリルビン": biochem_content(
        "total bilirubin",
        "赤血球のヘモグロビン分解で生じるビリルビンの総量。溶血、肝細胞での処理、胆汁排泄の異常で上昇する。",
        "皮膚・眼球結膜の黄染、尿色、便色、掻痒、腹痛を観察し、直接ビリルビンや肝胆道系酵素と合わせてみる。",
    ),
    "直接ビリルビン": biochem_content(
        "direct bilirubin",
        "肝臓で抱合され水溶性になったビリルビン。胆汁うっ滞や胆道閉塞、肝細胞障害などで増加する。",
        "黄疸、濃色尿、灰白色便、掻痒、右上腹部痛を観察し、総ビリルビン、ALP、γ-GTPと合わせて確認する。",
    ),
    "総コレステロール": biochem_content(
        "total cholesterol",
        "血液中に含まれるコレステロールの総量。脂質代謝や動脈硬化リスクの評価に用いる。",
        "HDL-C、LDL-C、TG、食事・飲酒・運動習慣、甲状腺や肝胆道系疾患、服薬状況と合わせて確認する。",
    ),
    "HDLコレステロール": biochem_content(
        "high-density lipoprotein cholesterol",
        "末梢組織の余分なコレステロールを回収して肝臓へ運ぶHDLに含まれるコレステロール。",
        "単独値で判断せずLDL-C、TG、喫煙、運動、糖尿病や血圧など心血管リスク全体を確認する。",
    ),
    "LDLコレステロール": biochem_content(
        "low-density lipoprotein cholesterol",
        "肝臓から末梢へコレステロールを運ぶLDLに含まれ、過剰になると動脈硬化に関与する。",
        "既往歴に応じた管理目標、食事・運動、服薬状況を確認し、HDL-C、TG、他の心血管リスクと合わせる。",
    ),
    "中性脂肪": biochem_content(
        "triglycerides",
        "エネルギー源として蓄えられる脂質。食事や飲酒の影響を受け、高値は動脈硬化や急性膵炎のリスクに関わる。",
        "採血時の食事条件、飲酒、体重、糖代謝、薬剤を確認する。著明高値では上腹部痛や悪心など膵炎症状にも注意する。",
    ),
    "ヘモグロビンA1c": biochem_content(
        "hemoglobin A1c",
        "赤血球内のヘモグロビンに糖が結合した割合で、過去1〜2か月程度の平均的な血糖状態を反映する。",
        "自己血糖測定や食事・治療状況と合わせる。貧血、溶血、輸血、腎不全など赤血球寿命が変化する状態では解釈に注意する。",
    ),
    "血漿グルコース（血糖）": biochem_content(
        "plasma glucose",
        "血漿中のブドウ糖濃度で、糖代謝の状態を示す。食事、運動、ストレス、薬剤などで変動する。",
        "空腹時・食後など採血条件を確認し、冷汗・振戦・意識変化など低血糖症状と口渇・多尿など高血糖症状を観察する。",
    ),
    "血清グルコース（血糖）": biochem_content(
        "serum glucose",
        "血清中のブドウ糖濃度で、糖代謝の状態を示す。検体の種類や採血後の処理により血漿値と差が生じることがある。",
        "空腹時・食後など採血条件を確認し、症状、HbA1c、治療内容と合わせて経時変化をみる。",
    ),
    "ナトリウム": biochem_content(
        "sodium",
        "細胞外液の主要な陽イオンで、体液量や浸透圧の維持に重要。主に水分量との関係で濃度が変化する。",
        "意識、口渇、浮腫、体重、入出量を観察し、血糖、腎機能、輸液、利尿薬などと合わせて急な変化に注意する。",
    ),
    "カリウム": biochem_content(
        "potassium",
        "主に細胞内に存在し、神経伝達や骨格筋・心筋の収縮に重要な電解質。腎機能や酸塩基平衡の影響を受ける。",
        "不整脈、筋力低下、しびれを観察し、心電図、腎機能、尿量、薬剤を確認する。溶血検体による偽高値にも注意する。",
    ),
    "クロール": biochem_content(
        "chloride",
        "細胞外液の主要な陰イオンで、ナトリウムとともに体液量を保ち、酸塩基平衡にも関与する。",
        "Na、HCO3-、血液ガス、嘔吐・下痢、輸液内容、入出量と合わせて評価する。",
    ),
    "カルシウム": biochem_content(
        "calcium",
        "骨の構成、神経・筋収縮、血液凝固に関わる電解質。血清カルシウムの一部はアルブミンと結合している。",
        "しびれ、テタニー、筋力低下、意識変化、不整脈を観察し、アルブミン、腎機能、リン、薬剤と合わせてみる。",
    ),
    "無機リン": biochem_content(
        "inorganic phosphorus",
        "骨や歯の構成、細胞内エネルギー代謝に必要なリンの血中濃度。腎機能や副甲状腺機能、栄養状態の影響を受ける。",
        "腎機能、Ca、Mg、栄養状態と合わせ、筋力低下、意識変化、再栄養時の急低下に注意する。",
    ),
    "アンモニア": biochem_content(
        "ammonia",
        "アミノ酸代謝で生じ、主に肝臓の尿素回路で無毒化される。肝機能低下や門脈体循環シャントなどで上昇する。",
        "意識レベル、羽ばたき振戦、便秘、消化管出血、感染、脱水を確認する。検体処理の影響を受けやすいため採血条件にも注意する。",
    ),
    "血清鉄": biochem_content(
        "serum iron",
        "血清中でトランスフェリンに結合して運ばれている鉄。日内変動や炎症の影響を受ける。",
        "Hb、MCV、フェリチン、TIBC・UIBC、CRPと合わせ、食事・鉄剤・出血徴候を確認する。",
    ),
    "総鉄結合能": biochem_content(
        "total iron-binding capacity",
        "血清中のトランスフェリンが鉄と結合できる総量を示し、体内の鉄状態を評価する。",
        "血清鉄、UIBC、フェリチン、Hb、MCV、炎症所見と合わせ、鉄欠乏か慢性炎症に伴う変化かを確認する。",
    ),
    "不飽和鉄結合能": biochem_content(
        "unsaturated iron-binding capacity",
        "トランスフェリンのうち、まだ鉄と結合していない部分の結合能を示す。",
        "血清鉄、TIBC、フェリチン、Hb、MCVと合わせ、単独値ではなく鉄代謝全体で評価する。",
    ),
    "マグネシウム": biochem_content(
        "magnesium",
        "多くの酵素反応、神経・筋機能、心拍の維持に関わる電解質。腎機能や消化管からの喪失、薬剤の影響を受ける。",
        "不整脈、筋力低下、振戦、けいれんを観察し、K、Ca、腎機能、下痢、利尿薬などと合わせて確認する。",
    ),
    "血清アミラーゼ": biochem_content(
        "serum amylase",
        "膵臓や唾液腺で作られ、でんぷんを分解する酵素。膵炎や唾液腺疾患などで上昇する。",
        "上腹部痛、背部痛、悪心・嘔吐、食事摂取状況を観察し、リパーゼ、肝胆道系検査、画像所見と合わせてみる。",
    ),
    "アルカリフォスファターゼ": biochem_content(
        "alkaline phosphatase",
        "主に肝胆道系や骨に存在する酵素。胆汁うっ滞や骨代謝亢進などで上昇する。",
        "黄疸、掻痒、便・尿色、骨痛を観察し、γ-GTP、ビリルビン、Ca、IPと合わせて由来を考える。",
    ),
    "アスパラギン酸アミノトランスフェラーゼ": biochem_content(
        "aspartate aminotransferase",
        "肝臓、心筋、骨格筋などに存在する酵素で、細胞障害により血中へ逸脱する。",
        "ALT、LD、CKと合わせ、黄疸、倦怠感、筋肉痛、飲酒・薬剤・激しい運動の有無を確認する。",
    ),
    "アラニンアミノトランスフェラーゼ": biochem_content(
        "alanine aminotransferase",
        "主に肝細胞に存在する酵素で、肝細胞障害により血中へ逸脱する。",
        "AST、ビリルビン、ALP、γ-GTPと合わせ、黄疸、倦怠感、飲酒、薬剤やサプリメントの使用を確認する。",
    ),
    "乳酸脱水素酵素": biochem_content(
        "lactate dehydrogenase",
        "肝臓、血球、心筋、骨格筋など多くの組織に存在し、細胞障害で上昇する非特異的な酵素。",
        "他の検査や症状と合わせて障害部位を考える。採血時の溶血でも上昇するため検体情報を確認する。",
    ),
    "γグルタミントランスペプチダーゼ": biochem_content(
        "gamma-glutamyl transferase",
        "主に肝臓・胆道に存在する酵素。胆汁うっ滞やアルコール、薬剤の影響で上昇する。",
        "飲酒量、薬剤、黄疸・掻痒を確認し、ALP、ビリルビン、AST・ALTと合わせて評価する。",
    ),
    "コリンエステラーゼ": biochem_content(
        "cholinesterase",
        "主に肝臓で合成される酵素で、肝臓の蛋白合成能や栄養状態を反映する。",
        "アルブミン、PT、肝機能、食事摂取量、体重と合わせる。急な低下では有機リン曝露の可能性も確認する。",
    ),
    "クレアチンキナーゼ": biochem_content(
        "creatine kinase",
        "骨格筋や心筋などに多い酵素で、筋細胞の障害により血中へ逸脱する。",
        "筋痛、筋力低下、胸痛、褐色尿を観察し、運動、転倒、注射、けいれん、薬剤歴と腎機能を確認する。",
    ),
    "クレアチンキナーゼMB": biochem_content(
        "creatine kinase-MB",
        "CKアイソザイムの一つで心筋に比較的多く、心筋障害の評価に用いられる。",
        "胸痛、呼吸困難、冷汗、心電図を確認し、心筋トロポニンや発症からの時間経過と合わせて判断する。",
    ),
    "尿酸": biochem_content(
        "uric acid",
        "プリン体の最終代謝産物で、主に腎臓から排泄される。高値が続くと尿酸結晶が関節や腎臓に沈着する。",
        "関節の発赤・腫脹・疼痛、尿路症状を観察し、腎機能、尿量、脱水、食事・飲酒、薬剤を確認する。",
    ),
    "クレアチニン": biochem_content(
        "creatinine",
        "筋肉のエネルギー代謝で生じ、主に糸球体から排泄される老廃物。腎濾過機能の指標だが筋肉量の影響を受ける。",
        "尿量、体重、浮腫、脱水、前回値を確認し、eGFR、UN、薬剤、筋肉量と合わせて評価する。",
    ),
    "推定糸球体濾過量": biochem_content(
        "estimated glomerular filtration rate",
        "血清クレアチニン、年齢、性別から推算した腎臓の濾過能力。慢性腎臓病の重症度評価に用いる。",
        "単回値ではなく推移を確認し、尿蛋白、尿量、体液量、腎排泄性薬剤や造影検査の予定と合わせる。",
    ),
    "尿素窒素": biochem_content(
        "urea nitrogen",
        "蛋白質代謝で生じた尿素に含まれる窒素量。腎機能に加え、脱水、蛋白摂取、消化管出血などの影響を受ける。",
        "クレアチニン、尿量、入出量、脱水所見、食事、発熱・異化亢進、黒色便などと合わせて確認する。",
    ),
    "C-反応性蛋白": biochem_content(
        "C-reactive protein",
        "感染や炎症、組織障害に反応して肝臓で産生が増える急性期蛋白。原因疾患に特異的な検査ではない。",
        "体温、症状、感染徴候、白血球数、培養結果と合わせ、単回値より治療前後の推移を確認する。",
    ),
    "胆汁酸": content(
        "total bile acids",
        "肝臓でコレステロールから作られ、胆汁として分泌される物質。肝細胞障害や胆汁うっ滞などで血中濃度が上昇する。",
        "空腹時など採血条件を確認し、黄疸、掻痒、便・尿色、AST・ALT、ALP、γ-GTP、ビリルビンと合わせてみる。",
        source=LIVER_TEST_SOURCE, source_url=LIVER_TEST_SOURCE_URL,
    ),
    "インドシアニングリーン試験": content(
        "indocyanine green retention rate at 15 minutes",
        "静注したインドシアニングリーンが肝臓に取り込まれ胆汁へ排泄される性質を利用し、15分後の血中停滞率から肝予備能を評価する。",
        "検査前の指示、過敏症歴、注入・採血時刻を確認し、検査中は呼吸苦、発疹、血圧低下などの反応を観察する。",
        source=ICG_SOURCE, source_url=ICG_SOURCE_URL,
        increase="肝予備能低下, 肝血流低下, 胆汁排泄障害",
    ),
    "グリコアルブミン": content(
        "glycated albumin",
        "血清アルブミンに糖が結合した割合で、主に直近約2週間の平均的な血糖状態を反映する。",
        "血糖やHbA1cと合わせる。ネフローゼ、甲状腺疾患、肝硬変などアルブミン代謝が変化する状態では解釈に注意する。",
        source=JDS_SOURCE, source_url=JDS_SOURCE_URL,
    ),
    "血液浸透圧": content(
        "plasma osmolality",
        "血漿中に溶けているNa、糖、尿素などの粒子濃度を示し、体内の水分バランスを評価する。",
        "意識、口渇、粘膜乾燥、浮腫、体重、入出量を観察し、Na、血糖、UN、腎機能と合わせて確認する。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/osmolality-tests/",
    ),
    "亜鉛": content(
        "zinc",
        "多数の酵素反応、蛋白合成、免疫、創傷治癒、味覚に必要な微量元素。低栄養や吸収不良、喪失増加などで低下する。",
        "味覚障害、皮膚炎、脱毛、創傷治癒遅延、食事摂取量、下痢を確認し、アルブミンや炎症所見と合わせる。",
        source=MHLW_ZINC_SOURCE, source_url=MHLW_ZINC_SOURCE_URL,
    ),
    "尿中アミラーゼ": content(
        "urine amylase",
        "血中から腎臓を通って尿へ排泄されたアミラーゼ。膵疾患などで上昇し、血清値より長く高値が続くことがある。",
        "採尿時刻・蓄尿条件と尿量を確認し、上腹部痛、血清アミラーゼ、リパーゼ、腎機能と合わせてみる。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/amylase-test/",
    ),
    "ロイシンアミノペプチダーゼ": content(
        "leucine aminopeptidase",
        "肝臓や胆道などに存在する酵素で、胆汁うっ滞や胆道系の障害で上昇する。",
        "黄疸、掻痒、便・尿色、腹痛を観察し、ALP、γ-GTP、ビリルビン、画像所見と合わせて確認する。",
        source=LIVER_TEST_SOURCE, source_url=LIVER_TEST_SOURCE_URL,
    ),
    "β2-マイクログロブリン": content(
        "beta-2 microglobulin",
        "多くの有核細胞表面に存在する蛋白で、腎機能低下、炎症、リンパ系・血液疾患などで血中濃度が上昇する。",
        "腎機能、炎症所見、血算、疾患の治療経過と合わせ、単独値ではなく推移を確認する。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/beta-2-microglobulin-b2m-tumor-marker-test/",
    ),
    "プレアルブミン": content(
        "prealbumin (transthyretin)",
        "肝臓で合成される半減期の短い蛋白で、短期間の栄養状態変化をみる補助指標。炎症や肝機能の影響も受ける。",
        "食事摂取量、体重、浮腫、CRP、肝機能と合わせ、栄養介入前後の推移を確認する。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/prealbumin-blood-test/",
    ),
    "ハプトグロビン": content(
        "haptoglobin",
        "血管内で遊離したヘモグロビンと結合する蛋白。血管内溶血では消費されて低下し、炎症では増加することがある。",
        "貧血、黄疸、褐色尿を観察し、Hb、網状赤血球、LD、間接ビリルビンと合わせて溶血の有無を確認する。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/haptoglobin-hp-test/",
    ),
    "シアリル化糖鎖抗原KL-6": content(
        "sialylated carbohydrate antigen KL-6",
        "主にII型肺胞上皮細胞に関連する糖蛋白で、間質性肺疾患の活動性や経過をみる補助指標。疾患に特異的ではない。",
        "息切れ、乾性咳嗽、SpO2、呼吸数、画像・肺機能と合わせ、単回値より経時変化を確認する。",
        source=JRS_KL6_SOURCE, source_url=JRS_KL6_SOURCE_URL,
    ),
    "免疫グロブリンG": content(
        "immunoglobulin G",
        "血中で最も多い免疫グロブリンで、感染防御や長期的な免疫応答を担う。慢性炎症、自己免疫、免疫不全などで変動する。",
        "感染歴、発熱、自己免疫症状、蛋白分画、IgA・IgMと合わせ、必要時は単クローン性かどうかを確認する。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/immunoglobulins-blood-test/",
    ),
    "免疫グロブリンA": content(
        "immunoglobulin A",
        "血液や気道・消化管などの粘膜に存在し、粘膜面の感染防御を担う免疫グロブリン。",
        "反復感染、呼吸器・消化器症状、肝疾患や自己免疫症状を確認し、IgG・IgM、蛋白分画と合わせる。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/immunoglobulins-blood-test/",
    ),
    "免疫グロブリンM": content(
        "immunoglobulin M",
        "感染初期などに最初に産生される免疫グロブリンで、一次免疫応答に重要な役割を持つ。",
        "感染徴候、肝胆道疾患や自己免疫症状を確認し、IgG・IgA、蛋白分画と合わせて評価する。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/immunoglobulins-blood-test/",
    ),
    "心筋トロポニンI": content(
        "cardiac troponin I",
        "心筋収縮に関わる蛋白で、心筋細胞が障害されると血中へ放出される。急性心筋梗塞を含む心筋障害の重要な指標。",
        "胸痛、呼吸困難、冷汗、悪心、心電図を直ちに確認し、発症・採血時刻と連続測定の変化をみる。",
        source=JCS_ACS_SOURCE, source_url=JCS_ACS_SOURCE_URL,
    ),
    "心筋トロポニンT": content(
        "cardiac troponin T",
        "心筋収縮に関わる蛋白で、心筋細胞が障害されると血中へ放出される。上昇は原因を問わず心筋障害を示す。",
        "胸痛、呼吸困難、冷汗、心電図を確認し、発症時刻、腎機能、連続測定の上昇・低下パターンと合わせる。",
        source=JCS_ACS_SOURCE, source_url=JCS_ACS_SOURCE_URL,
    ),
    "心臓由来脂肪酸結合蛋白": content(
        "heart-type fatty acid-binding protein",
        "心筋細胞質に存在する低分子蛋白で、心筋障害後の比較的早期に血中へ放出される。腎機能低下でも上昇しうる。",
        "胸痛、呼吸困難、心電図、発症時刻を確認し、トロポニン、CK-MB、腎機能と合わせて判断する。",
        source=JCS_ACS_SOURCE, source_url=JCS_ACS_SOURCE_URL,
    ),
    "脳性ナトリウム利尿ペプチド": content(
        "B-type natriuretic peptide",
        "主に心室への圧・容量負荷で分泌が増えるホルモンで、心不全の診断や重症度・経過評価を補助する。",
        "呼吸困難、起坐呼吸、浮腫、体重、尿量、SpO2を観察し、腎機能、年齢、心エコー、治療前後の推移と合わせる。",
        source=JCS_HF_SOURCE, source_url=JCS_HF_SOURCE_URL,
    ),
    "リパーゼ": content(
        "lipase",
        "主に膵臓で作られ脂肪を分解する酵素。急性膵炎などで上昇し、アミラーゼより膵臓に比較的特異的。",
        "上腹部痛・背部痛、悪心・嘔吐、発熱、食事摂取を観察し、アミラーゼ、肝胆道系検査、画像所見と合わせる。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/lipase-tests/",
    ),
    "フェリチン": content(
        "ferritin",
        "鉄を結合して体内に貯蔵する蛋白。貯蔵鉄の状態をみる指標で、鉄欠乏で低下し、炎症や肝疾患などでも変動する。",
        "Hb、MCV、血清鉄、TIBC・UIBC、CRPと合わせ、出血、月経、食事、鉄剤使用、感染・炎症徴候を確認する。",
        source=MEDLINE_SOURCE, source_url="https://medlineplus.gov/lab-tests/ferritin-blood-test/",
        increase="鉄過剰, 感染・炎症, 肝疾患, 悪性腫瘍",
        decrease="鉄欠乏",
    ),
}


def reference_row(category, item, abbreviation, common="", male="", female="", unit="", page=0, match_source="", source_label=""):
    if common:
        reference_range = common
    elif male and female:
        reference_range = f"男性：{male} / 女性：{female}"
    else:
        reference_range = male or female
    return {
        "分類": category,
        "項目": item,
        "略称": abbreviation,
        "参考基準値": reference_range,
        "単位": unit,
        "基準値出典": source_label or f"{SOURCE_LABEL} p.{page}",
        "match_source": match_source,
    }


REFERENCE_ROWS = [
    # 血算: p.2
    reference_row("血算", "白血球数", "WBC", common="3.3〜8.6", unit="10³/μL", page=2, match_source="WBC/白血球"),
    reference_row("血算", "赤血球数", "RBC", male="435〜555", female="386〜492", unit="10⁴/μL", page=2, match_source="RBC/赤血球"),
    reference_row("血算", "ヘモグロビン濃度（血色素濃度）", "Hgb", male="13.7〜16.8", female="11.6〜14.8", unit="g/dL", page=2, match_source="Hb/ヘモグロビン/血色素量"),
    reference_row("血算", "ヘマトクリット値", "Ht", male="40.7〜50.1", female="35.1〜44.4", unit="%", page=2, match_source="Ht/ヘマトクリット"),
    reference_row("血算", "平均赤血球容積", "MCV", common="83.6〜98.2", unit="fL", page=2, match_source="MCV/平均赤血球容積"),
    reference_row("血算", "平均赤血球ヘモグロビン量", "MCH", common="27.5〜33.2", unit="pg", page=2, match_source="MCH/平均赤血球血色素量"),
    reference_row("血算", "平均赤血球ヘモグロビン濃度", "MCHC", common="31.7〜35.3", unit="g/dL", page=2, match_source="MCHC/平均赤血球血色素濃度"),
    reference_row("血算", "血小板数", "PLAT", common="15.8〜34.8", unit="10⁴/μL", page=2, match_source="PLT/血小板数"),
    reference_row("血算", "網状赤血球", "RET", male="3.6〜20.6", female="3.6〜22.0", unit="‰", page=2),
    reference_row("血算", "赤血球容積の分布幅（変動係数）", "RDW-CV", male="11.6〜14.7", female="11.8〜16.9", unit="%", page=2),
    reference_row("血算", "赤血球容積の分布幅（標準偏差）", "RDW-SD", male="38.2〜51.6", female="38.8〜50.5", unit="fL", page=2),
    reference_row("血算", "平均血小板容積", "MPV", male="9.0〜12.3", female="8.8〜12.0", unit="fL", page=2),
    reference_row("血算", "好塩基球", "Baso", common="0.0〜2.5", unit="%", page=2, match_source="好塩基球"),
    reference_row("血算", "好酸球", "Eos", common="0.0〜8.5", unit="%", page=2, match_source="好酸球"),
    reference_row("血算", "杆状核球", "Stab", common="0.5〜6.5", unit="%", page=2),
    reference_row("血算", "分節核球", "Seg", common="38.0〜74.0", unit="%", page=2),
    reference_row("血算", "好中球", "Neut", common="40.6〜76.4", unit="%", page=2, match_source="好中球"),
    reference_row("血算", "リンパ球", "Lymp", common="16.5〜49.5", unit="%", page=2, match_source="リンパ球"),
    reference_row("血算", "単球", "Mono", common="2.0〜10.0", unit="%", page=2),

    # 凝固: p.3
    reference_row("凝固", "Dダイマー", "D-D", common="1.0以下", unit="μg/mL", page=3, match_source="Dダイマー"),
    reference_row("凝固", "フィブリン／フィブリノゲン分解産物", "FDP", common="5.0以下", unit="μg/mL", page=3, match_source="FDP"),
    reference_row("凝固", "フィブリノゲン", "FIBG", common="200〜400", unit="mg/dL", page=3, match_source="フィブリノゲン"),
    reference_row("凝固", "アンチトロンビンIII", "ATIII", common="80〜130", unit="%", page=3),
    reference_row("凝固", "活性化部分トロンボプラスチン時間", "APTT", common="23.8〜34.4", unit="秒", page=3, match_source="APTT/活性化部分トロンボプラスチン時間"),
    reference_row("凝固", "プロトロンビン時間（活性）", "PT %", common="70.0〜140.0", unit="%", page=3),
    reference_row("凝固", "プロトロンビン時間（秒）", "PT 秒", common="9.0〜13.0", unit="秒", page=3, match_source="プロトロンビン時間/PT"),
    reference_row("凝固", "プロトロンビン時間（国際標準比）", "PT-INR", common="0.80〜1.20", page=3),

    # 生化学: p.6
    reference_row("生化学", "総蛋白", "TP", common="6.6〜8.1", unit="g/dL", page=6, match_source="TP"),
    reference_row("生化学", "アルブミン", "ALB", common="4.1〜5.1", unit="g/dL", page=6, match_source="Alb"),
    reference_row("生化学", "総ビリルビン", "T-Bil", common="0.4〜1.5", unit="mg/dL", page=6, match_source="T-bill"),
    reference_row("生化学", "直接ビリルビン", "D-Bil", common="0.3以下", unit="mg/dL", page=6),
    reference_row("生化学", "胆汁酸", "TBA", common="10以下", unit="μmol/L", page=6),
    reference_row("生化学", "インドシアニングリーン試験", "ICG15’", common="10以下", unit="%", page=6),
    reference_row("生化学", "総コレステロール", "TC", common="142〜248", unit="mg/dL", page=6),
    reference_row("生化学", "HDLコレステロール", "HDL-C", male="38〜90", female="48〜103", unit="mg/dL", page=6),
    reference_row("生化学", "LDLコレステロール", "LDL-C", common="65〜163", unit="mg/dL", page=6),
    reference_row("生化学", "中性脂肪", "TG", male="40〜234", female="30〜117", unit="mg/dL", page=6),
    reference_row("生化学", "ヘモグロビンA1c", "HbA1c", common="4.6〜6.2（NGSP値）", unit="%", page=6, match_source="HbA1c/ヘモグロビンA1c"),
    reference_row("生化学", "血漿グルコース（血糖）", "GLU（血漿）", common="73〜109", unit="mg/dL", page=6, match_source="Glu/BS/血糖"),
    reference_row("生化学", "血清グルコース（血糖）", "GLU（血清）", common="73〜109", unit="mg/dL", page=6),
    reference_row("生化学", "グリコアルブミン", "GA", common="11〜16", unit="%", page=6),
    reference_row("生化学", "ナトリウム", "Na", common="138〜145", unit="mmol/L", page=6, match_source="Na+"),
    reference_row("生化学", "カリウム", "K", common="3.6〜4.8", unit="mmol/L", page=6, match_source="K+"),
    reference_row("生化学", "クロール", "Cl", common="101〜108", unit="mmol/L", page=6, match_source="Cl-/クロール"),
    reference_row("生化学", "カルシウム", "Ca", common="8.8〜10.1", unit="mg/dL", page=6, match_source="Ca2+"),
    reference_row("生化学", "無機リン", "IP", common="2.7〜4.6", unit="mg/dL", page=6, match_source="IP/無機リン"),
    reference_row("生化学", "血液浸透圧", "Posm", common="275〜290", unit="mOsm/Kg H₂O", page=6),
    reference_row("生化学", "アンモニア", "NH3", common="12〜66", unit="μg/dL", page=6, match_source="NH3/アンモニア"),
    reference_row("生化学", "血清鉄", "Fe", common="40〜188", unit="μg/dL", page=6, match_source="Fe"),

    # 生化学: p.7
    reference_row("生化学", "総鉄結合能", "TIBC", male="253〜365", female="246〜410", unit="μg/dL", page=7),
    reference_row("生化学", "不飽和鉄結合能", "UIBC", male="170〜250", female="180〜270", unit="μg/dL", page=7),
    reference_row("生化学", "マグネシウム", "Mg", common="1.8〜2.4", unit="mg/dL", page=7, match_source="Mg2+"),
    reference_row("生化学", "亜鉛", "Zn", common="80〜130", unit="μg/dL", page=7),
    reference_row("生化学", "血清アミラーゼ", "AMY", common="44〜132", unit="U/L", page=7, match_source="AMY/アミラーゼ"),
    reference_row("生化学", "尿中アミラーゼ", "尿-AMY", common="700未満", unit="U/L", page=7),
    reference_row("生化学", "アルカリフォスファターゼ", "ALP（IFCC）", common="38〜113", unit="U/L", page=7, match_source="ALP"),
    reference_row("生化学", "アスパラギン酸アミノトランスフェラーゼ", "AST（GOT）", common="13〜30", unit="U/L", page=7, match_source="AST(GOT)"),
    reference_row("生化学", "アラニンアミノトランスフェラーゼ", "ALT（GPT）", male="10〜42", female="7〜23", unit="U/L", page=7, match_source="ALT(GPT)"),
    reference_row("生化学", "乳酸脱水素酵素", "LD（IFCC）", common="124〜222", unit="U/L", page=7, match_source="LD(LDH)/乳酸脱水素酵素"),
    reference_row("生化学", "γグルタミントランスペプチダーゼ", "γ-GTP", male="13〜64", female="9〜32", unit="U/L", page=7, match_source="γ-GTP"),
    reference_row("生化学", "ロイシンアミノペプチダーゼ", "LAP", common="30〜70", unit="U/L", page=7),
    reference_row("生化学", "コリンエステラーゼ", "ChE", male="240〜486", female="201〜421", unit="U/L", page=7),
    reference_row("生化学", "クレアチンキナーゼ", "CK", male="59〜248", female="41〜153", unit="U/L", page=7, match_source="CK(CPK)"),
    reference_row("生化学", "クレアチンキナーゼMB", "CKMB", common="6.6以下", unit="ng/mL", page=7),
    reference_row("生化学", "尿酸", "UA", male="3.7〜7.8", female="2.6〜5.5", unit="mg/dL", page=7),
    reference_row("生化学", "クレアチニン", "CRE", male="0.65〜1.07", female="0.46〜0.79", unit="mg/dL", page=7, match_source="Cr/クレアチニン"),
    reference_row("生化学", "推定糸球体濾過量", "eGFR", common="60以上", unit="mL/min/1.73m²", page=7),
    reference_row("生化学", "尿素窒素", "UN", common="8〜20", unit="mg/dL", page=7, match_source="BUN(UN)/尿素窒素"),
    reference_row("生化学", "β2-マイクログロブリン", "β2-MG", common="0.8〜2.0", unit="mg/L", page=7),
    reference_row("生化学", "プレアルブミン", "PreAlb", common="22〜40", unit="mg/dL", page=7),

    # 生化学と血液ガス: p.8
    reference_row("生化学", "ハプトグロビン", "Hpt", common="19〜170", unit="mg/dL", page=8),
    reference_row("生化学", "C-反応性蛋白", "CRP", common="0.14以下", unit="mg/dL", page=8, match_source="CRP/C反応性蛋白"),
    reference_row("生化学", "シアリル化糖鎖抗原KL-6", "KL-6", common="500未満", unit="U/mL", page=8),
    reference_row("生化学", "免疫グロブリンG", "IgG", common="861〜1747", unit="mg/dL", page=8),
    reference_row("生化学", "免疫グロブリンA", "IgA", common="93〜393", unit="mg/dL", page=8),
    reference_row("生化学", "免疫グロブリンM", "IgM", male="33〜183", female="50〜269", unit="mg/dL", page=8),
    reference_row("生化学", "心筋トロポニンI", "TnI", common="0.03以下", unit="ng/mL", page=8),
    reference_row("生化学", "心筋トロポニンT", "TnT", common="0〜0.014", unit="ng/mL", match_source="トロポニンT", source_label=TROPONIN_T_SOURCE_LABEL),
    reference_row("生化学", "心臓由来脂肪酸結合蛋白", "H-FABP", common="5.0以下", unit="ng/mL", match_source="H-FABP", source_label=H_FABP_SOURCE_LABEL),
    reference_row("生化学", "脳性ナトリウム利尿ペプチド", "BNP", common="18.4以下", unit="pg/mL", page=8, match_source="BNP(NT-proBNP)/脳性ナトリウム利尿ペプチド"),
    reference_row("生化学", "リパーゼ", "Lipase", common="13〜55", unit="U/L", page=8),
    reference_row("血液ガス", "水素イオン濃度指数", "pH", common="7.350〜7.450", page=8, match_source="pH/水素イオン指数"),
    reference_row("血液ガス", "酸素分圧", "PaO2", common="75.0〜100.0", unit="mmHg", page=8, match_source="PaO2/動脈血酸素分圧"),
    reference_row("血液ガス", "炭酸ガス分圧", "PaCO2", common="35.0〜45.0", unit="mmHg", page=8, match_source="PaCO2/動脈血二酸化炭素分圧"),
    reference_row("血液ガス", "重炭酸イオン", "HCO3-", common="20.0〜26.0", unit="mmol/L", page=8, match_source="HCO3-/重炭酸イオン"),
    reference_row("血液ガス", "塩基余剰", "BE", common="-3.0〜3.0", unit="mmol/L", page=8, match_source="BE/ベースエクセス/塩基過剰"),
    reference_row("血液ガス", "乳酸", "Lac", common="0.5〜1.6", unit="mmol/L", page=8, match_source="Lac/乳酸"),
    reference_row("血液ガス", "酸素飽和度", "SAT", common="92.0〜98.5", unit="%", page=8),
    reference_row("血液ガス", "一酸化炭素ヘモグロビン", "CO-Hb", common="0.5〜1.5", unit="%", match_source="CO-Hb/一酸化炭素ヘモグロビン", source_label=COHB_SOURCE_LABEL),

    # 既存項目との重複を新資料で更新: p.10
    reference_row("腫瘍マーカー", "フェリチン", "FER", male="25〜280", female="10〜120", unit="ng/mL", page=10),
]


def split_name(value):
    if value in NAME_OVERRIDES:
        return NAME_OVERRIDES[value]
    parts = [part.strip() for part in value.split("/") if part.strip()]
    if len(parts) == 1:
        return parts[0], ""
    first, rest = parts[0], parts[1:]
    if any(character.isascii() and character.isalnum() for character in first) or any(
        character in first for character in "+-()γ"
    ):
        return " / ".join(rest), first
    return first, " / ".join(rest)


def classify_original(source_name, collection_method):
    if "血算" in collection_method or source_name in {"好塩基球", "好酸球", "好中球", "リンパ球"}:
        return "血算"
    if "凝固" in collection_method:
        return "凝固"
    if "血液ガス" in collection_method:
        return "血液ガス"
    if "生化学" in collection_method or "血糖" in collection_method:
        return "生化学"
    return "その他"


def read_original_rows(source_path):
    with source_path.open("r", encoding="utf-8-sig", newline="") as source_file:
        source_rows = list(csv.DictReader(source_file))

    rows = []
    for source_row in source_rows:
        source_name = source_row["項目/略称"].strip()
        item, abbreviation = split_name(source_name)
        rows.append({
            "source_name": source_name,
            "項目": item,
            "略称": abbreviation,
            "分類": classify_original(source_name, source_row.get("採血方法", "")),
            "参考基準値": "",
            "単位": "",
            "基準値出典": "",
            "上昇要因": source_row.get("上昇要因", ""),
            "低下要因": source_row.get("低下要因", ""),
            "Full name": source_row.get("Full name", ""),
            "説明": source_row.get("説明", ""),
            "解説出典": source_row.get("解説出典", ""),
            "解説出典URL": source_row.get("解説出典URL", ""),
            "看護ポイント": source_row.get("看護ポイント", ""),
        })
    return rows


def build_rows(source_path):
    originals = read_original_rows(source_path)
    original_by_source = {row["source_name"]: row for row in originals}
    used_sources = set()
    output_rows = []

    for reference in REFERENCE_ROWS:
        match_source = reference["match_source"]
        original = original_by_source.get(match_source, {})
        enrichment = BLOOD_CONTENT.get(
            reference["項目"],
            COAG_CONTENT.get(
                reference["項目"],
                BLOOD_GAS_CONTENT.get(reference["項目"], BIOCHEM_CONTENT.get(reference["項目"], {})),
            ),
        )
        if match_source and original:
            used_sources.add(match_source)

        output_rows.append({
            "項目": reference["項目"],
            "略称": reference["略称"],
            "分類": reference["分類"],
            "参考基準値": reference["参考基準値"],
            "単位": reference["単位"],
            "基準値出典": reference["基準値出典"],
            "上昇要因": enrichment.get("上昇要因", original.get("上昇要因", "")),
            "低下要因": enrichment.get("低下要因", original.get("低下要因", "")),
            "Full name": enrichment.get("Full name", original.get("Full name", "")),
            "説明": enrichment.get("説明", original.get("説明", "")),
            "解説出典": enrichment.get("解説出典", original.get("解説出典", "")),
            "解説出典URL": enrichment.get("解説出典URL", original.get("解説出典URL", "")),
            "看護ポイント": enrichment.get("看護ポイント", original.get("看護ポイント", "")),
        })

    for original in originals:
        if original["source_name"] in used_sources:
            continue
        output_rows.append({key: original[key] for key in FIELDNAMES})

    return output_rows


def main():
    parser = argparse.ArgumentParser(description="Build the website lab-value CSV from approved source data.")
    parser.add_argument("source_csv", type=Path)
    parser.add_argument("output_csv", type=Path)
    args = parser.parse_args()

    rows = build_rows(args.source_csv)
    with args.output_csv.open("w", encoding="utf-8", newline="") as output_file:
        writer = csv.DictWriter(output_file, fieldnames=FIELDNAMES, lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {len(rows)} lab items to {args.output_csv}")


if __name__ == "__main__":
    main()

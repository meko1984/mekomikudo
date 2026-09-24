window.NURSING_DATABASE = {
  "countLabel": "疾患・病態",
  "columns": [
    "疾患名",
    "領域",
    "主な症状",
    "検査値UP",
    "検査値DOWN",
    "代表的な薬"
  ],
  "systems": {
    "救急": "emergency",
    "呼吸器": "respiratory",
    "循環器": "cardiovascular",
    "消化器": "digestive",
    "腎・泌尿器": "renal",
    "内分泌・代謝": "endocrine",
    "脳神経": "neurological",
    "精神": "mental",
    "皮膚・熱傷": "skin",
    "運動器": "orthopedic"
  },
  "rows": [
    {
      "疾患名": "ショック",
      "領域": [
        "救急"
      ],
      "主な症状": [
        "意識変化",
        "末梢循環不良",
        "尿量低下"
      ],
      "検査値UP": [
        "乳酸"
      ],
      "検査値DOWN": [
        "pH"
      ],
      "関連薬剤": [
        "ノルアドレナリン"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "circulation",
          "urinary"
        ],
        "検査値UP": [
          "general-lab"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "cardiovascular-drug"
        ]
      },
      "href": "shock/",
      "system": "emergency"
    },
    {
      "疾患名": "リフィーディング症候群",
      "領域": [
        "救急",
        "消化器"
      ],
      "主な症状": [
        "脱力",
        "浮腫",
        "動悸",
        "意識変化"
      ],
      "検査値UP": [
        "血糖"
      ],
      "検査値DOWN": [
        "P",
        "K",
        "Mg"
      ],
      "関連薬剤": [
        "ビタミンB₁",
        "電解質補充製剤"
      ],
      "_categories": {
        "主な症状": [
          "mobility",
          "circulation",
          "circulation",
          "neurologic"
        ],
        "検査値UP": [
          "glucose-lab"
        ],
        "検査値DOWN": [
          "electrolyte",
          "electrolyte",
          "electrolyte"
        ],
        "関連薬剤": [
          "metabolic-drug",
          "fluid-drug"
        ]
      },
      "href": "refeeding/",
      "system": "emergency"
    },
    {
      "疾患名": "低栄養",
      "領域": [
        "救急"
      ],
      "主な症状": [
        "体重減少",
        "筋力低下",
        "食べにくさ"
      ],
      "検査値UP": [],
      "検査値DOWN": [
        "Alb"
      ],
      "関連薬剤": [
        "ビタミン"
      ],
      "_categories": {
        "主な症状": [
          "digestive",
          "mobility",
          "digestive"
        ],
        "検査値UP": [],
        "検査値DOWN": [
          "liver-lab"
        ],
        "関連薬剤": [
          "metabolic-drug"
        ]
      },
      "href": "malnutrition/",
      "system": "emergency"
    },
    {
      "疾患名": "廃用症候群",
      "領域": [
        "救急"
      ],
      "主な症状": [
        "筋力低下",
        "立ちくらみ",
        "生活機能低下"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [],
      "_categories": {
        "主な症状": [
          "mobility",
          "neurologic",
          "general"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": []
      },
      "href": "disuse/",
      "system": "emergency"
    },
    {
      "疾患名": "感染",
      "領域": [
        "救急"
      ],
      "主な症状": [
        "局所症状",
        "発熱",
        "悪寒",
        "全身悪化"
      ],
      "検査値UP": [
        "CRP",
        "WBC"
      ],
      "検査値DOWN": [
        "WBC"
      ],
      "関連薬剤": [
        "抗菌薬",
        "抗ウイルス薬"
      ],
      "_categories": {
        "主な症状": [
          "general",
          "infection",
          "infection",
          "infection"
        ],
        "検査値UP": [
          "inflammation",
          "inflammation"
        ],
        "検査値DOWN": [
          "inflammation"
        ],
        "関連薬剤": [
          "anti-infective",
          "anti-infective"
        ]
      },
      "href": "infection/",
      "system": "emergency"
    },
    {
      "疾患名": "敗血症",
      "領域": [
        "救急"
      ],
      "主な症状": [
        "意識変化",
        "呼吸",
        "循環の悪化",
        "腎機能低下"
      ],
      "検査値UP": [
        "乳酸",
        "CRP"
      ],
      "検査値DOWN": [
        "血小板",
        "WBC"
      ],
      "関連薬剤": [
        "抗菌薬",
        "ノルアドレナリン"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "breathing",
          "circulation",
          "urinary"
        ],
        "検査値UP": [
          "general-lab",
          "inflammation"
        ],
        "検査値DOWN": [
          "hematology",
          "inflammation"
        ],
        "関連薬剤": [
          "anti-infective",
          "cardiovascular-drug"
        ]
      },
      "href": "sepsis/",
      "system": "emergency"
    },
    {
      "疾患名": "静脈炎",
      "領域": [
        "救急"
      ],
      "主な症状": [
        "痛み",
        "発赤",
        "硬結",
        "発熱",
        "腫脹"
      ],
      "検査値UP": [
        "CRP",
        "WBC"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "鎮痛薬",
        "抗菌薬",
        "抗凝固薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "skin",
          "skin",
          "infection",
          "skin"
        ],
        "検査値UP": [
          "inflammation",
          "inflammation"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "analgesic",
          "anti-infective",
          "antithrombotic"
        ]
      },
      "href": "phlebitis/",
      "system": "emergency"
    },
    {
      "疾患名": "COPD（慢性閉塞性肺疾患）",
      "領域": [
        "呼吸器"
      ],
      "主な症状": [
        "息切れ",
        "咳",
        "痰",
        "傾眠"
      ],
      "検査値UP": [
        "PaCO₂"
      ],
      "検査値DOWN": [
        "PaO₂"
      ],
      "関連薬剤": [
        "LAMA",
        "LABA",
        "ICS"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "breathing",
          "breathing",
          "neurologic"
        ],
        "検査値UP": [
          "blood-gas"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "respiratory-drug",
          "respiratory-drug",
          "respiratory-drug"
        ]
      },
      "href": "copd/",
      "system": "respiratory"
    },
    {
      "疾患名": "呼吸不全",
      "領域": [
        "呼吸器"
      ],
      "主な症状": [
        "息苦しさ",
        "酸素化低下",
        "傾眠"
      ],
      "検査値UP": [
        "PaCO₂"
      ],
      "検査値DOWN": [
        "PaO₂",
        "pH"
      ],
      "関連薬剤": [
        "気管支拡張薬",
        "抗菌薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "breathing",
          "neurologic"
        ],
        "検査値UP": [
          "blood-gas"
        ],
        "検査値DOWN": [
          "blood-gas",
          "blood-gas"
        ],
        "関連薬剤": [
          "respiratory-drug",
          "anti-infective"
        ]
      },
      "href": "respiratory-failure/",
      "system": "respiratory"
    },
    {
      "疾患名": "気管支喘息",
      "領域": [
        "呼吸器"
      ],
      "主な症状": [
        "喘鳴",
        "咳",
        "呼吸困難",
        "夜間の症状"
      ],
      "検査値UP": [
        "好酸球",
        "PaCO₂"
      ],
      "検査値DOWN": [
        "PaO₂"
      ],
      "関連薬剤": [
        "ICSを含む吸入治療",
        "気管支拡張薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "breathing",
          "breathing",
          "general"
        ],
        "検査値UP": [
          "hematology",
          "blood-gas"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "respiratory-drug",
          "respiratory-drug"
        ]
      },
      "href": "asthma/",
      "system": "respiratory"
    },
    {
      "疾患名": "気胸",
      "領域": [
        "呼吸器"
      ],
      "主な症状": [
        "突然の胸痛",
        "呼吸困難",
        "循環悪化"
      ],
      "検査値UP": [],
      "検査値DOWN": [
        "PaO₂"
      ],
      "関連薬剤": [
        "鎮痛薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "breathing",
          "circulation"
        ],
        "検査値UP": [],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "analgesic"
        ]
      },
      "href": "pneumothorax/",
      "system": "respiratory"
    },
    {
      "疾患名": "肺気腫",
      "領域": [
        "呼吸器"
      ],
      "主な症状": [
        "労作時息切れ",
        "体重減少",
        "増悪"
      ],
      "検査値UP": [
        "PaCO₂"
      ],
      "検査値DOWN": [
        "PaO₂"
      ],
      "関連薬剤": [
        "吸入気管支拡張薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "digestive",
          "general"
        ],
        "検査値UP": [
          "blood-gas"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "respiratory-drug"
        ]
      },
      "href": "emphysema/",
      "system": "respiratory"
    },
    {
      "疾患名": "肺水腫",
      "領域": [
        "呼吸器",
        "循環器"
      ],
      "主な症状": [
        "急な息苦しさ",
        "湿性ラ音",
        "痰",
        "循環の変化"
      ],
      "検査値UP": [
        "BNP"
      ],
      "検査値DOWN": [
        "PaO₂"
      ],
      "関連薬剤": [
        "利尿薬",
        "血管拡張薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "breathing",
          "breathing",
          "circulation"
        ],
        "検査値UP": [
          "cardiac-lab"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "fluid-drug",
          "cardiovascular-drug"
        ]
      },
      "href": "pulmonary-edema/",
      "system": "respiratory"
    },
    {
      "疾患名": "肺炎",
      "領域": [
        "呼吸器"
      ],
      "主な症状": [
        "咳",
        "痰",
        "発熱",
        "倦怠感",
        "息切れ"
      ],
      "検査値UP": [
        "CRP",
        "WBC"
      ],
      "検査値DOWN": [
        "PaO₂"
      ],
      "関連薬剤": [
        "抗菌薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "breathing",
          "infection",
          "infection",
          "breathing"
        ],
        "検査値UP": [
          "inflammation",
          "inflammation"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "anti-infective"
        ]
      },
      "href": "pneumonia/",
      "system": "respiratory"
    },
    {
      "疾患名": "肺血栓塞栓症（PTE/PE）",
      "領域": [
        "呼吸器"
      ],
      "主な症状": [
        "急な息切れ",
        "胸痛",
        "失神",
        "脚の腫れ"
      ],
      "検査値UP": [
        "Dダイマー",
        "トロポニン"
      ],
      "検査値DOWN": [
        "PaO₂"
      ],
      "関連薬剤": [
        "抗凝固薬",
        "血栓溶解薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "pain",
          "circulation",
          "skin"
        ],
        "検査値UP": [
          "coagulation",
          "cardiac-lab"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "antithrombotic",
          "antithrombotic"
        ]
      },
      "href": "pulmonary-embolism/",
      "system": "respiratory"
    },
    {
      "疾患名": "肺高血圧症",
      "領域": [
        "呼吸器",
        "循環器"
      ],
      "主な症状": [
        "労作時息切れ",
        "失神",
        "胸痛",
        "浮腫"
      ],
      "検査値UP": [
        "BNP",
        "NT-proBNP"
      ],
      "検査値DOWN": [
        "PaO₂"
      ],
      "関連薬剤": [
        "肺血管拡張薬",
        "利尿薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "circulation",
          "pain",
          "circulation"
        ],
        "検査値UP": [
          "cardiac-lab",
          "cardiac-lab"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "cardiovascular-drug",
          "fluid-drug"
        ]
      },
      "href": "pulmonary-hypertension/",
      "system": "respiratory"
    },
    {
      "疾患名": "高二酸化炭素血症",
      "領域": [
        "呼吸器"
      ],
      "主な症状": [
        "頭痛",
        "眠気",
        "呼吸疲労"
      ],
      "検査値UP": [
        "PaCO₂",
        "HCO₃⁻"
      ],
      "検査値DOWN": [
        "pH"
      ],
      "関連薬剤": [
        "気管支拡張薬"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "neurologic",
          "breathing"
        ],
        "検査値UP": [
          "blood-gas",
          "blood-gas"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "respiratory-drug"
        ]
      },
      "href": "hypercapnia/",
      "system": "respiratory"
    },
    {
      "疾患名": "ADHF（急性非代償性心不全）",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "急な息切れ",
        "うっ血",
        "低灌流"
      ],
      "検査値UP": [
        "BNP",
        "Cr"
      ],
      "検査値DOWN": [
        "PaO₂",
        "Na"
      ],
      "関連薬剤": [
        "ループ利尿薬",
        "血管拡張薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "general",
          "circulation"
        ],
        "検査値UP": [
          "cardiac-lab",
          "renal-lab"
        ],
        "検査値DOWN": [
          "blood-gas",
          "electrolyte"
        ],
        "関連薬剤": [
          "fluid-drug",
          "cardiovascular-drug"
        ]
      },
      "href": "adhf/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "SSS（洞不全症候群）",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "めまい",
        "失神",
        "疲労",
        "頻脈との交代"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "アトロピン"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "circulation",
          "general",
          "circulation"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "cardiovascular-drug"
        ]
      },
      "href": "sick-sinus/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "不整脈／心房細動",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "動悸",
        "息切れ",
        "塞栓",
        "出血"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "抗凝固薬",
        "心拍数",
        "リズム調節薬"
      ],
      "_categories": {
        "主な症状": [
          "circulation",
          "breathing",
          "general",
          "hematology"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "antithrombotic",
          "cardiovascular-drug",
          "cardiovascular-drug"
        ]
      },
      "href": "atrial-fibrillation/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "大動脈解離",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "突然の胸背部痛",
        "血流障害",
        "循環変化"
      ],
      "検査値UP": [
        "Dダイマー"
      ],
      "検査値DOWN": [
        "Hb"
      ],
      "関連薬剤": [
        "β遮断薬などの降圧薬",
        "鎮痛薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "general",
          "circulation"
        ],
        "検査値UP": [
          "coagulation"
        ],
        "検査値DOWN": [
          "hematology"
        ],
        "関連薬剤": [
          "cardiovascular-drug",
          "analgesic"
        ]
      },
      "href": "aortic-dissection/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "弁膜症",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "息切れ",
        "動悸",
        "失神",
        "浮腫"
      ],
      "検査値UP": [
        "BNP"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "利尿薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "circulation",
          "circulation",
          "circulation"
        ],
        "検査値UP": [
          "cardiac-lab"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "fluid-drug"
        ]
      },
      "href": "valvular-disease/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "心タンポナーデ/心膜液貯留",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "息切れ",
        "循環不良",
        "静脈うっ血"
      ],
      "検査値UP": [
        "乳酸"
      ],
      "検査値DOWN": [],
      "関連薬剤": [],
      "_categories": {
        "主な症状": [
          "breathing",
          "circulation",
          "circulation"
        ],
        "検査値UP": [
          "general-lab"
        ],
        "検査値DOWN": [],
        "関連薬剤": []
      },
      "href": "tamponade/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "心不全",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "息切れ",
        "起座呼吸",
        "むくみ",
        "低灌流"
      ],
      "検査値UP": [
        "BNP",
        "NT-proBNP"
      ],
      "検査値DOWN": [
        "Na"
      ],
      "関連薬剤": [
        "利尿薬",
        "ARNI等",
        "β遮断薬",
        "MRA",
        "SGLT2阻害薬"
      ],
      "_categories": {
        "主な症状": [
          "breathing",
          "breathing",
          "circulation",
          "circulation"
        ],
        "検査値UP": [
          "cardiac-lab",
          "cardiac-lab"
        ],
        "検査値DOWN": [
          "electrolyte"
        ],
        "関連薬剤": [
          "fluid-drug",
          "cardiovascular-drug",
          "cardiovascular-drug",
          "cardiovascular-drug",
          "metabolic-drug"
        ]
      },
      "href": "heart-failure/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "心筋梗塞",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "胸部不快",
        "冷汗",
        "息切れ",
        "血圧低下",
        "不整脈"
      ],
      "検査値UP": [
        "心筋トロポニン",
        "CK"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "抗血小板薬",
        "抗凝固薬",
        "スタチン"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "circulation",
          "breathing",
          "circulation",
          "circulation"
        ],
        "検査値UP": [
          "cardiac-lab",
          "enzyme-lab"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "antithrombotic",
          "antithrombotic",
          "cardiovascular-drug"
        ]
      },
      "href": "myocardial-infarction/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "閉塞性動脈硬化症（ASO）",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "歩行時痛",
        "冷感",
        "色調変化",
        "安静時痛",
        "創"
      ],
      "検査値UP": [
        "LDL"
      ],
      "検査値DOWN": [
        "ABI"
      ],
      "関連薬剤": [
        "抗血小板薬",
        "スタチン"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "circulation",
          "skin",
          "pain",
          "skin"
        ],
        "検査値UP": [
          "lipid-lab"
        ],
        "検査値DOWN": [
          "cardiac-lab"
        ],
        "関連薬剤": [
          "antithrombotic",
          "cardiovascular-drug"
        ]
      },
      "href": "aso/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "静脈血栓塞栓症（VTE）/DVT",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "片脚の腫れ",
        "痛み",
        "熱感",
        "胸痛",
        "息切れ"
      ],
      "検査値UP": [
        "Dダイマー"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "DOAC",
        "ヘパリン"
      ],
      "_categories": {
        "主な症状": [
          "skin",
          "pain",
          "skin",
          "pain",
          "breathing"
        ],
        "検査値UP": [
          "coagulation"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "antithrombotic",
          "antithrombotic"
        ]
      },
      "href": "dvt/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "高血圧症",
      "領域": [
        "循環器"
      ],
      "主な症状": [
        "多くは無症状",
        "立ちくらみ（治療時）",
        "胸痛",
        "神経症状（合併時）"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "Ca拮抗薬",
        "ARB",
        "ACE阻害薬",
        "利尿薬"
      ],
      "_categories": {
        "主な症状": [
          "general",
          "neurologic",
          "pain",
          "neurologic"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "cardiovascular-drug",
          "cardiovascular-drug",
          "cardiovascular-drug",
          "fluid-drug"
        ]
      },
      "href": "hypertension/",
      "system": "cardiovascular"
    },
    {
      "疾患名": "イレウス／腸閉塞",
      "領域": [
        "消化器"
      ],
      "主な症状": [
        "腹痛",
        "膨満",
        "嘔吐",
        "排便",
        "排ガス停止"
      ],
      "検査値UP": [
        "WBC",
        "CRP",
        "乳酸"
      ],
      "検査値DOWN": [
        "Cl",
        "K"
      ],
      "関連薬剤": [
        "電解質補正",
        "鎮痛",
        "制吐薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "general",
          "digestive",
          "digestive",
          "general"
        ],
        "検査値UP": [
          "inflammation",
          "inflammation",
          "general-lab"
        ],
        "検査値DOWN": [
          "electrolyte",
          "electrolyte"
        ],
        "関連薬剤": [
          "fluid-drug",
          "analgesic",
          "general-drug"
        ]
      },
      "href": "ileus-bowel-obstruction/",
      "system": "digestive"
    },
    {
      "疾患名": "ダンピング症候群",
      "領域": [
        "消化器"
      ],
      "主な症状": [
        "食後の腹痛",
        "下痢",
        "動悸",
        "ふらつき",
        "遅れて冷汗",
        "脱力"
      ],
      "検査値UP": [
        "血糖"
      ],
      "検査値DOWN": [
        "血糖"
      ],
      "関連薬剤": [
        "アカルボース",
        "オクトレオチド"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "digestive",
          "circulation",
          "neurologic",
          "circulation",
          "mobility"
        ],
        "検査値UP": [
          "glucose-lab"
        ],
        "検査値DOWN": [
          "glucose-lab"
        ],
        "関連薬剤": [
          "digestive-drug",
          "digestive-drug"
        ]
      },
      "href": "dumping/",
      "system": "digestive"
    },
    {
      "疾患名": "肝不全・肝障害・肝硬変",
      "領域": [
        "消化器"
      ],
      "主な症状": [
        "黄疸",
        "倦怠感",
        "腹水",
        "意識変化",
        "出血"
      ],
      "検査値UP": [
        "AST",
        "ALT",
        "ビリルビン",
        "PT-INR"
      ],
      "検査値DOWN": [
        "Alb"
      ],
      "関連薬剤": [
        "利尿薬",
        "ラクツロース",
        "リファキシミン"
      ],
      "_categories": {
        "主な症状": [
          "digestive",
          "infection",
          "digestive",
          "neurologic",
          "hematology"
        ],
        "検査値UP": [
          "liver-lab",
          "liver-lab",
          "liver-lab",
          "coagulation"
        ],
        "検査値DOWN": [
          "liver-lab"
        ],
        "関連薬剤": [
          "fluid-drug",
          "digestive-drug",
          "anti-infective"
        ]
      },
      "href": "liver-disease/",
      "system": "digestive"
    },
    {
      "疾患名": "膵炎",
      "領域": [
        "消化器"
      ],
      "主な症状": [
        "持続する上腹部痛",
        "循環変化",
        "呼吸悪化"
      ],
      "検査値UP": [
        "リパーゼ",
        "アミラーゼ",
        "CRP"
      ],
      "検査値DOWN": [
        "Ca"
      ],
      "関連薬剤": [
        "鎮痛薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "circulation",
          "breathing"
        ],
        "検査値UP": [
          "pancreatic-lab",
          "pancreatic-lab",
          "inflammation"
        ],
        "検査値DOWN": [
          "electrolyte"
        ],
        "関連薬剤": [
          "analgesic"
        ]
      },
      "href": "pancreatitis/",
      "system": "digestive"
    },
    {
      "疾患名": "CKD（慢性腎臓病）",
      "領域": [
        "腎・泌尿器"
      ],
      "主な症状": [
        "初期は無症状",
        "むくみ",
        "だるさ"
      ],
      "検査値UP": [
        "Cr",
        "K",
        "P"
      ],
      "検査値DOWN": [
        "eGFR",
        "Hb"
      ],
      "関連薬剤": [
        "ACE阻害薬",
        "ARB",
        "SGLT2阻害薬"
      ],
      "_categories": {
        "主な症状": [
          "general",
          "circulation",
          "general"
        ],
        "検査値UP": [
          "renal-lab",
          "electrolyte",
          "electrolyte"
        ],
        "検査値DOWN": [
          "renal-lab",
          "hematology"
        ],
        "関連薬剤": [
          "cardiovascular-drug",
          "cardiovascular-drug",
          "metabolic-drug"
        ]
      },
      "href": "ckd/",
      "system": "renal"
    },
    {
      "疾患名": "ネフローゼ症候群",
      "領域": [
        "腎・泌尿器"
      ],
      "主な症状": [
        "むくみ",
        "泡立つ尿",
        "血栓",
        "感染徴候"
      ],
      "検査値UP": [
        "尿蛋白",
        "LDL"
      ],
      "検査値DOWN": [
        "Alb"
      ],
      "関連薬剤": [
        "利尿薬",
        "ステロイド",
        "免疫抑制薬"
      ],
      "_categories": {
        "主な症状": [
          "circulation",
          "urinary",
          "general",
          "infection"
        ],
        "検査値UP": [
          "renal-lab",
          "lipid-lab"
        ],
        "検査値DOWN": [
          "liver-lab"
        ],
        "関連薬剤": [
          "fluid-drug",
          "immune-drug",
          "immune-drug"
        ]
      },
      "href": "nephrotic/",
      "system": "renal"
    },
    {
      "疾患名": "前立腺肥大症",
      "領域": [
        "腎・泌尿器"
      ],
      "主な症状": [
        "尿勢低下",
        "頻尿",
        "残尿感",
        "尿閉"
      ],
      "検査値UP": [
        "Cr"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "α₁遮断薬",
        "5α還元酵素阻害薬",
        "PDE5阻害薬"
      ],
      "_categories": {
        "主な症状": [
          "urinary",
          "urinary",
          "urinary",
          "urinary"
        ],
        "検査値UP": [
          "renal-lab"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "urologic-drug",
          "urologic-drug",
          "pde5-drug"
        ]
      },
      "href": "bph/",
      "system": "renal"
    },
    {
      "疾患名": "尿路感染症",
      "領域": [
        "腎・泌尿器"
      ],
      "主な症状": [
        "排尿痛",
        "尿の変化",
        "発熱",
        "腰痛"
      ],
      "検査値UP": [
        "尿中白血球",
        "CRP"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "抗菌薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "urinary",
          "infection",
          "pain"
        ],
        "検査値UP": [
          "renal-lab",
          "inflammation"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "anti-infective"
        ]
      },
      "href": "uti/",
      "system": "renal"
    },
    {
      "疾患名": "急性腎障害（AKI）",
      "領域": [
        "腎・泌尿器"
      ],
      "主な症状": [
        "尿量変化",
        "むくみ",
        "息切れ",
        "だるさ",
        "動悸"
      ],
      "検査値UP": [
        "Cr",
        "K",
        "BUN"
      ],
      "検査値DOWN": [
        "HCO₃⁻"
      ],
      "関連薬剤": [
        "高K血症治療薬"
      ],
      "_categories": {
        "主な症状": [
          "urinary",
          "circulation",
          "breathing",
          "general",
          "circulation"
        ],
        "検査値UP": [
          "renal-lab",
          "electrolyte",
          "renal-lab"
        ],
        "検査値DOWN": [
          "blood-gas"
        ],
        "関連薬剤": [
          "fluid-drug"
        ]
      },
      "href": "aki/",
      "system": "renal"
    },
    {
      "疾患名": "慢性腎不全",
      "領域": [
        "腎・泌尿器"
      ],
      "主な症状": [
        "食欲低下",
        "倦怠感",
        "むくみ",
        "息切れ",
        "動悸",
        "脱力"
      ],
      "検査値UP": [
        "Cr",
        "BUN",
        "K",
        "P"
      ],
      "検査値DOWN": [
        "eGFR",
        "Hb",
        "HCO₃⁻"
      ],
      "関連薬剤": [
        "貧血治療薬",
        "リン吸着薬",
        "利尿薬"
      ],
      "_categories": {
        "主な症状": [
          "digestive",
          "infection",
          "circulation",
          "breathing",
          "circulation",
          "mobility"
        ],
        "検査値UP": [
          "renal-lab",
          "renal-lab",
          "electrolyte",
          "electrolyte"
        ],
        "検査値DOWN": [
          "renal-lab",
          "hematology",
          "blood-gas"
        ],
        "関連薬剤": [
          "general-drug",
          "fluid-drug",
          "fluid-drug"
        ]
      },
      "href": "chronic-renal-failure/",
      "system": "renal"
    },
    {
      "疾患名": "横紋筋融解症",
      "領域": [
        "腎・泌尿器"
      ],
      "主な症状": [
        "筋痛",
        "脱力",
        "濃い尿",
        "動悸"
      ],
      "検査値UP": [
        "CK",
        "K",
        "Cr"
      ],
      "検査値DOWN": [
        "Ca"
      ],
      "関連薬剤": [
        "高K血症への治療薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "mobility",
          "urinary",
          "circulation"
        ],
        "検査値UP": [
          "enzyme-lab",
          "electrolyte",
          "renal-lab"
        ],
        "検査値DOWN": [
          "electrolyte"
        ],
        "関連薬剤": [
          "fluid-drug"
        ]
      },
      "href": "rhabdomyolysis/",
      "system": "renal"
    },
    {
      "疾患名": "腎盂腎炎",
      "領域": [
        "腎・泌尿器"
      ],
      "主な症状": [
        "発熱",
        "悪寒",
        "側腹部痛",
        "尿の変化"
      ],
      "検査値UP": [
        "CRP",
        "WBC"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "抗菌薬"
      ],
      "_categories": {
        "主な症状": [
          "infection",
          "infection",
          "pain",
          "urinary"
        ],
        "検査値UP": [
          "inflammation",
          "inflammation"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "anti-infective"
        ]
      },
      "href": "pyelonephritis/",
      "system": "renal"
    },
    {
      "疾患名": "HHS（高浸透圧高血糖状態）",
      "領域": [
        "内分泌・代謝",
        "救急"
      ],
      "主な症状": [
        "口渇",
        "多尿",
        "脱水",
        "意識変化"
      ],
      "検査値UP": [
        "血糖",
        "血漿浸透圧",
        "BUN"
      ],
      "検査値DOWN": [
        "K"
      ],
      "関連薬剤": [
        "インスリン",
        "電解質製剤"
      ],
      "_categories": {
        "主な症状": [
          "metabolic",
          "urinary",
          "general",
          "neurologic"
        ],
        "検査値UP": [
          "glucose-lab",
          "osmolality-lab",
          "renal-lab"
        ],
        "検査値DOWN": [
          "electrolyte"
        ],
        "関連薬剤": [
          "metabolic-drug",
          "fluid-drug"
        ]
      },
      "href": "hhs/",
      "system": "endocrine"
    },
    {
      "疾患名": "下垂体機能低下症",
      "領域": [
        "内分泌・代謝"
      ],
      "主な症状": [
        "だるさ",
        "低血圧",
        "寒がり",
        "口渇",
        "多尿"
      ],
      "検査値UP": [
        "Na"
      ],
      "検査値DOWN": [
        "コルチゾール",
        "FT4",
        "Na"
      ],
      "関連薬剤": [
        "ヒドロコルチゾン",
        "レボチロキシン"
      ],
      "_categories": {
        "主な症状": [
          "general",
          "circulation",
          "metabolic",
          "metabolic",
          "urinary"
        ],
        "検査値UP": [
          "electrolyte"
        ],
        "検査値DOWN": [
          "endocrine-lab",
          "endocrine-lab",
          "electrolyte"
        ],
        "関連薬剤": [
          "metabolic-drug",
          "metabolic-drug"
        ]
      },
      "href": "hypopituitarism/",
      "system": "endocrine"
    },
    {
      "疾患名": "糖尿病",
      "領域": [
        "内分泌・代謝"
      ],
      "主な症状": [
        "口渇",
        "多尿",
        "体重変化",
        "足のしびれ"
      ],
      "検査値UP": [
        "血糖",
        "HbA1c"
      ],
      "検査値DOWN": [
        "血糖"
      ],
      "関連薬剤": [
        "インスリン",
        "血糖降下薬"
      ],
      "_categories": {
        "主な症状": [
          "metabolic",
          "urinary",
          "digestive",
          "neurologic"
        ],
        "検査値UP": [
          "glucose-lab",
          "glucose-lab"
        ],
        "検査値DOWN": [
          "glucose-lab"
        ],
        "関連薬剤": [
          "metabolic-drug",
          "metabolic-drug"
        ]
      },
      "href": "diabetes/",
      "system": "endocrine"
    },
    {
      "疾患名": "電解質異常",
      "領域": [
        "内分泌・代謝",
        "腎・泌尿器"
      ],
      "主な症状": [
        "意識",
        "けいれん",
        "動悸",
        "脱力",
        "しびれ",
        "筋痙攣"
      ],
      "検査値UP": [
        "Na",
        "K",
        "Ca",
        "P"
      ],
      "検査値DOWN": [
        "Na",
        "K",
        "Ca",
        "P",
        "Mg"
      ],
      "関連薬剤": [
        "K補充",
        "Ca補充",
        "Mg補充",
        "高張食塩液"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "neurologic",
          "circulation",
          "mobility",
          "neurologic",
          "neurologic"
        ],
        "検査値UP": [
          "electrolyte",
          "electrolyte",
          "electrolyte",
          "electrolyte"
        ],
        "検査値DOWN": [
          "electrolyte",
          "electrolyte",
          "electrolyte",
          "electrolyte",
          "electrolyte"
        ],
        "関連薬剤": [
          "fluid-drug",
          "fluid-drug",
          "fluid-drug",
          "fluid-drug"
        ]
      },
      "href": "electrolytes/",
      "system": "endocrine"
    },
    {
      "疾患名": "SAH（くも膜下出血）",
      "領域": [
        "脳神経"
      ],
      "主な症状": [
        "突然の激しい頭痛",
        "意識変化",
        "麻痺",
        "反応低下"
      ],
      "検査値UP": [],
      "検査値DOWN": [
        "Na"
      ],
      "関連薬剤": [
        "降圧薬",
        "脳血管攣縮対策薬"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "neurologic",
          "neurologic",
          "neurologic"
        ],
        "検査値UP": [],
        "検査値DOWN": [
          "electrolyte"
        ],
        "関連薬剤": [
          "cardiovascular-drug",
          "neurologic-drug"
        ]
      },
      "href": "sah/",
      "system": "neurological"
    },
    {
      "疾患名": "正常圧水頭症/NPH",
      "領域": [
        "脳神経"
      ],
      "主な症状": [
        "歩きにくさ",
        "認知変化",
        "尿意",
        "失禁"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [],
      "_categories": {
        "主な症状": [
          "mobility",
          "neurologic",
          "urinary",
          "urinary"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": []
      },
      "href": "nph/",
      "system": "neurological"
    },
    {
      "疾患名": "硬膜下血腫（慢性/急性）",
      "領域": [
        "脳神経"
      ],
      "主な症状": [
        "頭痛",
        "傾眠",
        "歩行や麻痺の変化",
        "意識低下"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "抗凝固薬の拮抗薬"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "neurologic",
          "neurologic",
          "neurologic"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "hemostatic-drug"
        ]
      },
      "href": "subdural-hematoma/",
      "system": "neurological"
    },
    {
      "疾患名": "脳出血",
      "領域": [
        "脳神経"
      ],
      "主な症状": [
        "麻痺",
        "言語障害",
        "頭痛",
        "嘔吐",
        "増悪"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "降圧薬",
        "抗凝固薬の拮抗薬"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "neurologic",
          "neurologic",
          "digestive",
          "general"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "cardiovascular-drug",
          "hemostatic-drug"
        ]
      },
      "href": "intracerebral-hemorrhage/",
      "system": "neurological"
    },
    {
      "疾患名": "脳梗塞",
      "領域": [
        "脳神経"
      ],
      "主な症状": [
        "片麻痺",
        "顔面左右差",
        "言葉",
        "視覚の異常",
        "嚥下障害"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "血栓溶解薬",
        "抗血小板薬",
        "抗凝固薬"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "general",
          "neurologic",
          "neurologic",
          "digestive"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "antithrombotic",
          "antithrombotic",
          "antithrombotic"
        ]
      },
      "href": "ischemic-stroke/",
      "system": "neurological"
    },
    {
      "疾患名": "脳浮腫/脳ヘルニア",
      "領域": [
        "脳神経"
      ],
      "主な症状": [
        "意識低下",
        "瞳孔変化",
        "呼吸の変化"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "浸透圧療法薬"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "neurologic",
          "breathing"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "neurologic-drug"
        ]
      },
      "href": "cerebral-edema/",
      "system": "neurological"
    },
    {
      "疾患名": "認知症",
      "領域": [
        "精神"
      ],
      "主な症状": [
        "物忘れ",
        "行動の変化",
        "急な悪化"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "ドネペジル",
        "メマンチン"
      ],
      "_categories": {
        "主な症状": [
          "neurologic",
          "neurologic",
          "general"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "neurologic-drug",
          "neurologic-drug"
        ]
      },
      "href": "dementia/",
      "system": "mental"
    },
    {
      "疾患名": "IAD（失禁関連皮膚炎）",
      "領域": [
        "皮膚・熱傷"
      ],
      "主な症状": [
        "発赤",
        "びらん",
        "痛み"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "皮膚保護剤",
        "抗真菌薬"
      ],
      "_categories": {
        "主な症状": [
          "skin",
          "skin",
          "pain"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "skin-drug",
          "anti-infective"
        ]
      },
      "href": "iad/",
      "system": "skin"
    },
    {
      "疾患名": "蜂窩織炎",
      "領域": [
        "皮膚・熱傷"
      ],
      "主な症状": [
        "発赤",
        "腫脹",
        "痛み",
        "発熱"
      ],
      "検査値UP": [
        "CRP",
        "WBC"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "抗菌薬",
        "鎮痛薬"
      ],
      "_categories": {
        "主な症状": [
          "skin",
          "skin",
          "pain",
          "infection"
        ],
        "検査値UP": [
          "inflammation",
          "inflammation"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "anti-infective",
          "analgesic"
        ]
      },
      "href": "cellulitis/",
      "system": "skin"
    },
    {
      "疾患名": "褥瘡/スキンテア",
      "領域": [
        "皮膚・熱傷"
      ],
      "主な症状": [
        "皮膚変化",
        "浸出液",
        "痛み",
        "皮膚の脆弱性"
      ],
      "検査値UP": [
        "CRP",
        "WBC"
      ],
      "検査値DOWN": [],
      "関連薬剤": [
        "皮膚保護剤",
        "抗菌薬"
      ],
      "_categories": {
        "主な症状": [
          "skin",
          "skin",
          "pain",
          "skin"
        ],
        "検査値UP": [
          "inflammation",
          "inflammation"
        ],
        "検査値DOWN": [],
        "関連薬剤": [
          "skin-drug",
          "anti-infective"
        ]
      },
      "href": "pressure-injury/",
      "system": "skin"
    },
    {
      "疾患名": "圧迫骨折",
      "領域": [
        "運動器"
      ],
      "主な症状": [
        "背腰部痛",
        "動作制限",
        "神経症状"
      ],
      "検査値UP": [],
      "検査値DOWN": [],
      "関連薬剤": [
        "鎮痛薬",
        "骨粗鬆症治療薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "mobility",
          "neurologic"
        ],
        "検査値UP": [],
        "検査値DOWN": [],
        "関連薬剤": [
          "analgesic",
          "metabolic-drug"
        ]
      },
      "href": "vertebral-fracture/",
      "system": "orthopedic"
    },
    {
      "疾患名": "大腿骨頸部骨折",
      "領域": [
        "運動器"
      ],
      "主な症状": [
        "鼠径部痛",
        "動けない",
        "全身影響"
      ],
      "検査値UP": [],
      "検査値DOWN": [
        "Hb"
      ],
      "関連薬剤": [
        "鎮痛薬",
        "骨粗鬆症治療薬"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "mobility",
          "infection"
        ],
        "検査値UP": [],
        "検査値DOWN": [
          "hematology"
        ],
        "関連薬剤": [
          "analgesic",
          "metabolic-drug"
        ]
      },
      "href": "femoral-neck-fracture/",
      "system": "orthopedic"
    },
    {
      "疾患名": "骨軟化症",
      "領域": [
        "運動器"
      ],
      "主な症状": [
        "骨痛",
        "筋力低下",
        "骨折"
      ],
      "検査値UP": [
        "ALP"
      ],
      "検査値DOWN": [
        "P",
        "Ca",
        "25(OH)D"
      ],
      "関連薬剤": [
        "ビタミンD",
        "Ca補充",
        "リン製剤"
      ],
      "_categories": {
        "主な症状": [
          "pain",
          "mobility",
          "general"
        ],
        "検査値UP": [
          "enzyme-lab"
        ],
        "検査値DOWN": [
          "electrolyte",
          "electrolyte",
          "nutrient-lab"
        ],
        "関連薬剤": [
          "metabolic-drug",
          "fluid-drug",
          "metabolic-drug"
        ]
      },
      "href": "osteomalacia/",
      "system": "orthopedic"
    }
  ]
};

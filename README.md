# 永遠の新人看護師備忘録

Notionの実データを使わずに作成している、静的Webサイトのプロトタイプです。現時点では、看護学習ノート、日常医療英語、活動記録、制作物、プロフィール・お問い合わせを整理するための土台です。

## 現在のサイト構成

```text
トップ
├ 看護学習ノート
│ ├ 観察
│ ├ 検査値 DB
│ ├ 看護技術 DB
│ ├ 疾患・病態 DB
│ ├ 薬剤 DB
│ ├ 検査・治療
│ ├ 感染対策
│ └ 急変対応
├ 日常医療英語
├ 活動記録
├ 制作物
└ プロフィール・お問い合わせ
```

## ファイル構成

```text
.
├── index.html
├── pages/
│   ├── nursing.html
│   ├── assessment.html
│   ├── labs.html
│   ├── skills.html
│   ├── diseases.html
│   ├── medications.html
│   ├── tests-treatments.html
│   ├── infection.html
│   ├── emergency.html
│   ├── medical-english.html
│   ├── activity.html
│   ├── works.html
│   └── profile.html
├── data/
│   ├── lab-values.csv
│   ├── skills.js
│   ├── diseases.js
│   └── medications/
│       ├── manifest.js
│       ├── injections-infusions.csv
│       ├── emergency-cart.csv
│       ├── inhalants.csv
│       ├── suppositories-enemas.csv
│       ├── eye-drops.csv
│       ├── patches.csv
│       └── ointments.csv
└── assets/
    ├── css/styles.css
    └── js/
        ├── main.js
        ├── labs-database.js
        ├── medications-database.js
        └── database.js
```

## 各ページの役割

- `index.html`: トップ。正式構成への入口をまとめるノート型ダッシュボード。
- `pages/nursing.html`: 看護学習ノートのカテゴリ一覧。
- `pages/assessment.html`: 観察。現在は準備中ページ。
- `pages/tests-treatments.html`: 検査・治療。現在は準備中ページ。
- `pages/infection.html`: 感染対策。現在は準備中ページ。
- `pages/emergency.html`: 急変対応。現在は準備中ページ。
- `pages/medical-english.html`: 日常医療英語。現在は準備中ページ。
- `pages/activity.html`: 活動記録。現在は準備中ページ。
- `pages/works.html`: 制作物。現在は準備中ページ。
- `pages/profile.html`: プロフィール・お問い合わせ。プロフィール、活動リンク、お問い合わせ、注意書きの仮セクションを配置。

## DBありページ

- `pages/labs.html`: 検査値 DB。データは `data/lab-values.csv`。表表示、検索、採血方法フィルタ、並び替え、詳細モーダルに対応。
- `pages/skills.html`: 看護技術 DB。データは `data/skills.js`。
- `pages/diseases.html`: 疾患・病態 DB。データは `data/diseases.js`。
- `pages/medications.html`: 薬剤 DB。データは `data/medications/` 内の剤形カテゴリ別CSV。検索、薬効分類フィルタ、並び替え、詳細モーダルに対応。

各DBページは、必要なデータファイルだけを読み込みます。すべてのページで全データを読み込まない構造です。

## DBなし準備中ページ

- 観察
- 検査・治療
- 感染対策
- 急変対応
- 日常医療英語
- 活動記録
- 制作物

## データファイルの編集方法

検査値DBは `data/lab-values.csv` を編集します。CSVの列は `項目`, `略称`, `採血方法`, `上昇要因`, `低下要因`, `Full name`, `説明` です。表には `項目`, `略称`, `採血方法`, `上昇要因`, `低下要因` を表示し、詳細モーダルには `Full name`, `説明` を表示します。

薬剤DBは `data/medications/` 内の剤形カテゴリ別CSVを編集します。CSVの列は `薬剤一般名`, `薬剤商品名`, `効果効能`, `Tmax/hr`, `薬効分類`, `効果発現時間`, `注意点` です。表には `薬剤一般名`, `薬剤商品名`, `効果効能`, `Tmax/hr` を表示し、詳細モーダルには `薬効分類`, `効果発現時間`, `注意点` を表示します。

看護技術、疾患・病態DBに項目を追加する場合は、`data/` 内の該当 `.js` ファイルにオブジェクトを追加します。

検査値DBの表描画、検索、採血方法フィルタ、並び替え、詳細モーダルは `assets/js/labs-database.js` にまとめています。薬剤DBの表描画、検索、薬効分類フィルタ、並び替え、詳細モーダルは `assets/js/medications-database.js` にまとめています。その他DBの表描画や検索処理は `assets/js/database.js` にまとめています。

## 注意事項

- 検査値DBは、指定された `_all.csv` をもとに、ホームページ用の列構成へ整理した `data/lab-values.csv` を使用しています。
- 職場固有の手順、個人情報、患者情報、病院名、部署名、電子カルテ操作などは掲載しません。

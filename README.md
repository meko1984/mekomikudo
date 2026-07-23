# 永遠の新人看護師備忘録

看護学習ノート、日常医療英語、活動記録、制作物を整理する静的Webサイトです。
HTML・CSS・JavaScriptだけで構成しており、ビルドやパッケージのインストールは不要です。

## Windowsでの開発

### 初回だけ行うこと

1. このフォルダをVisual Studio Codeで開きます。
2. 推奨拡張機能として表示される **Live Server** をインストールします。
3. `index.html` を開き、画面右下の **Go Live** を押します。

通常は `http://127.0.0.1:5500/` でサイトが開きます。

> 薬剤DBはCSVを `fetch()` で読み込むため、HTMLファイルを直接ダブルクリックして開くのではなく、Live Server経由で確認してください。検査値ページはCSVからHTMLを事前生成するため、直接開いた場合も一覧を確認できます。

## 構成

```text
.
├─ index.html                 トップページ（/）
├─ nursing/                   看護学習ノート（/nursing/）
│  ├─ index.html
│  ├─ assessment/             観察
│  ├─ labs/                   検査値DB
│  ├─ skills/                 看護技術DB
│  ├─ diseases/               疾患・病態DB
│  ├─ medications/            薬剤DB
│  ├─ tests-treatments/       検査・治療
│  ├─ infection/              感染対策
│  └─ emergency/              急変対応
├─ medical-english/           日常医療英語
├─ activity/                  活動記録
├─ works/                     制作物
├─ about/                     プロフィール・お問い合わせ
├─ assets/
│  ├─ css/styles.css          共通スタイル
│  └─ js/                     共通処理・DB表示処理
├─ data/
│  ├─ lab-values.csv          検査値データ
│  ├─ skills.js               看護技術データ
│  ├─ diseases.js             疾患・病態データ
│  └─ medications/            薬剤カテゴリ別CSV
├─ .vscode/                   Windows/VS Code用設定
├─ .editorconfig              文字コード・改行・インデント設定
├─ .gitattributes             Gitの改行ルール
└─ .gitignore                 管理対象外ファイル
```

## URLとファイル名のルール

- 公開ページは `カテゴリ名/index.html` とし、URL末尾を `/` に統一します。
- ディレクトリ名は英小文字・数字・ハイフンのみを使用します。
- 公開後のURLは原則変更しません。変更時は旧URLからリダイレクトします。
- 内部リンクは相対URLを使い、GitHub PagesのプロジェクトURLと独自ドメインの両方に対応します。
- 未実装機能の空ディレクトリや空ページは作りません。

例：`nursing/labs/index.html` は、公開時に `/nursing/labs/` というURLになります。

独自ドメイン、canonical URL、サイトマップは公開先が決まった段階で設定します。

## データの編集

### 検査値DB

`data/lab-values.csv` をUTF-8で編集します。

列は次の13項目です。

```text
項目,略称,分類,参考基準値,単位,基準値出典,上昇要因,低下要因,Full name,説明,解説出典,解説出典URL,看護ポイント
```

項目を追加・修正した後は、次のコマンドで検査値ページのHTMLを更新します。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Update-LabsPage.ps1
```

CSVが元データです。生成範囲である `LABS_STATIC_START` から `LABS_STATIC_END` の間は直接編集しません。プロジェクト検証では、CSVとHTMLが一致しているかも自動確認します。

### 薬剤DB

`data/medications/` 内のカテゴリ別CSVをUTF-8で編集します。

```text
薬剤一般名,薬剤商品名,効果効能,Tmax/hr,薬効分類,効果発現時間,注意点
```

カテゴリを追加するときは、CSVを作成したうえで `data/medications/manifest.js` に読み込み設定を追加します。

### 看護技術・疾患DB

- 看護技術：`data/skills.js`
- 疾患・病態：`data/diseases.js`

既存のオブジェクトと同じ形式で `rows` に項目を追加します。

## 編集時のルール

- ファイルはUTF-8で保存します。
- HTML/CSS/JavaScriptはLF改行、PowerShellはCRLF改行を使用します。
- 患者情報、個人情報、勤務先固有の手順は保存しません。
- 医療情報は学習用メモとして扱い、公開前に出典・更新日・内容を確認します。
- 薬剤の投与判断などには使用せず、添付文書・院内基準・専門職の確認を優先します。

## 現在の実装状況

- 検査値DB：CSVからの静的HTML生成、検索、項目名・略称・分類フィルター、並び替え、詳細表示
- 薬剤DB：カテゴリ別CSV読込、検索、効果効能フィルター、並び替え、詳細表示
- 看護技術DB：一覧、検索
- 疾患・病態DB：一覧、検索
- 観察、検査・治療、感染対策、急変対応、医療英語、活動記録、制作物：準備中

## Git

このWindows環境を起点とする新しいGitリポジトリです。

```powershell
git status
git add .
git commit -m "作業内容"
```

変更前後にLive Serverでトップページ、検査値DB、薬剤DBを確認してください。

VS Codeでは `Ctrl+Shift+B` ではなく、コマンドパレットの
`Tasks: Run Test Task` から「プロジェクトを検証」を実行できます。PowerShellから直接実行する場合は次のとおりです。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Test-Project.ps1
```

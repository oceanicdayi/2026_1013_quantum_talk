# 2026_1013_quantum_talk

張慶瑞老師「AI Next：量子天工智慧—量子計算現況及其在氣象領域的應用前景」演講紀錄。

日期：2026-10-13。地點：中央氣象署。演講筆記與教學反思：陳達毅。

## 網站內容

- 完整保留20張原始JPEG現場照片，按時間排序，可篩選、放大、左右切換、原尺寸查看及下載。
- 演講歷史主線、量子計算／通訊／感測、金融資安、量智融合氣象研究。
- 科學、人文與歷史教學反思，以及50分鐘POE／CER教學轉化建議。
- 8個官方學習資源、12週實作計畫與2–3年能力養成框架。
- 高維Hilbert空間維度、相位干涉、Bell態測量的瀏覽器教學模擬。
- 可下載的Python／Qiskit練習與演講文字紀錄。

這是依照片及現場筆記整理的網站，不是逐字稿。講者的發展時間預估與未來展望、編輯補充及教學建議分別標示。研究方案與案例圖不等於已驗證量子優勢。

## GitHub Pages

此專案為無建置步驟的靜態網站。從 `main` 分支的 `/ (root)` 發布：

1. GitHub 專案 → Settings → Pages。
2. Source 選擇 Deploy from a branch。
3. Branch 選擇 main，資料夾選擇 / (root)，按 Save。

也可在目前Pages設定已存在時直接由分支推送觸發發佈。

網站預期網址：`https://oceanicdayi.github.io/2026_1013_quantum_talk/`。是否已上線請以GitHub Pages部署狀態為準。

## 檔案

- `index.html`：正文與章節。
- `assets/style.css`：響應式版面、列印與照片檢視。
- `assets/app.js`：相簿、計畫勾選、教學模擬。
- `assets/data.js`：20張照片、資源與12週計畫。
- `assets/photos/`：原始完整照片。
- `assets/data/photo-integrity.json`：檔案大小及SHA-256。
- `docs/lecture-notes.md`：文字紀錄與全部照片連結。
- `examples/first_quantum_steps.py`：純Python理想模擬及可選Qiskit模式。

## 第一個Python實驗

```bash
python examples/first_quantum_steps.py
```

Qiskit模式先在自己的虛擬環境安裝：

```bash
python -m pip install qiskit
python examples/first_quantum_steps.py --qiskit
```

兩種模式均為本機理想模擬，不會連到QPU，不需要帳號、金鑰或付費。改變seed和shots，觀察測量分布。真實硬體流程以官方文件為準。

## 照片及權利

現場照片為本次對話提供的20張原始檔；未裁切或重壓縮。投影片及照片內容的權利仍屬各自權利人。本專案不將照片或投影片另行宣告為開源授權。

講者投影片聯絡信箱：crchang@phys.ntu.edu.tw。

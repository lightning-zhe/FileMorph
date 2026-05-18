# FileMorph

轻量、快速、优雅的文件格式转换工具。

## 环境要求

- Python 3.10+
- Node.js 18+
- [LibreOffice](https://www.libreoffice.org/download/)（DOCX/PPTX → PDF 需要）

## 本地运行

### 1. 安装依赖

```bash
# 后端
cd backend
pip install -r requirements.txt

# 前端
cd frontend
npm install
```

### 2. 启动

**Windows：** 双击 `start.bat`

**手动启动：**

```bash
# 终端 1 — 后端
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 终端 2 — 前端
cd frontend
npm run dev
```

浏览器打开 **http://localhost:5173**

---

## 支持的转换

| 源格式 | 目标格式 | 引擎 |
|--------|----------|------|
| DOCX | PDF | LibreOffice headless |
| PPTX | PDF | LibreOffice headless |
| PPTX | PNG | LibreOffice → PyMuPDF 渲染 |
| PDF | DOCX | pdf2docx |
| PDF | PNG | PyMuPDF（单页→PNG，多页→ZIP + 独立下载） |

---

## 部署上线

### 项目结构

```
FileMorph/
├── .gitignore
├── README.md
├── start.bat
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt
│   ├── main.py
│   ├── config.py
│   ├── routers/convert.py
│   ├── services/
│   └── utils/
└── frontend/
    ├── .env                  # 本地：VITE_API_BASE=http://localhost:8000
    ├── .env.production       # 上线：VITE_API_BASE=<后端地址>
    └── src/
```

### 第一步：推送到 GitHub

```bash
cd FileMorph
git init
git add -A
git commit -m "FileMorph initial release"
git branch -M main
git remote add origin git@github.com:你的用户名/FileMorph.git
git push -u origin main
```

### 第二步：部署后端（Render Docker）

1. 打开 [render.com](https://render.com) → New → Web Service
2. 连接 GitHub 仓库
3. 配置：

| 设置项 | 值 |
|--------|-----|
| Root Directory | `backend` |
| Environment | **Docker** |
| Port | `8000` |

4. 添加环境变量：

```
ALLOWED_ORIGINS = https://filemorph.vercel.app
```

5. 点击 Deploy，等待构建完成（首次约 5-10 分钟，需下载 LibreOffice）
6. 记下分配的域名，例如 `https://filemorph-api.onrender.com`

### 第三步：部署前端（Vercel）

1. 打开 [vercel.com](https://vercel.com) → New Project
2. 导入同一个 GitHub 仓库
3. 配置：

| 设置项 | 值 |
|--------|-----|
| Framework | Vite |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. 添加环境变量（**必须**）：

```
VITE_API_BASE = https://filemorph-api.onrender.com
```

5. 点击 Deploy
6. 完成后获得前端域名 `https://filemorph.vercel.app`

### 第四步：验证

1. 打开 `https://filemorph.vercel.app`
2. 上传 DOCX → 转换 → 下载 PDF
3. 上传多页 PDF → 转 PNG → 看到缩略图 + 逐页下载 + ZIP
4. 检查浏览器 DevTools Network 无 CORS 错误

> **注意：** Render 免费层 15 分钟无请求会自动休眠，首次唤醒需 30-60 秒。

### 本地 Docker 运行

```bash
cd backend
docker build -t filemorph-api .
docker run -p 8000:8000 -e ALLOWED_ORIGINS="http://localhost:5173" filemorph-api
```

---

## API

### POST /api/convert

```bash
curl -X POST http://localhost:8000/api/convert \
  -F "file=@document.pdf" \
  -F "target_format=png"
```

### GET /api/download/{filename}

```bash
curl -O http://localhost:8000/api/download/xxx.pptx?name=slides.pptx
```

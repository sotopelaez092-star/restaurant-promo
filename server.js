const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// 确保目录存在
const videosDir = path.join(__dirname, 'src/assets/videos');
const imagesDir = path.join(__dirname, 'src/assets/images');

if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 根据文件类型决定保存目录
    const isVideo = file.mimetype.startsWith('video/');
    const destDir = isVideo ? videosDir : imagesDir;
    cb(null, destDir);
  },
  filename: function (req, file, cb) {
    // 根据上传的类型确定文件名
    const fieldName = file.fieldname; // 'main', 'left', 'right'
    const ext = path.extname(file.originalname);

    let fileName;
    if (fieldName === 'main') {
      fileName = `main-dish${ext}`;
    } else if (fieldName === 'left') {
      fileName = `dish-bottom-left${ext}`;
    } else if (fieldName === 'right') {
      fileName = `dish-bottom-right${ext}`;
    }

    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// 启用CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 静态文件服务
app.use(express.static(__dirname));

// 上传接口
app.post('/api/upload', upload.fields([
  { name: 'main', maxCount: 1 },
  { name: 'left', maxCount: 1 },
  { name: 'right', maxCount: 1 }
]), (req, res) => {
  try {
    const uploadedFiles = {};

    if (req.files.main) {
      uploadedFiles.main = req.files.main[0].filename;
    }
    if (req.files.left) {
      uploadedFiles.left = req.files.left[0].filename;
    }
    if (req.files.right) {
      uploadedFiles.right = req.files.right[0].filename;
    }

    // 更新 RestaurantPromo.tsx 文件中的导入路径
    updateImportPaths(uploadedFiles);

    res.json({
      success: true,
      message: '上传成功！文件已保存并更新。',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('上传错误:', error);
    res.status(500).json({
      success: false,
      message: '上传失败：' + error.message
    });
  }
});

// 更新导入路径的函数
function updateImportPaths(uploadedFiles) {
  const promoFilePath = path.join(__dirname, 'src/compositions/RestaurantPromo.tsx');
  let content = fs.readFileSync(promoFilePath, 'utf8');

  if (uploadedFiles.main) {
    const isVideo = uploadedFiles.main.endsWith('.mp4') || uploadedFiles.main.endsWith('.mov');
    const importPath = isVideo ?
      `import mainDishVideo from '../assets/videos/${uploadedFiles.main}';` :
      `import mainDishVideo from '../assets/images/${uploadedFiles.main}';`;

    content = content.replace(
      /import mainDishVideo from .*/,
      importPath
    );
  }

  if (uploadedFiles.left) {
    const isVideo = uploadedFiles.left.endsWith('.mp4') || uploadedFiles.left.endsWith('.mov');
    const importPath = isVideo ?
      `import dishLeftVideo from '../assets/videos/${uploadedFiles.left}';` :
      `import dishLeftVideo from '../assets/images/${uploadedFiles.left}';`;

    content = content.replace(
      /import dishLeftVideo from .*/,
      importPath
    );
  }

  if (uploadedFiles.right) {
    const isVideo = uploadedFiles.right.endsWith('.mp4') || uploadedFiles.right.endsWith('.mov');
    const importPath = isVideo ?
      `import dishRightVideo from '../assets/videos/${uploadedFiles.right}';` :
      `import dishRightVideo from '../assets/images/${uploadedFiles.right}';`;

    content = content.replace(
      /import dishRightVideo from .*/,
      importPath
    );
  }

  fs.writeFileSync(promoFilePath, content, 'utf8');
}

app.listen(PORT, () => {
  console.log(`\n🚀 上传服务器已启动！`);
  console.log(`📂 访问地址: http://localhost:${PORT}/upload.html`);
  console.log(`\n请在浏览器中打开上面的地址来上传素材。\n`);
});

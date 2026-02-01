const express = require('express');
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS
app.use(cors());
app.use(express.json());

// 配置文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 确保输出目录存在
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 健康检查
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Remotion Render Server is running',
    version: '1.0.0'
  });
});

// 渲染视频API
app.post('/render', upload.fields([
  { name: 'main', maxCount: 1 },
  { name: 'left', maxCount: 1 },
  { name: 'right', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('开始渲染视频...');

    // 更新素材文件
    if (req.files) {
      const assetsDir = path.join(__dirname, 'src/assets');
      const videosDir = path.join(assetsDir, 'videos');
      const imagesDir = path.join(assetsDir, 'images');

      // 确保目录存在
      [videosDir, imagesDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      });

      // 处理上传的文件
      const fileMapping = {
        main: 'main-dish',
        left: 'dish-bottom-left',
        right: 'dish-bottom-right'
      };

      for (const [key, fileName] of Object.entries(fileMapping)) {
        if (req.files[key]) {
          const file = req.files[key][0];
          const ext = path.extname(file.originalname);
          const isVideo = ['.mp4', '.mov'].includes(ext.toLowerCase());
          const targetDir = isVideo ? videosDir : imagesDir;
          const targetPath = path.join(targetDir, fileName + ext);

          // 复制文件
          fs.copyFileSync(file.path, targetPath);
          console.log(`已保存 ${key}: ${targetPath}`);

          // 更新RestaurantPromo.tsx的导入
          updateImports(key, fileName + ext, isVideo);
        }
      }
    }

    // 打包Remotion项目
    console.log('正在打包项目...');
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, 'src/index.tsx'),
      webpackOverride: (config) => config,
    });

    // 获取composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: 'RestaurantPromo',
    });

    // 生成输出文件名
    const outputFileName = `video-${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);

    // 渲染视频
    console.log('正在渲染视频...');
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
      onProgress: ({ progress }) => {
        console.log(`渲染进度: ${Math.round(progress * 100)}%`);
      },
    });

    console.log('渲染完成！');

    // 返回视频URL
    const videoUrl = `/output/${outputFileName}`;
    res.json({
      success: true,
      message: '视频渲染成功',
      videoUrl: videoUrl,
      downloadUrl: `${req.protocol}://${req.get('host')}${videoUrl}`
    });

    // 清理上传的临时文件
    if (req.files) {
      Object.values(req.files).forEach(files => {
        files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    }

  } catch (error) {
    console.error('渲染错误:', error);
    res.status(500).json({
      success: false,
      message: '渲染失败：' + error.message
    });
  }
});

// 提供输出文件访问
app.use('/output', express.static(outputDir));

// 更新导入路径
function updateImports(type, filename, isVideo) {
  const promoFile = path.join(__dirname, 'src/compositions/RestaurantPromo.tsx');
  if (!fs.existsSync(promoFile)) return;

  let content = fs.readFileSync(promoFile, 'utf8');
  const folder = isVideo ? 'videos' : 'images';

  const importMap = {
    main: 'mainDishVideo',
    left: 'dishLeftVideo',
    right: 'dishRightVideo'
  };

  const varName = importMap[type];
  if (!varName) return;

  const newImport = `import ${varName} from '../assets/${folder}/${filename}';`;
  const regex = new RegExp(`import ${varName} from [^;]+;`);

  content = content.replace(regex, newImport);
  fs.writeFileSync(promoFile, content, 'utf8');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 渲染服务器已启动！`);
  console.log(`📡 端口: ${PORT}`);
  console.log(`🌐 访问地址: http://0.0.0.0:${PORT}`);
  console.log(`\n等待渲染请求...\n`);
});

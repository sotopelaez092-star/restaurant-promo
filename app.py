import streamlit as st
import os
import shutil
import subprocess
import re
from pathlib import Path

def update_imports(uploaded_files):
    """更新 RestaurantPromo.tsx 中的素材导入路径"""
    promo_file = Path("src/compositions/RestaurantPromo.tsx")

    if not promo_file.exists():
        return

    content = promo_file.read_text(encoding='utf-8')

    # 更新主圆素材
    if 'main' in uploaded_files:
        _, ext, is_video = uploaded_files['main']
        folder = 'videos' if is_video else 'images'
        new_import = f"import mainDishVideo from '../assets/{folder}/main-dish{ext}';"
        content = re.sub(
            r"import mainDishVideo from [^;]+;",
            new_import,
            content
        )

    # 更新左圆素材
    if 'left' in uploaded_files:
        _, ext, is_video = uploaded_files['left']
        folder = 'videos' if is_video else 'images'
        new_import = f"import dishLeftVideo from '../assets/{folder}/dish-bottom-left{ext}';"
        content = re.sub(
            r"import dishLeftVideo from [^;]+;",
            new_import,
            content
        )

    # 更新右圆素材
    if 'right' in uploaded_files:
        _, ext, is_video = uploaded_files['right']
        folder = 'videos' if is_video else 'images'
        new_import = f"import dishRightVideo from '../assets/{folder}/dish-bottom-right{ext}';"
        content = re.sub(
            r"import dishRightVideo from [^;]+;",
            new_import,
            content
        )

    promo_file.write_text(content, encoding='utf-8')

# 页面配置
st.set_page_config(
    page_title="Restaurant Promo 视频生成器",
    page_icon="🍽️",
    layout="centered"
)

# 自定义CSS
st.markdown("""
<style>
    .main {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .stApp {
        background: transparent;
    }
    .upload-container {
        background: #e8f5e9;
        border-radius: 20px;
        padding: 30px;
        margin: 20px 0;
    }
    h1 {
        color: white;
        text-align: center;
        padding: 20px 0;
    }
    .stButton>button {
        background: #9e9e9e;
        color: white;
        width: 100%;
        padding: 15px;
        font-size: 18px;
        font-weight: 600;
        border-radius: 10px;
        border: none;
        margin-top: 20px;
    }
    .stButton>button:hover {
        background: #757575;
    }
</style>
""", unsafe_allow_html=True)

# 标题
st.markdown("<h1>🍽️ Restaurant Promo 视频生成器</h1>", unsafe_allow_html=True)

# 添加参考案例展示
with st.expander("📸 查看模板效果", expanded=False):
    reference_image = Path("src/assets/reference/template.png")
    if reference_image.exists():
        st.image(str(reference_image), use_container_width=True, caption="三个圆形区域将替换为你上传的素材")

# 创建容器
with st.container():
    st.markdown('<div class="upload-container">', unsafe_allow_html=True)

    st.subheader("上传素材")

    # 文件上传
    col1, col2, col3 = st.columns(3)

    with col1:
        st.markdown("**中部主圆**")
        main_file = st.file_uploader(
            "选择视频或图片",
            type=['mp4', 'mov', 'jpg', 'jpeg', 'png'],
            key="main",
            label_visibility="collapsed"
        )
        if main_file:
            st.success(f"✓ {main_file.name}")

    with col2:
        st.markdown("**底部左圆**")
        left_file = st.file_uploader(
            "选择视频或图片",
            type=['mp4', 'mov', 'jpg', 'jpeg', 'png'],
            key="left",
            label_visibility="collapsed"
        )
        if left_file:
            st.success(f"✓ {left_file.name}")

    with col3:
        st.markdown("**底部右圆**")
        right_file = st.file_uploader(
            "选择视频或图片",
            type=['mp4', 'mov', 'jpg', 'jpeg', 'png'],
            key="right",
            label_visibility="collapsed"
        )
        if right_file:
            st.success(f"✓ {right_file.name}")

    st.markdown('</div>', unsafe_allow_html=True)

# 生成视频按钮
if st.button("🎬 生成视频", use_container_width=True):
    if not (main_file or left_file or right_file):
        st.error("请至少上传一个素材文件")
    else:
        with st.spinner("正在处理上传的文件..."):
            # 保存上传的文件
            assets_dir = Path("src/assets")
            videos_dir = assets_dir / "videos"
            images_dir = assets_dir / "images"

            # 确保目录存在
            videos_dir.mkdir(parents=True, exist_ok=True)
            images_dir.mkdir(parents=True, exist_ok=True)

            uploaded_files = {}

            # 处理主圆文件
            if main_file:
                ext = Path(main_file.name).suffix
                is_video = ext.lower() in ['.mp4', '.mov']
                target_dir = videos_dir if is_video else images_dir
                target_path = target_dir / f"main-dish{ext}"

                with open(target_path, "wb") as f:
                    f.write(main_file.getbuffer())
                uploaded_files['main'] = (str(target_path), ext, is_video)
                st.success(f"✅ 主圆素材已保存")

            # 处理左圆文件
            if left_file:
                ext = Path(left_file.name).suffix
                is_video = ext.lower() in ['.mp4', '.mov']
                target_dir = videos_dir if is_video else images_dir
                target_path = target_dir / f"dish-bottom-left{ext}"

                with open(target_path, "wb") as f:
                    f.write(left_file.getbuffer())
                uploaded_files['left'] = (str(target_path), ext, is_video)
                st.success(f"✅ 左圆素材已保存")

            # 处理右圆文件
            if right_file:
                ext = Path(right_file.name).suffix
                is_video = ext.lower() in ['.mp4', '.mov']
                target_dir = videos_dir if is_video else images_dir
                target_path = target_dir / f"dish-bottom-right{ext}"

                with open(target_path, "wb") as f:
                    f.write(right_file.getbuffer())
                uploaded_files['right'] = (str(target_path), ext, is_video)
                st.success(f"✅ 右圆素材已保存")

            # 更新 RestaurantPromo.tsx 中的 import 路径
            update_imports(uploaded_files)

        with st.spinner("正在生成视频... 这可能需要几分钟"):
            try:
                # 调用 Remotion 渲染视频
                output_path = "out/video.mp4"
                os.makedirs("out", exist_ok=True)

                # 运行 remotion render 命令
                result = subprocess.run(
                    ["npx", "remotion", "render", "RestaurantPromo", output_path],
                    capture_output=True,
                    text=True,
                    timeout=300  # 5分钟超时
                )

                if result.returncode == 0:
                    st.success("🎉 视频生成成功！")

                    # 提供下载按钮
                    if os.path.exists(output_path):
                        with open(output_path, "rb") as f:
                            video_bytes = f.read()

                        st.download_button(
                            label="📥 下载视频",
                            data=video_bytes,
                            file_name="restaurant-promo.mp4",
                            mime="video/mp4",
                            use_container_width=True
                        )

                        # 显示预览
                        st.video(output_path)
                else:
                    st.error(f"视频生成失败：{result.stderr}")

            except subprocess.TimeoutExpired:
                st.error("视频生成超时，请重试")
            except Exception as e:
                st.error(f"发生错误：{str(e)}")

# 使用说明
with st.expander("📖 使用说明"):
    st.markdown("""
    ### 如何使用

    1. **上传素材**：点击对应区域上传视频或图片
       - 中部主圆：视频的主要展示内容
       - 底部左圆/右圆：两侧的装饰内容

    2. **支持格式**：
       - 视频：MP4, MOV
       - 图片：JPG, PNG

    3. **生成视频**：点击"生成视频"按钮，等待渲染完成

    4. **下载**：视频生成后，点击下载按钮保存到本地

    ### 注意事项
    - 至少需要上传一个素材文件
    - 视频生成可能需要几分钟时间
    - 建议使用高质量的素材以获得最佳效果
    """)

# 底部信息
st.markdown("---")
st.markdown(
    "<p style='text-align: center; color: white; font-size: 12px;'>"
    "Powered by Remotion & Streamlit"
    "</p>",
    unsafe_allow_html=True
)

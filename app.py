import streamlit as st
import requests
from pathlib import Path
import time

# Railway渲染服务器地址
RENDER_API_URL = "https://web-production-33dc0.up.railway.app"

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
        try:
            with st.spinner("正在上传素材到云端..."):
                # 准备文件上传
                files = {}
                if main_file:
                    files['main'] = (main_file.name, main_file.getvalue(), main_file.type)
                if left_file:
                    files['left'] = (left_file.name, left_file.getvalue(), left_file.type)
                if right_file:
                    files['right'] = (right_file.name, right_file.getvalue(), right_file.type)

            with st.spinner("🎬 正在云端渲染视频... 预计1-3分钟"):
                # 调用Railway渲染API（禁用代理）
                response = requests.post(
                    f"{RENDER_API_URL}/render",
                    files=files,
                    timeout=300,  # 5分钟超时
                    proxies={'http': None, 'https': None}  # 禁用代理
                )

                if response.status_code == 200:
                    result = response.json()
                    if result.get('success'):
                        st.success("🎉 视频生成成功！")

                        # 获取视频URL
                        video_url = result.get('downloadUrl')

                        if video_url:
                            # 下载视频
                            video_response = requests.get(
                                video_url,
                                proxies={'http': None, 'https': None}
                            )
                            if video_response.status_code == 200:
                                video_bytes = video_response.content

                                # 提供下载按钮
                                st.download_button(
                                    label="📥 下载视频",
                                    data=video_bytes,
                                    file_name="restaurant-promo.mp4",
                                    mime="video/mp4",
                                    use_container_width=True
                                )

                                # 显示预览
                                st.video(video_bytes)
                            else:
                                st.error("视频下载失败")
                        else:
                            st.error("未获取到视频URL")
                    else:
                        st.error(f"渲染失败：{result.get('message', '未知错误')}")
                else:
                    st.error(f"请求失败：HTTP {response.status_code}")
                    st.error(response.text)

        except requests.exceptions.Timeout:
            st.error("⏱️ 渲染超时，请重试或联系支持")
        except requests.exceptions.RequestException as e:
            st.error(f"❌ 网络错误：{str(e)}")
        except Exception as e:
            st.error(f"❌ 发生错误：{str(e)}")

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

    3. **生成视频**：点击"生成视频"按钮
       - 素材会上传到云端
       - 云端服务器渲染视频（1-3分钟）
       - 渲染完成后自动下载

    4. **下载**：视频生成后，点击下载按钮保存到本地

    ### 注意事项
    - 至少需要上传一个素材文件
    - 渲染时间约1-3分钟
    - 建议使用高质量的素材以获得最佳效果
    - 云端渲染，不占用本地资源

    ### 技术支持
    - 渲染服务：Railway Cloud
    - 视频引擎：Remotion
    """)

# 底部信息
st.markdown("---")
st.markdown(
    "<p style='text-align: center; color: white; font-size: 12px;'>"
    "☁️ Powered by Remotion + Railway + Streamlit"
    "</p>",
    unsafe_allow_html=True
)

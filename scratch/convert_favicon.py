import os
from PIL import Image

src_png = r"C:\Users\asus\.gemini\antigravity\brain\40f1a532-b1a8-480d-9cde-4bdf57c96e2f\media__1781108539721.png"
website_dir = r"c:\Users\asus\Desktop\sme_web\website"

favicon_dest = os.path.join(website_dir, "app", "favicon.ico")
apple_dest = os.path.join(website_dir, "public", "apple-touch-icon.png")
favicon_32 = os.path.join(website_dir, "public", "favicon-32x32.png")
favicon_16 = os.path.join(website_dir, "public", "favicon-16x16.png")

print(f"Loading source image: {src_png}")
img = Image.open(src_png)

# Convert to RGBA if not already
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# 1. Save favicon.ico containing 16x16, 32x32, 48x48 sizes
print(f"Saving favicon.ico to: {favicon_dest}")
img.save(favicon_dest, format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])

# 2. Save apple-touch-icon.png (180x180)
print(f"Saving apple-touch-icon.png to: {apple_dest}")
apple_img = img.resize((180, 180), Image.Resampling.LANCZOS)
apple_img.save(apple_dest, format='PNG')

# 3. Save favicon-32x32.png
print(f"Saving favicon-32x32.png to: {favicon_32}")
img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
img_32.save(favicon_32, format='PNG')

# 4. Save favicon-16x16.png
print(f"Saving favicon-16x16.png to: {favicon_16}")
img_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
img_16.save(favicon_16, format='PNG')

print("All icons successfully generated!")

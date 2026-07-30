import re
import json

with open('original_website_html_pages_for_links_assets_context/voximeai.com.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find video URLs
video_urls = set()
# Match src in video/source tags
for match in re.finditer(r'<(?:video|source)[^>]*?src=["\']([^"\']+)["\']', html, re.IGNORECASE):
    video_urls.add(match.group(1))
# Match video URLs in general
for match in re.finditer(r'https?://[^\s"\'<>]+\.(?:mp4|webm|mov|ogg)', html, re.IGNORECASE):
    video_urls.add(match.group(0))

print("Video URLs found:")
for url in sorted(video_urls):
    print(url)

# Find all leadconnectorhq/filesafe image URLs
image_urls = set()
for match in re.finditer(r'https?://[^\s"\'<>]+\.(?:png|jpg|jpeg|gif|webp)', html, re.IGNORECASE):
    image_urls.add(match.group(0))

print("\nImage URLs found:")
for url in sorted(image_urls):
    print(url)

# Find video element IDs and their surrounding source URLs
print("\nVideo element IDs:")
for match in re.finditer(r'<video[^>]*?(id=["\']([^"\']+)["\'])?', html, re.IGNORECASE):
    start = max(0, match.start() - 200)
    end = min(len(html), match.end() + 500)
    snippet = html[start:end]
    if 'src=' in snippet.lower():
        print(f"ID: {match.group(2)}")
        src_match = re.search(r'src=["\']([^"\']+)["\']', snippet)
        if src_match:
            print(f"  src: {src_match.group(1)}")

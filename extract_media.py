import os, re

def extract_urls(content):
    # video URLs
    urls = set()
    for match in re.finditer(r'https?://[^\s"\'<>]+\.mp4', content, re.IGNORECASE):
        urls.add(match.group(0))
    for match in re.finditer(r'https?://[^\s"\'<>]+\.(?:webm|mov|ogg|ogv)', content, re.IGNORECASE):
        urls.add(match.group(0))
    return urls

def extract_image_urls(content):
    urls = set()
    for match in re.finditer(r'https?://[^\s"\'<>]+\.(?:png|jpg|jpeg|gif|webp)', content, re.IGNORECASE):
        urls.add(match.group(0))
    return urls

for root, dirs, files in os.walk('original_website_html_pages_for_links_assets_context'):
    for f in files:
        if f.endswith('.html') or f.endswith('.htm'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
                vids = extract_urls(content)
                imgs = extract_image_urls(content)
                if vids or imgs:
                    print(f"\n=== {path} ===")
                    if vids:
                        print("Videos:")
                        for v in sorted(vids):
                            print("  ", v)
                    if imgs:
                        print("Images:")
                        for i in sorted(imgs):
                            print("  ", i)

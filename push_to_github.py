import os
import base64
import json
import urllib.request
import urllib.error
import urllib.parse
import sys

GITHUB_TOKEN = os.environ.get("GITHUB_PAT")
REPO_OWNER = "nancysun218"
REPO_NAME = "filmpsych"
BRANCH = "main"
BASE_URL = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents"

HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "FilmPsych-Uploader"
}

SKIP_DIRS = {".local", ".git", "__pycache__", "node_modules", ".upm"}
SKIP_FILES = {"push_to_github.py", "main.py", ".replit", "replit.nix"}
BINARY_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico",
    ".pdf", ".woff", ".woff2", ".ttf", ".eot"
}


def get_existing_sha(remote_path):
    encoded = urllib.parse.quote(remote_path, safe="/")
    url = f"{BASE_URL}/{encoded}"
    req = urllib.request.Request(url, headers=HEADERS, method="GET")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            return data.get("sha")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise


def upload_file(local_path, remote_path):
    ext = os.path.splitext(local_path)[1].lower()
    is_binary = ext in BINARY_EXTENSIONS

    with open(local_path, "rb") as f:
        content = base64.b64encode(f.read()).decode("utf-8")

    sha = get_existing_sha(remote_path)

    payload = {
        "message": f"Upload {remote_path}",
        "content": content,
        "branch": BRANCH
    }
    if sha:
        payload["sha"] = sha

    encoded = urllib.parse.quote(remote_path, safe="/")
    url = f"{BASE_URL}/{encoded}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=HEADERS, method="PUT")

    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            action = "Updated" if sha else "Uploaded"
            print(f"  {action}: {remote_path}")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"  ERROR uploading {remote_path}: {e.code} - {body[:200]}")
        return False


def collect_files(root_dir):
    files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for filename in filenames:
            if filename in SKIP_FILES or filename.startswith("."):
                continue
            local_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(local_path, root_dir).replace("\\", "/")
            files.append((local_path, rel_path))
    return files


def main():
    if not GITHUB_TOKEN:
        print("ERROR: GITHUB_PAT environment variable not set.")
        sys.exit(1)

    workspace = "/home/runner/workspace"
    files = collect_files(workspace)
    print(f"Found {len(files)} files to upload to {REPO_OWNER}/{REPO_NAME}\n")

    success = 0
    failed = 0
    for i, (local_path, remote_path) in enumerate(files, 1):
        print(f"[{i}/{len(files)}] {remote_path}")
        ok = upload_file(local_path, remote_path)
        if ok:
            success += 1
        else:
            failed += 1

    print(f"\nDone! {success} uploaded, {failed} failed.")
    if failed > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()

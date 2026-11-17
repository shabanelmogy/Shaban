"""Collect a pinned, licensed documentation snapshot; does not run Odoo or Sphinx."""
from __future__ import annotations

import concurrent.futures
import csv
import hashlib
import json
import posixpath
import re
import time
import urllib.request
from pathlib import Path

COMMIT = "0cc05c25b7614d4d448982fa7d12754ce6462c88"
VERSION = "19.0"
SNAPSHOT = "2026-11-02"
ROOT = Path(__file__).resolve().parent / SNAPSHOT
RAW = f"https://raw.githubusercontent.com/odoo/documentation/{COMMIT}/"
TREE_URL = f"https://api.github.com/repos/odoo/documentation/git/trees/{COMMIT}?recursive=1"
CORE = ("content/applications/sales/rental", "content/applications/hr/fleet")
SUPPORT = (
    "content/applications/essentials/contacts.rst",
    "content/applications/sales/sales/sales_quotations",
    "content/applications/sales/sales/invoicing",
    "content/applications/inventory_and_mrp/inventory/product_management/configure/type.rst",
    "content/applications/inventory_and_mrp/inventory/product_management/product_tracking/serial_numbers.rst",
    "content/applications/inventory_and_mrp/maintenance",
    "content/applications/finance/accounting/customer_invoices",
    "content/applications/finance/accounting/payments",
    "content/applications/finance/accounting/taxes",
    "content/applications/finance/accounting/vendor_bills",
    "content/applications/finance/payment_providers.rst",
    "content/applications/productivity/documents.rst",
    "content/applications/productivity/sign.rst",
    "content/applications/productivity/sign/request_signatures.rst",
    "content/applications/productivity/sign/sign_document.rst",
    "content/applications/productivity/sign/security_authentication.rst",
    "content/applications/productivity/sign/configuration.rst",
    "content/applications/productivity/sign/validity.rst",
)


def download(url: str) -> bytes:
    last = None
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Sigma-Odoo-Documentation-Reference"})
            with urllib.request.urlopen(request, timeout=45) as response:
                return response.read()
        except Exception as exc:
            last = exc
            time.sleep(0.5 * (attempt + 1))
    raise RuntimeError(f"Documentation download failed: {url}: {type(last).__name__}")


def matches(path: str, root: str) -> bool:
    return path == root or path == root + ".rst" or path.startswith(root + "/")


def collect() -> None:
    ROOT.mkdir(parents=True, exist_ok=True)
    tree_bytes = download(TREE_URL)
    tree = json.loads(tree_bytes)
    if tree.get("truncated"):
        raise RuntimeError("GitHub tree is truncated; complete inventory cannot be claimed.")
    blobs = {item["path"]: item for item in tree["tree"] if item["type"] == "blob"}
    selected = {path for path in blobs if path.endswith(".rst")
                and any(matches(path, root) for root in CORE + SUPPORT)}
    for required in [root + ".rst" for root in CORE] + [root for root in SUPPORT if root.endswith(".rst")]:
        if required not in selected:
            raise RuntimeError(f"Required documentation source is absent: {required}")
    selected.update(path for path in blobs if any(path.startswith(root + "/") for root in CORE)
                    and Path(path).suffix.lower() in {".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp", ".pdf"})
    selected.add("LICENSE")
    cache: dict[str, bytes] = {}
    unresolved_assets: list[dict] = []

    def fetch(path: str) -> tuple[str, bytes]:
        target = ROOT / "originals" / path
        data = target.read_bytes() if target.exists() else download(RAW + path)
        sha = hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()
        if sha != blobs[path]["sha"]:
            raise RuntimeError(f"Source identity mismatch: {path}")
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists() and target.read_bytes() != data:
            raise RuntimeError(f"Refusing to overwrite a modified original: {target}")
        target.write_bytes(data)
        return path, data

    pending = set(selected)
    while pending:
        print(f"Collecting {len(pending)} pinned documentation files...", flush=True)
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            for path, data in pool.map(fetch, sorted(pending)):
                cache[path] = data
        dependencies = set()
        for path in sorted(pending):
            if not path.endswith(".rst"):
                continue
            text = cache[path].decode("utf-8")
            for kind, value in re.findall(r"^\s*\.\.\s+(image|figure|include|literalinclude)::\s+([^\s]+)", text, re.MULTILINE):
                if "://" in value or value.startswith("data:"):
                    unresolved_assets.append({"source": path, "reference": value, "reason": "external-resource-not-downloaded"})
                    continue
                resolved = posixpath.normpath("content/" + value.lstrip("/")) if value.startswith("/") else posixpath.normpath(posixpath.join(posixpath.dirname(path), value))
                if not resolved.startswith("content/") or resolved not in blobs:
                    unresolved_assets.append({"source": path, "reference": value, "reason": "not-in-pinned-source-tree"})
                elif kind == "literalinclude" and Path(resolved).suffix.lower() not in {".rst", ".txt", ".csv", ".xml", ".json"}:
                    unresolved_assets.append({"source": path, "reference": value, "reason": "executable-example-not-in-documentation-scope"})
                else:
                    dependencies.add(resolved)
        pending = dependencies - cache.keys()
        selected.update(dependencies)

    rows = []
    for path in sorted(cache):
        data = cache[path]
        kind = "document" if path.endswith(".rst") else "license" if path == "LICENSE" else "asset"
        area = "Rental" if matches(path, CORE[0]) else "Fleet" if matches(path, CORE[1]) else "Supporting"
        title = ""
        if kind == "document":
            source_lines = data.decode("utf-8").splitlines()
            title = next((line.strip() for index, line in enumerate(source_lines[:-1])
                          if line.strip() and not line.startswith(("..", " ", ":"))
                          and re.fullmatch(r"[=\-~^*+#]+", source_lines[index + 1].strip())
                          and not re.fullmatch(r"[=\-~^*+#]+", line.strip())), Path(path).stem)
        url = "https://www.odoo.com/documentation/19.0/" + path[len("content/"):-4] + ".html" if kind == "document" else ""
        rows.append({"area": area, "kind": kind, "title": title, "source_path": path,
                     "local_path": "originals/" + path, "source_url": RAW + path,
                     "published_url": url, "git_blob_sha1": blobs[path]["sha"],
                     "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)})
    manifest = {"collected_on": SNAPSHOT, "version": VERSION, "commit": COMMIT,
                "upstream": "https://github.com/odoo/documentation", "license": "CC-BY-SA-4.0",
                "scope": {"complete_core_roots": list(CORE), "selected_support_roots": list(SUPPORT)},
                "files": rows, "unresolved_assets": unresolved_assets,
                "limits": ["No Odoo execution or Sphinx rendering", "No offline guarantee for uncollected cross-reference targets",
                           "Published website can differ from the pinned commit", "Videos and external resources not downloaded"]}
    (ROOT / "source-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with (ROOT / "SOURCE_CATALOG.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    docs = [row for row in rows if row["kind"] == "document"]
    lines = ["# فهرس المصادر الأصلية", "", "نسخة Odoo 19.0 المثبتة؛ عناوين الصفحات الأصلية بالإنجليزية. الروابط المنشورة قابلة للتحديث؛ النسخ المحلية هي اللقطة المجمدة.", "",
             "| المجموعة | الصفحة الأصلية | النسخة المحلية | الرابط الرسمي |", "|---|---|---|---|"]
    for row in docs:
        title = row["title"].replace("|", "\\|")
        lines.append(f'| {row["area"]} | {title} | [النص الأصلي]({row["local_path"]}) | [التصفح الرسمي]({row["published_url"]}) |')
    (ROOT / "SOURCE_INDEX.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"files": len(rows), "documents": len(docs), "assets": sum(row["kind"] == "asset" for row in rows),
                      "bytes": sum(row["bytes"] for row in rows), "areas": {area: sum(row["kind"] == "document" and row["area"] == area for row in rows)
                           for area in ["Rental", "Fleet", "Supporting"]}, "unresolved_assets": len(unresolved_assets)}, ensure_ascii=False), flush=True)


if __name__ == "__main__":
    collect()

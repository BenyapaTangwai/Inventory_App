from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any
from urllib import error, request

import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

ROOT = Path(__file__).resolve().parent
APP_ROOT = ROOT.parent
OWN_API_URL = 'http://119.59.102.161:3027/api/products?page=1&limit=20'


def _normalize_item(item: dict[str, Any]) -> dict[str, Any] | None:
    name = str(item.get('name') or item.get('product_name') or '').strip()
    price = item.get('price')
    stock = item.get('stock')
    if not name or price is None or stock is None:
        return None
    try:
        return {
            'product_name': name,
            'price': float(price),
            'stock': float(stock),
            'type': item.get('type') or item.get('category_name') or 'unknown',
            'id': item.get('id') or item.get('product_id') or name,
        }
    except (TypeError, ValueError):
        return None


def _read_json_products() -> list[dict[str, Any]]:
    candidates = [APP_ROOT / 'local_store.json', APP_ROOT / 'products.json']
    for candidate in candidates:
        if not candidate.exists():
            continue
        try:
            data = json.loads(candidate.read_text(encoding='utf-8'))
            products = data.get('products') if isinstance(data, dict) else None
            if not isinstance(products, list):
                continue
            normalized: list[dict[str, Any]] = []
            for item in products:
                if isinstance(item, dict):
                    record = _normalize_item(item)
                    if record is not None:
                        normalized.append(record)
            if normalized:
                return normalized
        except Exception:
            continue
    return []


def _read_api_products() -> list[dict[str, Any]]:
    try:
        req = request.Request(OWN_API_URL, headers={'Accept': 'application/json'})
        with request.urlopen(req, timeout=8) as response:
            payload = json.loads(response.read().decode('utf-8'))
    except (error.URLError, ValueError, TimeoutError, OSError):
        return []

    if isinstance(payload, list):
        products = payload
    elif isinstance(payload, dict):
        products = payload.get('data') if isinstance(payload.get('data'), list) else payload.get('products', [])
    else:
        products = []

    normalized: list[dict[str, Any]] = []
    for item in products:
        if isinstance(item, dict):
            record = _normalize_item(item)
            if record is not None:
                normalized.append(record)
    return normalized


def _read_mysql_products() -> list[dict[str, Any]]:
    try:
        import mysql.connector  # type: ignore
    except Exception:
        return []

    config = {
        'host': os.getenv('DB_HOST', '127.0.0.1'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
        'database': os.getenv('DB_NAME', 'ip_std6730202271'),
        'port': int(os.getenv('DB_PORT', '3306')),
        'connect_timeout': 3,
        'autocommit': True,
    }
    try:
        conn = mysql.connector.connect(**config)
        cur = conn.cursor(dictionary=True)
        cur.execute('SELECT id, name, type, price, stock FROM Inventory WHERE price IS NOT NULL AND stock IS NOT NULL LIMIT 100')
        rows = cur.fetchall()
        conn.close()
    except Exception:
        return []

    normalized: list[dict[str, Any]] = []
    for item in rows:
        record = _normalize_item({
            'id': item.get('id'),
            'name': item.get('name'),
            'type': item.get('type'),
            'price': item.get('price'),
            'stock': item.get('stock'),
        })
        if record is not None:
            normalized.append(record)
    return normalized


def load_inventory_rows() -> list[dict[str, Any]]:
    """Use this project's own product API first; fallback to DB/local data if the API is unavailable.

    This keeps the clustering logic inside the K-mean folder while using only the user's inventory records.
    """
    products = _read_api_products()
    if products:
        return products

    products = _read_mysql_products()
    if products:
        return products

    products = _read_json_products()
    if products:
        return products

    raise FileNotFoundError('No valid Inventory product data found in the project API, MySQL, or local JSON store')


def _feature_matrix(products: list[dict[str, Any]]) -> np.ndarray:
    if not products:
        raise ValueError('No inventory products available for clustering')
    matrix = np.asarray([[p['price'], p['stock']] for p in products], dtype=float)
    if not np.isfinite(matrix).all():
        raise ValueError('Inventory features contain invalid numeric values')
    return matrix


def cluster_inventory_products(k: int = 3) -> dict[str, Any]:
    products = load_inventory_rows()
    matrix = _feature_matrix(products)

    if k < 2 or k > len(products):
        k = min(3, max(2, len(products)))

    scaler = StandardScaler()
    scaled = scaler.fit_transform(matrix)
    model = KMeans(n_clusters=k, random_state=42, n_init=10)
    labels = model.fit_predict(scaled)
    centroids = scaler.inverse_transform(model.cluster_centers_)

    clusters = []
    for idx in range(k):
        member_rows = []
        for product, label in zip(products, labels):
            if int(label) == idx:
                member_rows.append({
                    'id': product['id'],
                    'name': product['product_name'],
                    'type': product['type'],
                    'price': product['price'],
                    'stock': product['stock'],
                    'cluster': idx,
                })
        clusters.append({
            'cluster': idx,
            'size': len(member_rows),
            'members': member_rows,
        })

    silhouette = float(silhouette_score(scaled, labels)) if k > 1 and len(products) > k else None

    result = {
        'source': 'Inventory app local data',
        'features': ['price', 'stock'],
        'selected_k': k,
        'silhouette_score': silhouette,
        'clusters': clusters,
        'centroids': [
            {
                'cluster': idx,
                'price': float(centroids[idx][0]),
                'stock': float(centroids[idx][1]),
            }
            for idx in range(len(centroids))
        ],
        'n_products': len(products),
    }
    return result


def main() -> None:
    result = cluster_inventory_products(k=3)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

import unittest

from inventory_kmeans import cluster_inventory_products, load_inventory_rows


class InventoryKMeansTests(unittest.TestCase):
    def test_load_inventory_rows_returns_valid_products(self):
        products = load_inventory_rows()
        self.assertTrue(len(products) > 0)
        self.assertIn('price', products[0])
        self.assertIn('stock', products[0])

    def test_kmeans_clusters_are_generated(self):
        result = cluster_inventory_products(k=2)
        self.assertIn('clusters', result)
        self.assertIn('centroids', result)
        self.assertGreater(len(result['clusters']), 0)


if __name__ == '__main__':
    unittest.main()

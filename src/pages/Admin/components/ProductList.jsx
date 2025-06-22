import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/apis/adminApi';
import ProductForm from './ProductForm';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await adminApi.getProducts();
            setProducts(res.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await adminApi.deleteProduct(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className="font-nunito">
            <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
            <ProductForm
                fetchProducts={fetchProducts}
                editingProduct={editingProduct}
                setEditingProduct={setEditingProduct}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600">{product.description}</p>
                        <p className="text-sm">Price: ${product.price}</p>
                        <p className="text-sm">Stock: {product.stock}</p>
                        <p className="text-sm">Category: {product.category}</p>
                        <div className="mt-4 flex space-x-2">
                            <button
                                onClick={() => setEditingProduct(product)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
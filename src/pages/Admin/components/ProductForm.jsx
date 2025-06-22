import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/apis/adminApi';

function ProductForm({ fetchProducts, editingProduct, setEditingProduct }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: [],
    });

    useEffect(() => {
        if (editingProduct) {
            setForm({
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                category: editingProduct.category,
                stock: editingProduct.stock,
                images: editingProduct.images,
            });
        }
    }, [editingProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await adminApi.updateProduct(editingProduct._id, form);
            } else {
                await adminApi.createProduct(form);
            }
            fetchProducts();
            setForm({ name: '', description: '', price: '', category: '', stock: '', images: [] });
            setEditingProduct(null);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6 font-nunito">
            <h3 className="text-lg font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Images (URLs, comma-separated)</label>
                    <input
                        type="text"
                        name="images"
                        value={form.images.join(',')}
                        onChange={(e) => setForm({ ...form, images: e.target.value.split(',') })}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
            </div>
            <div className="mt-4 flex space-x-2">
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                {editingProduct && (
                    <button
                        type="button"
                        onClick={() => {
                            setForm({ name: '', description: '', price: '', category: '', stock: '', images: [] });
                            setEditingProduct(null);
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default ProductForm;
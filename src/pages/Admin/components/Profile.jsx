import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/apis/adminApi';

function Profile() {
    const [profile, setProfile] = useState({ name: '', shopName: '', description: '' });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await adminApi.getProfile();
            setProfile(res.data.profile);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await adminApi.updateProfile(profile);
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    return (
        <div className="font-nunito">
            <h2 className="text-2xl font-bold mb-4">Manage Profile</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow max-w-lg">
                <div className="mb-4">
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Shop Name</label>
                    <input
                        type="text"
                        name="shopName"
                        value={profile.shopName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={profile.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}

export default Profile;
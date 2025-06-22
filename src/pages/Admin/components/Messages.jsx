import React, { useState, useEffect } from 'react';
import adminApi from '../../../services/apis/adminApi';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiverId, setReceiverId] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await adminApi.getMessages();
            setMessages(res.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            await adminApi.sendMessage({ content: newMessage, receiver: receiverId });
            setNewMessage('');
            setReceiverId('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="font-nunito">
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <form onSubmit={handleSend} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Receiver ID</label>
                        <input
                            type="text"
                            value={receiverId}
                            onChange={(e) => setReceiverId(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            placeholder="Enter customer ID"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Message</label>
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full p-2 border rounded-md"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Send
                    </button>
                </form>
            </div>
            <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg._id} className="bg-white p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-600">
                            {msg.sender === 'self' ? 'You' : `Customer ${msg.sender}`} to{' '}
                            {msg.receiver === 'self' ? 'You' : `Customer ${msg.receiver}`}
                        </p>
                        <p>{msg.content}</p>
                        <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Messages;
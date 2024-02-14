const userSchema = require('../database/schema/users');
const mongoose = require('mongoose');

class User {
    async createUser(user) {
        return await userSchema.create(user); // Use the create() method to save the user
    }

    async getUser(param) {
        return await userSchema.findOne(param);
    }

    async getUserById() {
        // Add implementation for getUserById if needed
    }

    async getUserList() {
        return await userSchema.find({});
    }

    async getUserCartById(userId) {
        try {
            const user = await userSchema.findOne({ _id: new mongoose.Types.ObjectId(userId.trim()) });
            if (!user) {
                throw new Error('User not found');
            }
            return user.carts; // Return the user's carts
        } catch (error) {
            console.error('Error fetching user carts:', error);
            return []; // Return empty array if error occurs
        }
    }

    async updateUserDetails() {
        // Add implementation for updateUserDetails if needed
    }

    async updateCart(userId, newCartValue) {
        try {
            const updatedUser = await userSchema.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(userId.trim()) },
                { carts: newCartValue },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            console.error('Error updating user:', error);
            return null; // Return null or handle the error accordingly
        }
    }

    async updateUserAddress() {
        // Add implementation for updateUserAddress if needed
    }
}

const user = new User();
module.exports = user;

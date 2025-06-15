import UserService from '../services/userService.js';

const userService = new UserService();

export const register = async (req, res) => {
    try {
        const userData = { ...req.body };
        if (req.file) {
            userData.profilePic = req.file.path; // Assuming the file path is stored in req.file.path
        }
        const result = await userService.register(userData);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const result = await userService.login(req.body.email, req.body.password);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });
        const result = await userService.refresh(refreshToken);
        res.json(result);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await userService.getProfile(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.profilePic = req.file.path; // Assuming the file path is stored in req.file.path
        }
        const user = await userService.updateProfile(req.user._id, updateData);;
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const blockUser = async (req, res) => {
    try {
        const user = await userService.blockUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const unblockUser = async (req, res) => {
    try {
        const user = await userService.unblockUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers(req.query);
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
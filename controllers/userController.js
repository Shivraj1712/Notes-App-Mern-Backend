import User from '../models/userModel.js'

// @desc GET user details
// @method GET /api/user
// @access Private 
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @desc Update profile 
// @method PUT /api/profile
// @access Private 
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");
    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
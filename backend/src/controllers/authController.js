import { signupService, loginService } from "../services/authService.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await signupService(name, email, password);

    res.status(201).json({
      message: "Signup successful",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginService(email, password);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import { SessionService } from "../repositories/index.js";

export const togglePremium = async (req, res) => {
  try {
    const { uid } = req.params;
    const findUser = await SessionService.findUserById(uid);
    if (!findUser) {
      return res.status(400).json({ message: "Error: User not found." });
    } else {
      if (findUser.role === "admin") {
        return res
          .status(400)
          .json({ message: "Admin cannot change its role to premium." });
      } else {
        (findUser.role && findUser.role === "user") ? findUser.role = "premium" : findUser.role = "user";
        await findUser.save();
        return res
          .status(200)
          .json({ message: `Role changed to ${findUser.role}` });
      }
    }
  } catch (err) {
    req.logger.error(err);
    return res.status(500).json({
      message: "There was an error toggling user role from/to premium.",
    });
  }
};
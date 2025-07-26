import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

export const hashedPass = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
};

export const generateToken = async (user) => {
  const token = sign(
    { id: user._id, userName: user.userName },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
  return token;
};

export function generateRefreshToken(user) {
  return sign(
    { id: user._id, userName: user.userName },
    process.env.REFRESH_SECRET,
    { expiresIn: "15d" }
  );
}
export const generateAdminToken = async (admin) => {
  const token = sign(
    { id: admin._id, gameNet: admin.gameNet },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
  return token;
};

export function generateRefreshAdminToken(admin) {
  return sign(
    { id: admin._id, gameNet: admin.gameNet},
    process.env.REFRESH_SECRET,
    { expiresIn: "15d" }
  );
}

export async function comparePassword (newPassword , oldPassword) {
  const comparePass = await compare(oldPassword , newPassword)
  return comparePass
}



export function verifyAccessToken(token) {
  return verify(token, process.env.ACCESS_SECRET);
}

export function verifyRefreshToken(token) {
  return verify(token, process.env.REFRESH_SECRET);
}

export const validatePhone = (phone) => {
  const pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g;
  return pattern.test(phone);
};

export const validatePassword = (password) => {
  const pattern =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/g;
  return pattern.test(password);
};

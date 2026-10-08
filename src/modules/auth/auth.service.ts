import { prisma } from '../../config/database';
import { hashPassword, comparePassword } from '../../common/utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/utils/jwt';
import { CustomError } from '../../common/errors/CustomError';

export class AuthService {
  async register(data: any) {
    const { username, password } = data;
    const emailOrPhone = String(data.email).trim();
    const isEmail = emailOrPhone.includes('@');
    const email = isEmail ? emailOrPhone : null;
    const phone = isEmail ? null : emailOrPhone;
    const nameParts = String(data.fullName ?? '').trim().split(/\s+/).filter(Boolean);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new CustomError('Username already taken', 400);
      }
      if (existingUser.email === email) {
        throw new CustomError('Email already registered', 400);
      }
      if (phone && existingUser.phone === phone) {
        throw new CustomError('Phone number already registered', 400);
      }
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        phone,
        firstName: nameParts[0] ?? null,
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : null,
        passwordHash: hashedPassword,
      },
      // Return the same shape as login because the Flutter client stores the
      // access token and maps `data.user` after a successful registration.
    });

    const tokenPayload = { id: user.id, username: user.username };
    const { passwordHash, ...userWithoutPassword } = user;
    return {
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
      user: userWithoutPassword,
    };
  }

  async login(data: any) {
    const { usernameOrEmail, password } = data;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail },
          { email: usernameOrEmail },
          { phone: usernameOrEmail },
        ]
      }
    });

    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new CustomError('Account deactivated', 403);
    }

    if (user.isBlocked) {
      throw new CustomError('Account blocked', 403);
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      throw new CustomError('Invalid credentials', 401);
    }

    const tokenPayload = { id: user.id, username: user.username };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // In a real application, you might want to save the refreshToken in the database to allow revoking

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user || !user.isActive || user.isBlocked) {
        throw new CustomError('Invalid or expired refresh token', 401);
      }

      const tokenPayload = { id: user.id, username: user.username };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      return {
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new CustomError('Invalid or expired refresh token', 401);
    }
  }

  async logout(userId: string) {
    // If refresh tokens are saved in the DB, this is where you would delete/invalidate it.
    return { success: true };
  }
}

export const authService = new AuthService();

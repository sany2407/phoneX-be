import crypto from 'crypto';
import prisma from '../../config/database';
import { hashPassword, comparePassword } from '../../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middleware/error.middleware';
import { RegisterDto, LoginDto, AuthTokens } from './auth.types';

async function generateTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
  const accessToken = signAccessToken({ userId, email, role });
  const refreshToken = signRefreshToken({ userId });

  // Store refresh token in DB (expires in 7 days)
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function register(dto: RegisterDto) {
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await hashPassword(dto.password);

  const user = await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      passwordHash,
      cart: { create: {} },
      wishlist: { create: {} },
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
    },
  });

  const tokens = await generateTokens(user.id, user.email, user.role);
  return { user, ...tokens };
}

export async function login(dto: LoginDto) {
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user || !user.isActive) {
    throw new AppError('Invalid email or password', 401);
  }

  const valid = await comparePassword(dto.password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  const tokens = await generateTokens(user.id, user.email, user.role);
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    ...tokens,
  };
}

export async function refreshToken(token: string) {
  // Verify token signature
  let payload: { userId: string };
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError('Invalid refresh token', 401);
  }

  // Check token exists in DB and not expired
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { token } });
    throw new AppError('Refresh token expired or invalid', 401);
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive', 401);
  }

  // Rotate: delete old, issue new
  await prisma.refreshToken.delete({ where: { token } });
  const tokens = await generateTokens(user.id, user.email, user.role);
  return tokens;
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  // Always return success to avoid user enumeration
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: resetTokenHash,
      resetTokenExp: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  });

  // In production: send email. For now, log the token.
  console.log(`Password reset token for ${email}: ${resetToken}`);
  return resetToken; // Return for testing purposes
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetToken: tokenHash,
      resetTokenExp: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      resetToken: null,
      resetTokenExp: null,
    },
  });

  // Invalidate all refresh tokens
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  if (!user) throw new AppError('User not found', 404);
  return user;
}

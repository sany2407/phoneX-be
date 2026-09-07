import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';

export async function registerController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 201, 'Account created successfully');
  } catch (err) {
    next(err);
  }
}

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 200, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    sendSuccess(res, tokens, 200, 'Tokens refreshed');
  } catch (err) {
    next(err);
  }
}

export async function logoutController(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    sendSuccess(res, null, 200, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
}

export async function forgotPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.forgotPassword(req.body.email);
    sendSuccess(res, null, 200, 'If this email is registered, a reset link has been sent');
  } catch (err) {
    next(err);
  }
}

export async function resetPasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    sendSuccess(res, null, 200, 'Password reset successfully');
  } catch (err) {
    next(err);
  }
}

export async function getMeController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    sendSuccess(res, user, 200);
  } catch (err) {
    next(err);
  }
}

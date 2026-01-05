import * as admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware to validate Firebase ID tokens.
 *
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 * @param {NextFunction} next Next function
 * @return {Promise<void>}
 */
export const validateFirebaseToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send("Unauthorized: No token provided");
        return;
    }

    const idToken = authHeader.split("Bearer ")[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        console.error("Error verifying Firebase ID token:", error);
        res.status(403).send("Forbidden: Invalid token");
    }
};

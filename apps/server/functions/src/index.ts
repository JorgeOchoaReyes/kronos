/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript


import { validateFirebaseToken } from "./middleware/auth";

setGlobalOptions({ maxInstances: 10 });

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const secureHello = onRequest(async (req, res) => {
  await validateFirebaseToken(req, res, () => {
    const user = (req as any).user;
    logger.info("Authenticated request", { uid: user.uid });
    res.send(`Hello ${user.email || user.uid}! You are authenticated.`);
  });
});

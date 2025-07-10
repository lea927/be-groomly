import { Router } from 'express';
import { verifyWebhook } from '@clerk/express/webhooks';
import { UserJSON } from '@clerk/express';
import express from 'express';
import { prisma } from '../libs/prisma';
import logger from '../config/logger';
import { Request, Response } from 'express';

const router = Router();

router.post(
  '/',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    try {
      const evt = await verifyWebhook(req);

      const { id } = evt.data;
      const eventType = evt.type;

      logger.info(
        `Received webhook with ID ${id} and event type of ${eventType}`
      );
      logger.info('Webhook payload:', evt.data);

      switch (eventType) {
        case 'user.created':
          await handleUserCreated(evt.data);
          break;
        default:
          logger.info(`Unhandled webhook event type: ${eventType}`);
      }

      res.status(200).send('Webhook received');
      return;
    } catch (err) {
      logger.error('Error verifying webhook:', err);
      res.status(400).send('Error verifying webhook');
      return;
    }
  }
);

async function handleUserCreated(userData: UserJSON): Promise<UserJSON> {
  try {
    await prisma.user.create({
      data: {
        clerkId: userData.id,
        email: userData.email_addresses[0]?.email_address,
        //TODO: review attributes when User model gets updated based on SLC
        firstName: 'test-first-name',
        lastName: 'test-last-name',
        // Bypass password hash for Clerk users
        passwordHash: 'BYPASS-PASSWORD-HASH',
      },
    });

    return userData;
  } catch (error) {
    logger.error('Error creating user in database:', error);
    throw error;
  }
}

export default router;

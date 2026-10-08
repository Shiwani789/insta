import { Router } from 'express';
import { settingsController } from './settings.controller';
import { authMiddleware } from '../../common/middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/privacy', settingsController.getPrivacy);
router.patch('/privacy', settingsController.updatePrivacy);

router.patch('/interactions', settingsController.updateInteractionSettings);

router.get('/blocked', settingsController.getBlocked);
router.post('/blocked/:userId', settingsController.blockUser);
router.delete('/blocked/:userId', settingsController.unblockUser);

router.post('/muted/:userId', settingsController.muteUser);

router.post('/download-data', settingsController.requestDataExport);
router.post('/account/deactivate', settingsController.deactivateAccount);
router.delete('/account', settingsController.deleteAccount);

export default router;

import { Router } from 'express';
import { mediaController } from './media.controller';
import { authMiddleware } from '../../common/middleware/auth';
import { upload } from '../../common/middleware/upload';

const router = Router();

router.use(authMiddleware);

// Allow uploading up to 10 files at once
router.post('/upload', upload.array('media', 10), mediaController.uploadMedia);

export default router;

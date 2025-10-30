import { createRouter } from '../utils/index.js';
import triesRouter from './tries/index.js';
import userRouter from './users/index.js';

const apiMainRouter = createRouter().basePath('/api/v1');
apiMainRouter.route('/users', userRouter);
apiMainRouter.route('/tries', triesRouter);

export { apiMainRouter };

import express from 'express';
import MessageResponse from '../interfaces/MessageResponse';
import maps from './maps/maps.route';
import wrs from './wrs/wrs.route';
import articles from './articles/articles.route'
import unc from './uncompleted/uncompleted.route'
import bonus from './bonus/bonus.route'
import users from './users/users.route'
import resources from './resources/resources.route'
const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

// routes
router.use('/maps', maps);
router.use('/wrs', wrs);
router.use('/articles', articles)
router.use('/uncompleted', unc);
router.use('/bonus', bonus);
router.use('/users', users);
router.use('/resources', resources);

export default router;

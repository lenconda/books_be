import productionConfig from '../config/config.prod';
import developmentConfig from '../config/config.dev';

export default {
  ...(process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig),
};

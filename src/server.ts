import {config} from './config/configServer';
import {initApp} from './config/express';

const app= initApp(),
  porta: number = config.server.PORT;

app.listen(porta, () => {
  console.log(`Server in ascolto sulla porta ${porta}`);
});
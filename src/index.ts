import * as dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';

dotenv.config();

const PORT = process.env.PORT || 4000;

createServer(function (request: IncomingMessage, response: ServerResponse) {
  response.end('Hello world!');
}).listen(PORT);

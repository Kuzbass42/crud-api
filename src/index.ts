import * as dotenv from 'dotenv';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { isUserIdValid } from './utils';
import { UserController } from './controllers/userController';
import { UserService } from './services/userService';
import { parseURL } from './utils';

dotenv.config();

const port = process.env.PORT || 4000;

const userService = new UserService();
const userController = new UserController(userService);

export const server = createServer(function (request: IncomingMessage, response: ServerResponse) {
  try {
    response.setHeader('Content-Type', 'application/json');

    const { url, method } = request;
    const { id, url: parsedUrl } = parseURL(url);

    if (!parsedUrl
      || (method === 'post' && id)
      || (method === 'put' && !id)
      || (method === 'delete' && !id)
    ) {
      response.writeHead(404);
      return response.end('Resource not found');
    }

    if (id && !isUserIdValid(id)) {
      response.writeHead(400);
      return response.end('UserId is invalid (not uuidv4)');
    }

    switch (method.toLocaleLowerCase()) {
      case 'get': {
        return id
          ? userController.findById(request, response)
          : userController.findAll(request, response);
      }
      case 'post': {
        return userController.create(request, response);
      }
      case 'put': {
        return userController.update(request, response);
      }
      case 'delete': {
        return userController.delete(request, response);
      }
      default: {
        response.writeHead(404);
        return response.end('Resource not found');
      }
    }
  } catch (error) {
    response.writeHead(500);
    return response.end('Internal server error');
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

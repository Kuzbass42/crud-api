import { IncomingMessage, ServerResponse } from 'http';
import { UserService } from '../services/userService';
import { isBodyValid, parseURL } from '../utils';
import { User } from '../models';
export class UserController {
  constructor(private userService: UserService) {}

  public findAll(request: IncomingMessage, response: ServerResponse): ServerResponse {
    const data = this.userService.findAll();

    response.writeHead(200);
    return response.end(JSON.stringify(data));
  }

  public findById(request: IncomingMessage, response: ServerResponse): ServerResponse {
    const { id } = parseURL(request.url);
    const data = this.userService.findById(id);

    if (!data) {
      response.writeHead(404);
      return response.end(`User with id ${id} doesn't exist`);
    }

    this.userService.delete(id);
    response.writeHead(200);
    return response.end(JSON.stringify(data));
  }

  public create(request: IncomingMessage, response: ServerResponse): void {
    const bodyChunks = [];

    request.on('data', (chunk) => {
      bodyChunks.push(chunk);
    });

    request.on('end', () => {
      try {
        const body = JSON.parse(Buffer.concat(bodyChunks).toString()) as User;
        if (!isBodyValid(body, false)) {
          response.writeHead(400);
          return response.end('Invalid body');
        }
        const data = this.userService.create(body);

        response.writeHead(201);
        return response.end(JSON.stringify(data));
      } catch (error) {
        response.writeHead(500);
        return response.end('Internal server error');
      }
    });
  }

  public update(request: IncomingMessage, response: ServerResponse): void {
    const bodyChunks = [];

    request.on('data', (chunk) => {
      bodyChunks.push(chunk);
    });

    request.on('end', () => {
      try {
        const body = JSON.parse(Buffer.concat(bodyChunks).toString()) as User;
        if (!isBodyValid(body)) {
          response.writeHead(400);
          return response.end('Invalid body');
        }

        const { id } = parseURL(request.url);
        if (!this.userService.findById(id)) {
          response.writeHead(404);
          return response.end(`User with id ${id} doesn't exist`);
        }

        const data = this.userService.update(id, body);

        response.writeHead(201);
        return response.end(JSON.stringify(data));
      } catch (error) {
        response.writeHead(500);
        return response.end('Internal server error');
      }
    });
  }

  public delete(request: IncomingMessage, response: ServerResponse): ServerResponse {
    const { id } = parseURL(request.url);

    if (!this.userService.findById(id)) {
      response.writeHead(404);
      return response.end(`User with id ${id} doesn't exist`);
    }

    this.userService.delete(id);
    response.writeHead(204);
    return response.end();
  }
}

import { v4 as guid } from 'uuid';
import { User } from '../models';
export class UserService {
  constructor(private users: User[] = []) {}

  public findAll(): User[] {
    return this.users;
  }

  public findById(id: string): User {
    return this.users.find(user => user.id === id);
  }

  public create(user: User): User {
    const data = {
      ...user,
      id: guid(),
    };

    this.users.push(data);

    return data;
  }

  public update(id: string, user: User): User {
    const data = {
      ...user,
      id,
    };

    let updatedUser = this.users.find(item => item.id === id);
    updatedUser = Object.assign(updatedUser, data);

    return updatedUser;
  }

  public delete(id: string): User {
    const data = this.users.find(user => user.id === id);

    if (data) {
      this.users = this.users.filter(user => user.id !== id);
    }

    return data;
  }
}

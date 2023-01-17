import { validate, version } from 'uuid';
import { URL_REGEXP } from '../constants';
import { ParsedUrl, User } from '../models';

export const isUserIdValid = (id: string): boolean => {
  return validate(id) && version(id) === 4;
};

export const isBodyValid = (user: User, checkUserId = true): boolean => {
  const { id, username, age, hobbies } = user;

  return (!checkUserId || isUserIdValid(id))
    && typeof username === 'string'
    && typeof age === 'number'
    && Array.isArray(hobbies) && !hobbies.some(hobby => typeof hobby !== 'string');
};
export const parseURL = (url: string): ParsedUrl => {
  const matcher = url.match(URL_REGEXP);
  const id = matcher && matcher[1] && matcher[1].slice(1);
  const parsedUrl = matcher && matcher[0];

  return {
    id,
    url: parsedUrl,
  };
};

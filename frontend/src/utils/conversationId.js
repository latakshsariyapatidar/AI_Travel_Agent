import { v4 as uuidv4 } from 'uuid';

export const getConversationId = () => {
  let id = sessionStorage.getItem('convId');
  if (!id) {
    id = `conv_${uuidv4()}`;
    sessionStorage.setItem('convId', id);
  }
  return id;
};

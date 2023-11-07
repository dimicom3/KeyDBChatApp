
export const MESSAGES_TO_LOAD = 15;

const fetchData = async (url, method, data) => {
  const requestConfig = {
    method,
    credentials: 'include', // To include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    requestConfig.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, requestConfig);

    if (!response.ok) {
      throw new Error((await response.json()).message);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getInfo = () => {
  return fetchData('/users/getInfo', 'GET');
};

export const login = (username, password) => {
  return fetchData('/users/login', 'POST', { username, password }).then((x) => x.data);
};

export const logOut = () => {
  return fetchData('/users/logout', 'POST');
};

export const getMessages = (id, offset = 0, size = MESSAGES_TO_LOAD) => {
  return fetchData(`/users/room/${id}/messages?offset=${offset}&size=${size}`, 'GET').then((x) => {console.log(x);if(x) return x.data.reverse()});
};

export const getPreloadedRoom = async () => {
  return fetchData('/users/room/0/preload', 'GET').then((x) => x.data);
};

export const getUsers = (ids) => {
  return fetchData(`/users/idList?ids=${ids.join(',')}`, 'GET').then((x) => x.data);
};

export const getOnlineUsers = () => {
  return fetchData('/users/online', 'GET').then((x) => x.data);
};

export const getAllUsers = () => {
  return fetchData('/users/all', 'GET').then((x) => x.data);
};

export const addRoom = async (user1, user2) => {
  return fetchData('/users/room', 'POST', { user1, user2 }).then((x) => x.data);
};

export const getRooms = async (userId) => {
  return fetchData(`/users/rooms/${userId}`, 'GET').then((x) => x.data);
};

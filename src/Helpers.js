/**
 * Function returns all the items in the given collection
 * @param {string} collection - ex: 'users', 'groups', 'events', 'interests'
 */
export async function getAllItems(collection) {
  const data = await fetch(`${process.env.REACT_APP_API_LINK}/${collection}`);
  return data.json();
}

/**
 * Function returns one item in the collection with the given id
 * @param {string} collection - ex: 'users', 'groups', 'events', 'interests'
 * @param {string} itemId - id of the object to be fetched
 */
export async function getOneItem(collection, itemId) {
  const data = await fetch(`${process.env.REACT_APP_API_LINK}/${collection}/${itemId}`);
  return data.json();
}

/**
 * Function returns all the items in a collection as an object with the ids as the keys
 * @param {string} collection - ex: 'users', 'groups', 'events', 'interests'
 */
export async function getAllItemsAsObject(collection) {
  const obj = {};
  const arr = await getAllItems(collection);
  arr.forEach((item) => {
    obj[item._id] = item;
  });
  return obj;
}

/**
 * Function creates a new item or updates an existing item
 * @param {string} method - 'POST' for create,'PUT' for update
 * @param {string} collection - ex: 'users', 'groups', 'events', 'interests'
 * @param {string} itemId - id of the object to be updated
 * @param {object} bodyData - the data for the object to be created/updated
 */
export async function createUpdateItem(method, collection, itemId, bodyData) {
  const data = await fetch(`${process.env.REACT_APP_API_LINK}/${collection}/${itemId}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  })
    .then((response) => response.json())
    .then((_data) => _data)
    .catch((error) => error);
  return data;
}

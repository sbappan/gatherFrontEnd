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

/**
 * Function returns all the items in the given collection
 * Pass the collection name such as users, groups, events, etc. as an argument
 */
export async function getAllItems(collection) {
  const data = await fetch(`${process.env.REACT_APP_API_LINK}/${collection}`);
  return data.json();
}

/**
 * Function returns one item in the collection
 * Pass the collection name such as users, groups, events, etc.
 * and the id of the object as an argument
 */
export async function getOneItem(collection, itemId) {
  const data = await fetch(`${process.env.REACT_APP_API_LINK}/${collection}/${itemId}`);
  return data.json();
}

/**
 * Function accepts an array as an argument
 * and returns it as an object with the id as the key for each array element
 */
export function transformArrayToObject(arr) {
  const obj = {};
  arr.forEach((item) => {
    obj[item._id] = item;
  });
  return obj;
}

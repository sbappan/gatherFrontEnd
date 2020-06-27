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
 * Function returns an object with nested objects.
 * The input array item id as the key for the nested objects.
 * @param {array} arr - input array to be made into an object
 * @param {string} key - the key to be used for the nested objects
 */
export function convertArrayToObject(arr, key) {
  const obj = {};
  arr.forEach((item) => {
    obj[item[key]] = item;
  });
  return obj;
}

/**
 * Function returns all the items in a collection as an object with the ids as the keys
 * @param {string} collection - ex: 'users', 'groups', 'events', 'interests'
 */
export async function getAllItemsAsObject(collection) {
  const arr = await getAllItems(collection);
  return convertArrayToObject(arr, '_id');
}

/**
 * Function returns either the events where the id is an attendee
 * or the groups where the id is a member
 * @param {string} collection - ex: 'groups', 'events'
 * @param {string} itemId - id of the object to use as condition
 */
export async function getAssociatedItems(collection, itemId) {
  const arr = await getAllItems(collection);
  if (collection === 'events') {
    return arr.filter((event) => event.attendees.includes(itemId));
  } if (collection === 'groups') {
    // Filters for groups that have the user's id as a member
    return arr.filter((group) => group.members.find((member) => member._id === itemId));
  }
  return null;
}

/**
 * Function creates a new item or updates an existing item
 * @param {string} method - 'POST' for create,'PUT' for update
 * @param {string} collection - ex: 'users', 'groups', 'events', 'interests'
 * @param {string} itemId - id of the object to be updated
 * @param {object} bodyData - the data for the object to be created/updated
 */
export async function createOrUpdateItem(method, collection, itemId, bodyData) {
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
 * Function returns the input string argument with the first letter capitalized
 * @param {string} str
 */
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

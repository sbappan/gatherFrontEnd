// eslint-disable-next-line import/prefer-default-export
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

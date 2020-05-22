export class RequestError extends Error {}
export class ServerError extends Error {}
export class UnAuthorizedError extends RequestError {}
export class NotFoundError extends RequestError {}

function makeCommonHeaders(options) {
  return options.headers ?? {};
}

const Net = {
  async get(path, options = {}) {
    return await fetch(path, {
      headers: makeCommonHeaders(options),
    }).then(parseResponseBody(options));
  },
  async post(path, body, options = {}) {
    return await fetch(path, {
      method: 'POST',
      headers: Object.assign(makeCommonHeaders(options), {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    }).then(parseResponseBody(options));
  },
  async patch(path, body, options = {}) {
    return await fetch(path, {
      method: 'PATCH',
      headers: Object.assign(makeCommonHeaders(options), {
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    })
      .then(parseResponseBody(options))
      .catch((err) => {
        throw err;
      });
  },
  async delete(path, options = {}) {
    return await fetch(path, {
      method: 'DELETE',
      headers: makeCommonHeaders(options),
    }).then(parseResponseBody(options));
  },
};

const parseResponseBody = ({ parseBody = true }) => async (response) => {
  switch (response.status) {
    case 401:
      throw new UnAuthorizedError();
    case 404:
      throw new NotFoundError();
    default:
      let firstNum = response.status.toString()[0];
      if (firstNum === '4') {
        throw new RequestError();
      } else if (firstNum === '5') {
        throw new ServerError();
      }
      break;
  }
  if (parseBody) {
    var contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      return await response.json();
    } else {
      return await response.text();
    }
  }
};

export default Net;

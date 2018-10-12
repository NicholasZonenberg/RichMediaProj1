const qs = require('querystring');
// function to send a json object
const respondJSON = (request, response, status, object) => {
  // set status code and content type (application/json)
  response.writeHead(status, { 'Content-Type': 'application/json' });
  // stringify the object (so it doesn't use references/pointers/etc)
  // but is instead a flat string object.
  // Then write it to the response.
  response.write(JSON.stringify(object));
  // Send the response to the client
  response.end();
};

const data = [
  {
    message: 'Success',
    name: 'Joe',
    address: '1 street RD City 00000',
    phoneNumber: '(000) 000-0000',
  },
  {
    message: 'Success',
    name: 'Bob',
    address: '1 road RD Town 11111',
    phoneNumber: '(111) 111-1111',
  },
  {
    message: 'Success',
    name: 'Fred',
    address: '1 Lane RD Hamlet 33333',
    phoneNumber: '(222) 222-2222',
  },
];

const getinfo = (request, response, params) => {
  console.log(params);
  if (!params.index || !(parseInt(params.index, 10) || parseInt(params.index, 10) === 0) ||
  parseInt(params.index, 10) >= data.length || parseInt(params.index, 10) < 0) {
    const responseJSON = {
      message: 'Index is either missing or invalid',
      id: 'badRequest',
    };
    return respondJSON(request, response, 400, responseJSON);
  }
  const responseJSON = data[parseInt(params.index, 10)];
  // send our json with a success status code
  return respondJSON(request, response, 200, responseJSON);
};

const addInfo = (request, response) => {
  let requestBody = '';
  let results;
  request.on('data', (temp) => {
    requestBody += temp;
  });

  request.on('end', () => {
    results = qs.parse(requestBody);
    console.log(results);
    const responseJSON = {
      message: 'Invalid Input',
    };
      // if the request does not contain a valid=true query parameter
    if (results.name && results.address && results.phoneNumber) {
      for (let x = 1; x < data.length; x++) {
        if (data[x].name === results.name) {
          data[x].address = results.address;
          data[x].phoneNumber = results.phoneNumber;
          responseJSON.message = '';
          console.log(data);
          return respondJSON(request, response, 204, responseJSON, 'application/json');
        }
      }
      responseJSON.message = 'Success';
      data.push({ message: 'Success', name: results.name, address: results.address, phoneNumber: results.phoneNumber });
      console.log(data);
      return respondJSON(request, response, 201, responseJSON, 'application/json');
    }
    return respondJSON(request, response, 400, responseJSON, 'application/json');
  });
};

// function to show a success status code
const success = (request, response) => {
  // message to send
  const responseJSON = {
    message: 'This is a successful response',
  };

  // send our json with a success status code
  respondJSON(request, response, 200, responseJSON);
};

// function to show a bad request without the correct parameters
const badRequest = (request, response, params) => {
  // message to send
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    // set our error message
    responseJSON.message = 'Missing valid query parameter set to true';
    // give the error a consistent id
    responseJSON.id = 'badRequest';
    // return our json with a 400 bad request code
    return respondJSON(request, response, 400, responseJSON);
  }

  // if the parameter is here, send json with a success status code
  return respondJSON(request, response, 200, responseJSON);
};

// function to show not found error
const notFound = (request, response) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return our json with a 404 not found error code
  respondJSON(request, response, 404, responseJSON);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  success,
  badRequest,
  notFound,
  getinfo,
  addInfo,
};

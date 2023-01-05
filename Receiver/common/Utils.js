const createErrorObj = (code, message) => {
  const obj = {
    statusCode: code || 404,
    message: message || "An error occur with the API call",
  };
  return obj;
  //   return JSON.parse(obj);
};

const createSuccessObj = (code, data, message) => {
  const obj = {
    statusCode: code || 200,
    message: message || "API call successfully executed",
    data: data || {},
  };
  return obj;
  //   return JSON.parse(obj);
};

module.exports = {
  createErrorObj,
  createSuccessObj,
};

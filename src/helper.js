const successMessage = (responseMessage = null, data = null) => {
  const res = {
    status: 'success',
  };

  if (responseMessage) {
    res.message = responseMessage;
  }

  if (data) {
    res.data = data;
  }

  return res;
};

const failMessage = (responseMessage) => ({
  status: 'fail',
  message: responseMessage,
});

module.exports = {
  successMessage,
  failMessage,
};

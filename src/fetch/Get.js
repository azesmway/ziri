const Get = {}

Get.userLogin = async data => {
  return fetch('http://rgts.site/user/login' + data, {
    method: 'GET'
  })
    .then(response => response.json())
    .catch(error => error.message)
}

export default Get

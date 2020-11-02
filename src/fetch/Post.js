const Post = {}

Post.User_Register = async (data) => {
  return fetch('http://rgts.site/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  })
    .then((response) => response.json())
    .catch((error) => error.message)
}

export default Post

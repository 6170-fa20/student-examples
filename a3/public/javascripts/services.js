// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => preParent.classList.remove('flashing'), 300);
}

// Axios responses have a lot of data. This shows only the most relevant data.
function showResponse(axiosResponse) {
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  const abridgedResponse = {
    data: fullResponse.data,
    status: fullResponse.status,
    statusText: fullResponse.statusText,
  };
  showObject(abridgedResponse);
}

// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE

// EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

/**
 * You can use axios to make API calls like this:
 * const body = { bar: 'baz' };
 * axios.post('/api/foo', body)
 *   .then(showResponse) // on success (Status Code 200)
 *   .catch(showResponse); // on failure (Other Status Code)
 * See https://github.com/axios/axios for more info
 */

// Hint: do not assume a 1:1 mapping between forms and routes

function createUser(fields) {
  if (fields.username !== "" && fields.password !== "") {
    const body = {'username': fields.username, 'password': fields.password};
    axios.post('/api/users/signup', body)
    .then(showResponse)
    .catch(showResponse);
  }
}

function changeUsername(fields) {
  if (fields.username !== "") {
    const body = {'username': fields.username};
    axios.put('/api/users/username', body)
    .then(showResponse)
    .catch(showResponse);
  }
}

function changePassword(fields) {
  if (fields.password !== "") {
    const body = {'password': fields.password};
    axios.put('/api/users/password', body)
    .then(showResponse)
    .catch(showResponse);
  }
}

function deleteUser(fields) {
  axios.delete('/api/users/')
    .then(showResponse)
    .catch(showResponse);
}

function signIn(fields) {
  if (fields.username !== "" && fields.password !== "") {
    const body = {'username': fields.username, 'password': fields.password};
    axios.post('/api/users/login', body)
      .then(showResponse)
      .catch(showResponse);
  }
}

function signOut(fields) {
  axios.delete('/api/users/logout')
    .then(showResponse)
    .catch(showResponse);
}

function viewAllFreets(fields) {
  axios.get('/api/freets/')
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
  if (fields.author !== "") {
    axios.get(`/api/freets/${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
  }
}

function createFreet(fields) {
  if (fields.content !== "") {
    const body = {'content': fields.content};
    axios.post('/api/freets/', body)
    .then(showResponse)
    .catch(showResponse);
  }
}

function editFreet(fields) {
  if (fields.content !== "" && fields.id !== "") {
    const body = {'content': fields.content};
    axios.put(`/api/freets/${fields.id}`, body)
    .then(showResponse)
    .catch(showResponse);
  }
}

function deleteFreet(fields) {
  if (fields.id !== "") {
    axios.delete(`/api/freets/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
  }
}

function viewAllRefreets(fields) {
  axios.get('/api/refreets/')
    .then(showResponse)
    .catch(showResponse);
}

function viewRefreetsByAuthor(fields) {
  if (fields.author !== "") {
    axios.get(`/api/refreets/${fields.author}`)
    .then(showResponse)
    .catch(showResponse);
  }
}

function createRefreet(fields) {
  if (fields.id !== "") {
    const body = {'freetId': fields.id};
    axios.post('/api/refreets/', body)
    .then(showResponse)
    .catch(showResponse);
  }
}

function deleteRefreet(fields) {
  if (fields.id !== "") {
    axios.delete(`/api/refreets/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
  }
}

function follow(fields) {
  if (fields.username !== "") {
    const body = {'username': fields.username};
    axios.post('/api/users/follow/', body)
    .then(showResponse)
    .catch(showResponse);
  }
}

function unfollow(fields) {
  if (fields.username !== "") {
    axios.delete(`/api/users/follow/${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
  }
}

function getFollowing(fields) {
  axios.get('/api/users/follow/following')
  .then(showResponse)
  .catch(showResponse);
}

function upvote(fields) {
  if (fields.id !== "") {
    const body = {'id': fields.id};
    axios.post('/api/freets/upvote/', body)
    .then(showResponse)
    .catch(showResponse);
  }
}

function deleteUpvote(fields) {
  if (fields.id !== "") {
    axios.delete(`/api/freets/upvote/${fields.id}`)
    .then(showResponse)
    .catch(showResponse);
  }
}

function getUpvotedFreets(fields) {
  if (fields.username !== "") {
    axios.get(`/api/freets/upvote/${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
  }
}

// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE BELOW

// map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'view-all-refreets': viewAllRefreets,
  'view-refreets-by-author': viewRefreetsByAuthor,
  'create-refreet': createRefreet,
  'delete-refreet': deleteRefreet,
  'follow': follow,
  'unfollow': unfollow,
  'get-following': getFollowing,
  'upvote': upvote,
  'delete-upvote': deleteUpvote,
  'get-upvoted': getUpvotedFreets
};

// attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {};
      (new FormData(form)).forEach((value, key) => {
        data[key] = value;
      });
      handler(data);
      return false; // don't reload page
    };
  });
}

window.onload = init; // attach handlers once DOM is ready

// Show an object on the screen.
function showObject(obj) {
    const pre = document.getElementById("response");
    const preParent = pre.parentElement;
    pre.innerText = JSON.stringify(obj, null, 4);
    preParent.classList.add("flashing");
    setTimeout(() => preParent.classList.remove("flashing"), 300);
}

// Axios responses have a lot of data. This shows only the most relevant data.
function showResponse(axiosResponse) {
    const fullResponse =
        axiosResponse.response === undefined
            ? axiosResponse
            : axiosResponse.response;
    const abridgedResponse = {
        data: fullResponse.data,
        status: fullResponse.status,
        statusText: fullResponse.statusText
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
    axios
        .post("/api/users", fields)
        .then(showResponse)
        .then(function() {
            const createUserForm = document.getElementById("create-user");
            createUserForm.reset();
        })
        .catch(showResponse);
}

function changeUsername(fields) {
    axios
        .put("/api/users/username", fields)
        .then(showResponse)
        .then(function() {
            const changeUsernameForm = document.getElementById(
                "change-username"
            );
            changeUsernameForm.reset();
        })
        .catch(showResponse);
}

function changePassword(fields) {
    axios
        .put("/api/users/password", fields)
        .then(showResponse)
        .then(function() {
            const changePasswordForm = document.getElementById(
                "change-password"
            );
            changePasswordForm.reset();
        })
        .catch(showResponse);
}

function deleteUser(fields) {
    axios
        .delete("/api/users/auth", fields)
        .then(showResponse)
        .catch(showResponse);
}

function signIn(fields) {
    axios
        .post("/api/users/auth", fields)
        .then(showResponse)
        .then(function() {
            const signInForm = document.getElementById("sign-in");
            signInForm.reset();
        })
        .catch(showResponse);
}

function signOut(fields) {
    axios
        .delete("/api/users/auth", fields)
        .then(showResponse)
        .catch(showResponse);
}

function whoToFollow(fields) {
    axios
        .get("/api/users", fields)
        .then(showResponse)
        .catch(showResponse);
}

function unfollowUser(fields) {
    axios
        .put("/api/users/requests", fields)
        .then(showResponse)
        .then(function() {
            const unfollowForm = document.getElementById("unfollow-user");
            unfollowForm.reset();
        })
        .catch(showResponse);
}

function followUser(fields) {
    axios
        .post("/api/users/requests", fields)
        .then(showResponse)
        .then(function() {
            const followForm = document.getElementById("follow-user");
            followForm.reset();
        })
        .catch(showResponse);
}

function removeFollower(fields) {
    axios
        .put("/api/users/requests", fields)
        .then(showResponse)
        .then(function() {
            const removeFollowerForm = document.getElementById("remove-follower");
            removeFollowerForm.reset();
        })
        .catch(showResponse);
}

function viewFollowerRequests(fields) {
    axios
        .get("/api/users/requests", fields)
        .then(showResponse)
        .catch(showResponse);
}

function confirmPendingRequest(fields) {
    axios
        .post("/api/users/requests", fields)
        .then(showResponse)
        .then(function() {
            const approveForm = document.getElementById("approve-pending-request");
            approveForm.reset();
            const rejectForm = document.getElementById("reject-pending-request");
            rejectForm.reset();
        })
        .catch(showResponse);
}

function viewAllFreets(fields) {
    axios
        .get("/api/freets", fields)
        .then(showResponse)
        .catch(showResponse);
}

function viewFreetsByAuthor(fields) {
    axios
        .get("/api/freets/" + fields.author, fields)
        .then(showResponse)
        .then(function() {
            const authorForm = document.getElementById("view-freets-by-author");
            authorForm.reset();
        })
        .catch(showResponse);
}

function createFreet(fields) {
    axios
        .post("/api/freets", fields)
        .then(showResponse)
        .then(function() {
            const createForm = document.getElementById("create-freet");
            createForm.reset();
        })
        .catch(showResponse);
}

function editFreet(fields) {
    axios
        .put("/api/freets/" + fields.id, fields)
        .then(showResponse)
        .then(function() {
            const editForm = document.getElementById("edit-freet");
            editForm.reset();
        })
        .catch(showResponse);
}

function deleteFreet(fields) {
    axios
        .delete("/api/freets/" + fields.id, fields)
        .then(showResponse)
        .then(function() {
            const deleteForm = document.getElementById("delete-freet");
            deleteForm.reset();
        })
        .catch(showResponse);
}

function upvoteFreet(fields) {
    axios
        .post("/api/freets/upvote/" + fields.id, fields)
        .then(showResponse)
        .then(function() {
            const upvoteForm = document.getElementById("upvote-freet");
            upvoteForm.reset();
        })
        .catch(showResponse);
}

function undoFreetUpvote(fields) {
    axios
        .delete("/api/freets/upvote/" + fields.id, fields)
        .then(showResponse)
        .then(function() {
            const undoUpvoteForm = document.getElementById("undo-freet-upvote");
            undoUpvoteForm.reset();
        })
        .catch(showResponse);   
}

function refreetFreet(fields) {
    axios
        .post("/api/freets/refreet/" + fields.id, fields)
        .then(showResponse)
        .then(function() {
            const refreetForm = document.getElementById("refreet-freet");
            refreetForm.reset();
        })
        .catch(showResponse);
}
// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE BELOW

// map form (by id) to the function that should be called on submit
const formsAndHandlers = {
    "create-user": createUser,
    "delete-user": deleteUser,
    "change-username": changeUsername,
    "change-password": changePassword,
    "sign-in": signIn,
    "sign-out": signOut,
    "who-to-follow": whoToFollow,
    "follow-user": followUser,
    "unfollow-user": unfollowUser, 
    "remove-follower": removeFollower,
    "view-follower-requests": viewFollowerRequests,
    "approve-pending-request": confirmPendingRequest,
    "reject-pending-request": confirmPendingRequest,
    "view-all-freets": viewAllFreets,
    "view-freets-by-author": viewFreetsByAuthor,
    "create-freet": createFreet,
    "edit-freet": editFreet,
    "delete-freet": deleteFreet,
    "upvote-freet": upvoteFreet,
    "undo-freet-upvote": undoFreetUpvote,
    "refreet-freet": refreetFreet,
};

// attach handlers to forms
function init() {
    Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
        const form = document.getElementById(formID);
        form.onsubmit = e => {
            e.preventDefault();
            const data = {};
            new FormData(form).forEach((value, key) => {
                data[key] = value;
            });
            handler(data);
            return false; // don't reload page
        };
    });
}

window.onload = init; // attach handlers once DOM is ready

// GitHub
const providerGithub = new firebase.auth.GithubAuthProvider();
const github = document.getElementById('github');
const githubCode = document.getElementById('githubCode');
const githubError = document.getElementById('githubError');



// 打開登入、刪除的區塊
function openOut() {
  const outBlock = document.getElementById('out');
  outBlock.classList.remove('d-none');
}

// 登出
function signOut() {
  const signOutBtn = document.getElementById('signOut');
  signOutBtn.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      window.alert('登出成功，將重新整理一次頁面！');
      window.location.reload();
    }).catch((error) => {
      document.getElementById('userError').innerHTML = JSON.stringify(error);
    });    
  })
}

// 刪除帳號
function deleteUser() {
  const user = firebase.auth().currentUser;
  if(user !== null) {
    const deleteBtn = document.getElementById('deleteUser');
    deleteBtn.addEventListener('click', () => {
      user.delete().then(function() {
        window.alert('刪除成功，將重新整理一次頁面！');
        window.location.reload();
      }).catch(function(error) {
        document.getElementById('userError').innerHTML = JSON.stringify(error);
      });
    })
  } else {
    document.getElementById('userError').innerHTML = '請重新登入會員，再執行刪除功能';
  }
}



// GitHub 登入
github.addEventListener('click', () => {
  let typeRadio = document.getElementsByName('githubType');
  let typeLen = typeRadio.length;
  let type;
  for(let i = 0; i < typeLen; i++) {
    if(typeRadio[i].checked) {
      type = typeRadio[i].value;
      break;
    }
  }

  // popup 的方式
  if(type === 'popup') {
    firebase.auth()
      .signInWithPopup(providerGithub)
      .then((result) => {
        let credential = result.credential;
        let token = credential.accessToken;
        let user = result.user;
        console.log("🚀 ~ file: main.js ~ line 70 ~ .then ~ user", user)
        githubCode.innerHTML = JSON.stringify(user);
        openOut();
        signOut();
        deleteUser();
        fbCode.innerHTML = '登入完後的資料會出現在這'; // 如果有都登入，要清掉 Facebook 的訊息
      }).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        let email = error.email;
        let credential = error.credential;
        githubError.innerHTML = JSON.stringify(error);
      });
  }
  // redirect 的方式
  else if(type === 'redirect') {
    firebase.auth().signInWithRedirect(providerGithub);
  }
});

// redirect 回來時抓資料
document.addEventListener('DOMContentLoaded', () => {
  firebase.auth()
    .getRedirectResult()
    .then((result) => {
      if(result.credential) {
        let credential = result.credential;
        let token = credential.accessToken;
      }
      let user = result.user;
      if(user) {
        githubCode.innerHTML = JSON.stringify(user);
        openOut();
        signOut();
        deleteUser();
      }
    }).catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      let email = error.email;
      let credential = error.credential;
      githubError.innerHTML = JSON.stringify(error);
    });
});
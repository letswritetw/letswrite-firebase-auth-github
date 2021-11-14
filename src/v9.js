import {
  getAuth,
  signInWithPopup, signInWithRedirect,
  getRedirectResult,
  signOut, deleteUser,
  GithubAuthProvider
} from "firebase/auth";

const auth = getAuth();

// GitHub
const providerGithub = new GithubAuthProvider();
const github = document.getElementById('github');
const githubCode = document.getElementById('githubCode');
const githubError = document.getElementById('githubError');



// 打開登入、刪除的區塊
function openOut() {
  const outBlock = document.getElementById('out');
  outBlock.classList.remove('d-none');
}

// 登出
function triggerSignOut() {
  const signOutBtn = document.getElementById('signOut');
  signOutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
      window.alert('登出成功，將重新整理一次頁面！');
      window.location.reload();
    }).catch((error) => {
      document.getElementById('userError').innerHTML = JSON.stringify(error);
    });  
  })
}

// 刪除帳號
function triggerDeleteUser() {
  const user = auth.currentUser;
  if(user !== null) {
    const deleteBtn = document.getElementById('deleteUser');
    deleteBtn.addEventListener('click', () => {
      deleteUser(user).then(() => {
        window.alert('刪除成功，將重新整理一次頁面！');
        window.location.reload();
      }).catch((error) => {
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
    signInWithPopup(auth, providerGithub)
      .then((result) => {
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log("🚀 ~ file: v9.js ~ line 70 ~ .then ~ user", user)
        githubCode.innerHTML = JSON.stringify(user);
        openOut();
        triggerSignOut();
        triggerDeleteUser();
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GithubAuthProvider.credentialFromError(error);
        githubError.innerHTML = JSON.stringify(error);
      });
  }
  // redirect 的方式
  else if(type === 'redirect') {
    signInWithRedirect(auth, providerGithub);
  }
});

// redirect 回來時抓資料
document.addEventListener('DOMContentLoaded', () => {
  getRedirectResult(auth)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      if(credential) {
        const token = credential.accessToken;
      }
      const user = result.user;
      if(user) {
        githubCode.innerHTML = JSON.stringify(user);
        openOut();
        triggerSignOut();
        triggerDeleteUser();
      }
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = GithubAuthProvider.credentialFromError(error);
      githubError.innerHTML = JSON.stringify(error);
    });
});


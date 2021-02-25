import {AttemptRemoteAndPurgeLocal} from './RequestLayer'


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteCookieFromAllPaths(cookieName) {
  var path = window.location.pathname;
  var paths = ["/"],
    pathLength = 1,
    nextSlashPosition;
  while ((nextSlashPosition = path.indexOf("/", pathLength)) !== -1) {
    pathLength = nextSlashPosition + 1;
    paths.push(path.substr(0, pathLength));
  }

  for (let path of paths)
    document.cookie = `${cookieName}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

function LocalLogout() {
  //delete pertinent cookies
  deleteCookieFromAllPaths("cnfrm_cookie");
  //perform a document.location.replace() to the home page
  document.location.replace("/home");
}

function FullLogout() {
  //attempt to send purge request to server (this will delete all access control tokens and codes and expiration times).
  //regardless of the outcome of this request, it will perform a local logout.
  AttemptRemoteAndPurgeLocal();
}

export {
  LocalLogout,
  FullLogout,
  deleteCookieFromAllPaths,
  getCookie,
};

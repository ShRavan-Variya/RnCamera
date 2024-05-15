type PermissionStatus = 'unavailable' | 'denied' | 'limited' | 'granted' | 'blocked';

import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const checkPermission = async () => {
  let resData: any;
  await check(PERMISSIONS.ANDROID.CAMERA)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          resData = {status: false, result: 'unavailable'}
          break;
        case RESULTS.DENIED:
          resData = {status: false, result: 'denied'}
          break;
        case RESULTS.LIMITED:
          resData = {status: false, result: 'limited'}
          break;
        case RESULTS.GRANTED:
          resData = {status: true, result: 'granted'}
          break;
        case RESULTS.BLOCKED:
          resData = {status: false, result: 'blocked'}
          break;
      }
    })
    .catch((error) => {
      resData = {status: false, result: error}
    });
  return resData;
}

const requestPermission = async () => {
  let resData: any;
  await request(PERMISSIONS.ANDROID.CAMERA)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          resData = {status: false, result: 'unavailable'}
          break;
        case RESULTS.DENIED:
          resData = {status: false, result: 'denied'}
          break;
        case RESULTS.LIMITED:
          resData = {status: false, result: 'limited'}
          break;
        case RESULTS.GRANTED:
          resData = {status: true, result: 'granted'}
          break;
        case RESULTS.BLOCKED:
          resData = {status: false, result: 'blocked'}
          break;
      }
    })
    .catch((error) => {
      resData = {status: false, result: error}
    });
  return resData;
}

export {checkPermission, requestPermission}
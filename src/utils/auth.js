import Cookies from 'js-cookie'

export function getTokenName() {
  return 'Admin-Token'
}

export function getToken() {
  return Cookies.get(getTokenName())
}

export function setToken(token) {
  return Cookies.set(getTokenName(), token)
}

export function removeToken() {
  return Cookies.remove(getTokenName())
}

export function setNameAndPhone({ account, phone }) {
  account && Cookies.set('account', account)
  phone && Cookies.set('phone', phone)
}

export function removeNameAndPhone() {
  Cookies.remove('account')
  Cookies.remove('phone')
}

export function getNameAndPhone() {
  return {
    account: Cookies.get('account'),
    phone: Cookies.get('phone')
  }
}

export function setRemember(bool) {
  return Cookies.set('remember', bool)
}

export function getRemember() {
  return Cookies.get('remember') && JSON.parse(Cookies.get('remember'))
}

import instance from './index'

const getDic = {
  p: ['get,dataDictionarys/**'],
  r: param => {
    return instance.get(`/dataDictionarys/${param}`)
  }
}

export default {
  getDic: getDic
}

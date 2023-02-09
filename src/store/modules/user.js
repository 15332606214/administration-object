import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), //登陆后存储token，先从cookie中获取
    name: '',          //获取用户信息后存储用户名称
    avatar: ''         //获取用户信息后存储用户头像
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 登陆后设置用户token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 获取用户信息后存储到state
  SET_USERINFO: (state, userInfo) => {
    state.name = userInfo.name,
      state.avatar = userInfo.avatar
  }
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
}

const actions = {
  // user login
  /* login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token) //提交第一次设置
        setToken(data.token) //存储token到cookie中
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }, */
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    const response = await login({ username: username.trim(), password: password })
    if (response.code === 20000) {
      const { data } = response
      commit('SET_TOKEN', data.token) //提交第一次设置
      setToken(data.token) //存储token到cookie中
      return 'ok'
    } else {
      return Promise.reject(new Error('failed'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_USERINFO', data)
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 移除token
        resetRouter() //重新设置路由
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true, //命名空间 以后访问[actions,getters,mutations]就要加上名称前缀 user/login
  //可以让多个模块有相同的[actions,getters,mutations] home/login
  state,
  mutations,
  actions
}


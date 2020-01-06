import { userService } from '../_services';

export const users = {
    namespaced: true,
    state: {
        all: {},
        status: {}
    },
    actions: {
        getAll({ commit }) {
            commit('getAllRequest');
            userService.getAll()
                .then(
                    users => commit('getAllSuccess', users),
                    error => commit('getAllFailure', error)
                );
        },
        newUser({ dispatch, commit }, { username, password }) {
            commit('newUserRequest', { username });
            userService.newUser(username, password)
                .then(
                    user => {
                        commit('newUserSuccess', user);
                        dispatch('alert/success', 'User successfully created.', {root:true});
                    },
                    error => {
                        commit('newUserFailure', error);
                        dispatch('alert/error', error, { root: true });
                    }
                );
        },
    },
    mutations: {
        getAllRequest(state) {
            state.all = { loading: true };
        },
        getAllSuccess(state, users) {
            state.all = { items: users };
        },
        getAllFailure(state, error) {
            state.all = { error };
        },
        newUserRequest(state) {
            state.status = { creating: true };
        },
        newUserSuccess(state) {
            state.status = { created: true };
        },
        newUserFailure(state, error) {
            state.status = { error };
        }
    }
}

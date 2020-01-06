import { messageService } from '../_services';

export const messages = {
    namespaced: true,
    state: {
        allMessages: {},
        allRepliesOfMessge:{},
        showReplyModal:false,
    },
    actions: {
        getAll({ commit }, userid) {
            commit('getAllRequest');
            if(userid){
                messageService.getMessagesByUserId(userid)
                .then(
                    messages => commit('getAllSuccess', messages),
                    error => commit('getAllFailure', error)
                );
            }else{
                messageService.getAll()
                .then(
                    messages => commit('getAllSuccess', messages),
                    error => commit('getAllFailure', error)
                );
            }
            
        },
        newMessage({ commit }, message) {
            commit('getAllRequest');
            messageService.newMessage(message)
                .then(
                    messages => commit('getAllSuccess', messages),
                    error => commit('getAllFailure', error)
                );
        },
        newMessageReply({ commit }, {messageReply, messageIdForReply}) {
            commit('newMessageReplyRequest');
            messageService.newMessageReply(messageReply,messageIdForReply)
                .then(
                    messages => {
                        commit('newMessageReplySuccess', messages);
                        commit('toggleReplyModal');
                    },
                    error => commit('getAllFailure', error)
                );
        },
        toggleReplyModal({commit}){
            commit('toggleReplyModal');
        }
    },
    mutations: {
        getAllRequest(state) {
            state.allMessages = { loading: true };
        },
        getAllSuccess(state, messages) {
            state.allMessages = { items: messages };
        },
        getAllFailure(state, error) {
            state.allMessages = { error };
        },
        newMessageReplyRequest(state) {
            state.allRepliesOfMessge = { loading: true };
        },
        newMessageReplySuccess(state, messages) {
            state.allRepliesOfMessge = { items: messages };
        },
        newMessageReplyFailure(state, error) {
            state.allRepliesOfMessge = { error };
        },
        toggleReplyModal(state){
            state.showReplyModal = !state.showReplyModal;
        }
    }
}

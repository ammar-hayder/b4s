import { messageService } from '../_services';
import { router } from '../router';

export const messages = {
    namespaced: true,
    state: {
        allMessages: {},
        allRepliesOfMessage:{},
        showReplyModal:false,
        showEditModal:false,
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
        messageEdit({ commit }, {messageEdit, messageIdForEdit}) {
            commit('getAllRequest');
            messageService.messageEdit(messageEdit, messageIdForEdit)
                .then(
                    messages => {
                        commit('getAllSuccess', messages);
                        commit('toggleEditModal');
                    },
                    error => commit('getAllFailure', error)
                );
        },
        messageDelete({ commit }, {messageIdForDelete}) {
            commit('getAllRequest');
            messageService.messageDelete(messageIdForDelete)
                .then(
                    messages => {
                        commit('getAllSuccess', messages);
                    },
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
        },
        toggleEditModal({commit}){
            commit('toggleEditModal');
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
            state.allRepliesOfMessage = { loading: true };
        },
        newMessageReplySuccess(state, messages) {
            state.allMessages = { items: messages };
            state.allRepliesOfMessage = { loading: false };
        },
        newMessageReplyFailure(state, error) {
            state.allRepliesOfMessage = { error };
        },
        toggleReplyModal(state){
            state.showReplyModal = !state.showReplyModal;
        },
        toggleEditModal(state){
            state.showEditModal = !state.showEditModal;
        }
    }
}

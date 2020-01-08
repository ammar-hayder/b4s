<template>
    <div>
        <h1>Hi {{user.username}}!</h1>
        <p>You're logged in with Vue + Vuex & JWT!!</p>
        <h3>Dashboard </h3>
        <ul class="nav">
            <li class="nav-item">
                <a href="/" class="nav-link active">Messages</a>
            </li>
            <li v-if="user.role === 'ADMIN'" class="nav-item">
                <a href="/manage-users" class="nav-link">Manage users</a>
            </li>
            <li>
                <router-link class="nav-link" to="/login">Logout</router-link>
            </li>
        </ul>
        <form @submit.prevent="handleMessageSubmit">
            <div class="form-group">
                <label for="message">Create Message</label>
                <input type="text" v-model="message" name="message" class="form-control" :class="{ 'is-invalid': messageSubmitted && !message }" />
                <div v-show="messageSubmitted && !message" class="invalid-feedback">Please write something.</div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="messageCreating">Post message</button>
                <img v-show="messageCreating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
            </div>
        </form>
        <em v-if="messages.loading">Loading messages...</em>
        <span v-if="messages.error" class="text-danger">ERROR: {{messages.error}}</span>
        <div v-if="messages.items">
            <div class="card mt-3" v-for="message in messages.items" :key="message.id" >
                <div class="card-header">
                    <h3 class="col-3 float-left"> Message</h3>
                    <ul class="nav nav-pills card-header-pills float-right">
                        <li class="nav-item">
                           <a class="nav-link"  
                                v-show="message.author.id===user.id || user.role ==='ADMIN'" 
                                @click="toggleEditModal();messageIdForEdit=message.id;messageEdit=message.text;">
                                Edit
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="handleMessageDelete();messageIdForDelete=message.id;"  v-if="message.author.id===user.id || user.role ==='ADMIN'"  >
                                Delete
                            </a>
                        </li>
                       
                    </ul>
                </div>
                <div class="card-body">
                    <blockquote class="blockquote mb-0">
                        <p><small>
                            On {{formatDate(message.createdAt)}} {{message.author.username}} wrote:
                        </small></p>
                        <p> {{message.text }} </p>
                        <div class="row mt-2" v-for="reply in message.replies" :key="reply.id" >
                            <div class="col-8 offset-4 align-self-end card" >
                                <div class="card-body">
                                    <p><small>
                                        On {{formatDate(message.createdAt)}} {{message.author.username}} replied:
                                    </small></p>
                                    <p class="card-text"><small>{{reply.text}}</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-3 offset-9" >
                                <button class="btn btn-primary float-right"  @click="toggleReplyModal();messageIdForReply=message.id">Reply to message</button>
                            </div>
                        </div>
                    </blockquote>
                </div>
            </div>
        </div>
        <!-- Modal for Reply-->
        <div v-if="showReplyModal">
            <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <form @submit.prevent="handleMessageReplySubmit">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Reply to this message {{messageIdForReply}}</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true" @click="toggleReplyModal()">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="form-group">
                                            <label for="messageReply"></label>
                                            <input type="text" v-model="messageReply" name="messageReply" class="form-control" :class="{ 'is-invalid': messageReplySubmitted && !messageReply }" />
                                            <div v-show="messageReplySubmitted && !messageReply" class="invalid-feedback">Please enter some text.</div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" @click="toggleReplyModal()">Close</button>
                                        <button class="btn btn-primary" :disabled="messageReplyCreating">Reply</button>
                                        <img v-show="messageReplyCreating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
        <!-- Modal for Message edit-->
        <div v-if="showEditModal">
            <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <form @submit.prevent="handleMessageEditSubmit">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Edit message {{messageIdForEdit}}</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true" @click="toggleEditModal()">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <div class="form-group">
                                            <label for="messageEdit"></label>
                                            <input type="text" v-model="messageEdit" name="messageEdit" class="form-control" :class="{ 'is-invalid': messageEditSubmitted && !messageEdit }" />
                                            <div v-show="messageEditSubmitted && !messageEdit" class="invalid-feedback">Please enter some text.</div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" @click="toggleEditModal()">Close</button>
                                        <button class="btn btn-primary" :disabled="messageEditCreating">Edit</button>
                                        <img v-show="messageEditCreating" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    data () {
        return {
            message: '',
            messageReply: '',
            messageEdit: '',
            messageIdForReply: '',
            messageIdForEdit: '',
            messageIdForDelete:'',
            messageSubmitted: false,
            messageReplySubmitted: false,
            messageEditSubmitted: false,
        }
    },
    computed: {
        user () {
            return this.$store.state.authentication.user;
        },
        messages () {
            return this.$store.state.messages.allMessages;
        },
        messageCreating () {
            return this.$store.state.messages.allMessages.loading;
        },
        messageReplyCreating () {
            return this.$store.state.messages.allRepliesOfMessage.loading;
        },
        messageEditCreating () {
            return this.$store.state.messages.allMessages.loading;
        },
        messageDeleting () {
            return this.$store.state.messages.allMessages.loading;
        },
        showReplyModal(){
            return this.$store.state.messages.showReplyModal;
        },
        showEditModal(){
            return this.$store.state.messages.showEditModal;
        }
    },
    created () {
        return this.$store.dispatch('messages/getAll');
    },
    methods: {
        handleMessageSubmit (e) {
            this.messageSubmitted = true;
            const { message } = this;
            const { dispatch } = this.$store;
            if (message) {
                this.message="";
                this.messageSubmitted = false;
                dispatch('messages/newMessage', { message });
            }
        },
        handleMessageReplySubmit (e) {
            this.messageReplySubmitted = true;
            const { messageReply, messageIdForReply } = this;
            const { dispatch } = this.$store;
            if (messageReply) {
                this.messageReply="";
                this.messageReplySubmitted = false;
                dispatch('messages/newMessageReply', { messageReply, messageIdForReply });
            }
        },
        handleMessageEditSubmit (e) {
            this.messageEditSubmitted = true;
            const { messageEdit, messageIdForEdit } = this;
            const { dispatch } = this.$store;
            if (messageEdit) {
                this.messageEdit="";
                this.messageEditSubmitted = false;
                dispatch('messages/messageEdit', { messageEdit, messageIdForEdit });
            }
        },
        handleMessageDelete (e) {
            const { messageIdForDelete } = this;
            const { dispatch } = this.$store;
            if (messageIdForDelete) {
                dispatch('messages/messageDelete', { messageIdForDelete });
            }
        },
        toggleReplyModal(e){
            const { dispatch } = this.$store;
            dispatch('messages/toggleReplyModal');
        },
        toggleEditModal(e){
            const { dispatch } = this.$store;
            dispatch('messages/toggleEditModal');
        },
        formatDate : function (date) {
            return moment(date).format('LLL');
        }
    }
};
</script>
<template>
    <div>
        <h1>Hi {{user.username}}!</h1>
        <p>You're logged in with Vue + Vuex & JWT!!</p>
        <h3>Dashboard </h3>
        <ul class="nav">
            <li class="nav-item">
                <a href="/" class="nav-link">Messages</a>
            </li>
            <li v-if="user.role === 'ADMIN'" class="nav-item">
                <a href="/manage-users" class="nav-link active">Manage users</a>
            </li>
            <li>
                <router-link class="nav-link" to="/login">Logout</router-link>
            </li>
        </ul>
        
        <em v-if="users.loading">Loading users...</em>
        <span v-if="users.error" class="text-danger">ERROR: {{users.error}}</span>
        <table class="table" v-if="users.items">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Role</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users.items" :key="user.id">
              <th scope="row">{{user.id}}</th>
              <td>{{user.username}}</td>
              <td>{{user.role}}</td>
              <td>Edit | Delete</td>
            </tr>
          </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data () {
        return {
            message: '',
            submitted: false,
            showModal: false,
        }
    },
    computed: {
        user () {
            return this.$store.state.authentication.user;
        },
        users () {
            return this.$store.state.users.all;
        },
    },
    created () {
        return this.$store.dispatch('users/getAll');
    },
    methods: {
        handleSubmit (e) {
            this.submitted = true;
            const { username, password } = this;
            const { dispatch } = this.$store;
            if (username && password) {
                dispatch('authentication/login', { username, password });
            }
        }
    }
};
</script>
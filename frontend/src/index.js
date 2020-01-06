import Vue from 'vue';

import { store } from './_store';
import { router }  from './router';
import App from './components/app/App';
// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});

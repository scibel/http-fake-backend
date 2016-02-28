'use strict';

const Lab = require('lab');
const Code = require('code');
const Config = require('../../../config');
const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');
const HomePlugin = require('../../../server/web/index');


const lab = exports.lab = Lab.script();
let request;
let server;


lab.beforeEach((done) => {

    const plugins = [Vision, Inert, HomePlugin];
    server = new Hapi.Server();
    server.connection({ port: Config.get('/port/web') });
    server.register(plugins, (err) => {

        if (err) {
            return done(err);
        }

        server.views({
            engines: { hbs: require('handlebars') },
            layout: true,
            path: './server/web/views',
            partialsPath: './server/web/views/partials',
            layoutPath: './server/web/views/layout',
            helpersPath: './server/web/views/helpers',
            isCached: false
        });

        done();
    });
});


lab.experiment('Home Page View', () => {

    lab.beforeEach((done) => {

        request = {
            method: 'GET',
            url: '/'
        };

        done();
    });


    lab.test('home page renders properly', (done) => {

        server.inject(request, (response) => {

            Code.expect(response.result).to.match(/swo fake api - home/i);
            Code.expect(response.statusCode).to.equal(200);

            done();
        });
    });
});

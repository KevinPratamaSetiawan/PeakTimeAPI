const { 
    createNewUserHandler, checkLoginUserHandler, authenticationHandler, getUserByUserIdHandler, editUserByUserIdHandler, deleteUserByUserIdHandler, editUserPictureByUserIdHandler,
    saveFormDataByUserIdHandler, getFormDataByUserIdHandler,
    createNewEventByUserIdHandler, getEventListByUserIdHandler, getEventByEventIdHandler, editEventByEventIdHandler, deleteEventByEventIdHandler,
    createNoteByUserIdHandler, getNotesListByUserIdHandler, getNotesByNoteIdHandler, editNotesByNoteIdHandler, deleteNotesByNoteIdHandler,
    createNotififcationByUserIdHandler, getNotififcationListByUserIdHandler, getNotificationByNotificationIdHandler,
    searchDataHandler, createPredictionByUserIdHandler
} = require('../server/handler');

const routes = [
    //Login/Profile System
    {
        method: 'POST',
        path: '/users',
        handler: createNewUserHandler,
    },
    {
        method: 'POST',
        path: '/users/{userid}',
        handler: authenticationHandler,
    },
    {
        method: 'POST',
        path: '/login',
        handler: checkLoginUserHandler,
    },
    {
        method: 'GET',
        path: '/users/{userid}',
        handler: getUserByUserIdHandler,
    },
    {
        method: 'PUT',
        path: '/users/{userid}',
        handler: editUserByUserIdHandler,
    },
    {
        method: 'DELETE',
        path: '/users/{userid}',
        handler: deleteUserByUserIdHandler,
    },
    {
        method: 'POST',
        path: '/users/{userid}/profile-picture',
        handler: editUserPictureByUserIdHandler,
        options:{
            payload:{
                maxBytes: 6000000,
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream'
            }
        }
    },

    //Form System (Nunggu ML)
    {
        method: 'POST',
        path: '/users/{userid}/forms',
        handler: saveFormDataByUserIdHandler,
    },
    {
        method: 'GET',
        path: '/users/{userid}/forms',
        handler: getFormDataByUserIdHandler,
    },

    //Schedule System
    {
        method: 'POST',
        path: '/users/{userid}/events',
        handler: createNewEventByUserIdHandler,
    },
    {
        method: 'GET',
        path: '/users/{userid}/events',
        handler: getEventListByUserIdHandler,
    },
    {
        method: 'GET',
        path: '/users/{userid}/events/{eventid}',
        handler: getEventByEventIdHandler,
    },
    {
        method: 'PUT',
        path: '/users/{userid}/events/{eventid}',
        handler: editEventByEventIdHandler,
    },
    {
        method: 'DELETE',
        path: '/users/{userid}/events/{eventid}',
        handler: deleteEventByEventIdHandler,
    },

    // Recommendation Model System 
    {
        method: 'GET',
        path: '/users/{userid}/model',
        handler: createPredictionByUserIdHandler,
    },

    //Visualization System (Nunggu Database dan Persetujuan format)
    // {
    //     method: 'GET',
    //     path: '/users/{userid}/visuals',
    //     handler: getVisualDataByEmailHandler,
    // },

    //Notes System
    {
        method: 'POST',
        path: '/users/{userid}/notes',
        handler: createNoteByUserIdHandler,
    },
    {
        method: 'GET',
        path: '/users/{userid}/notes',
        handler: getNotesListByUserIdHandler,
    },
    {
        method: 'GET',
        path: '/users/{userid}/notes/{noteid}',
        handler: getNotesByNoteIdHandler,
    },
    {
        method: 'PUT',
        path: '/users/{userid}/notes/{noteid}',
        handler: editNotesByNoteIdHandler,
    },
    {
        method: 'DELETE',
        path: '/users/{userid}/notes/{noteid}',
        handler: deleteNotesByNoteIdHandler,
    },

    // Search System
    {
        method: 'POST',
        path: '/users/{userid}/search',
        handler: searchDataHandler,
    },

    //Notification System
    {
        method: 'POST',
        path: '/users/{userid}/notifications',
        handler: createNotififcationByUserIdHandler,
    },
    {
        method: 'GET',
        path: '/users/{userid}/notifications',
        handler: getNotififcationListByUserIdHandler,
    },
    {
        method: 'GET',
        path: '/users/{userid}/notifications/{notificationid}',
        handler: getNotificationByNotificationIdHandler,
    },
];

module.exports = routes;
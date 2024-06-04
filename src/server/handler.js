const {nanoid} = require('nanoid');
const { 
    getFormattedDateTime,
    checkListedEmail, storeNewUser, getUserData, editUserData, deleteUser, updateAuthentication, editProfilePicture,
    storeNewEvent, getEvent, editEventData, deleteEvent,
    storeNewNote, getNote, editNoteData, deleteNote,
    storeNewNotification, getNotification,
    searchData
} = require('../service/serviceFunctions');


//Login/Profile System
async function createNewUserHandler(request, h){
    try{
        const { email, username, password, birthdate } = request.payload;
        const { emailStatus, passwordStatus, userId } = await checkListedEmail(email);

        if(emailStatus === true){
            const response = h.response({
                status: 'fail',
                message: 'Email already registered to an account.',
            });
            response.code(400);
            return response;
        }

        const id = nanoid(16);
        const authenticationCode = Math.floor(1000 + Math.random() * 9000).toString();
        const createdAt = getFormattedDateTime();
        const updatedAt = createdAt;

        const data = {
            "id": id,
            "email": email,
            "username": username,
            "password": password,
            "birthdate": birthdate,
            "authenticationCode": authenticationCode,
            "createdAt": createdAt,
            "updatedAt": updatedAt
        }

        await storeNewUser(data);

        const response = h.response({
            status: 'success',
            message: 'Please look to your email for authentication code.',
            data: id
        });
        response.code(201);
        return response;

    } catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(400);
          return response
    }
}

async function authenticationHandler(request, h){
    try{
        const { userid } = request.params;
        const { code } = request.payload;
        const [checkCode] = await getUserData(userid);

        if(checkCode.authenticationCode === code){
            await updateAuthentication(userid);

            const response = h.response({
                status: 'success',
                message: 'Account succesfully created.',
                data: userid
            });
            response.code(201);
            return response;
        }else{
            const response = h.response({
                status: 'fail',
                message: 'Wrong authentication code.',
            });
            response.code(400);
            return response;
        }
    } catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(400);
        return response
    }
}

async function checkLoginUserHandler(request, h){
    try{
        const { email, password } = request.payload;
        const { emailStatus, passwordStatus, userId, authenticationCode } = await checkListedEmail(email, password);

        if(emailStatus === false){
            const response = h.response({
                status: 'fail',
                message: "Account not found.",
            });
            response.code(404);
            return response;
        }

        if(authenticationCode !== "DONE"){
            const response = h.response({
                status: 'fail',
                message: "Account not authenticate yet.",
            });
            response.code(400);
            return response;
        }

        if(emailStatus === true && passwordStatus === false){
            const response = h.response({
                status: 'fail',
                message: "Wrong password.",
            });
            response.code(400);
            return response;
        }

        if(emailStatus && passwordStatus && authenticationCode === "DONE"){
            const response = h.response({
                status: 'success',
                message: 'Login successfully.',
                data:{
                    userId,
                }
            });
            response.code(200);
            return response;
        }

    } catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function getUserByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        const accountData = await getUserData(userid);

        if(accountData.length !== 0){
            const [data] = accountData;

            const response = h.response({
                status: 'success',
                data: data
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Account not found.'
        });
        response.code(404);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function editUserByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { email, username, password, birthdate } = request.payload;
        const updatedAt = getFormattedDateTime();

        const editData = {
            "email": email,
            "username": username,
            "password": password,
            "birthdate": birthdate,
            "updatedAt": updatedAt
        }

        const [checkUpdate] = await editUserData(userid, editData);

        if( checkUpdate.email === editData.email && 
            checkUpdate.username === editData.username && 
            checkUpdate.password === editData.password && 
            checkUpdate.birthdate === editData.birthdate && 
            checkUpdate.updatedAt === editData.updatedAt){

            const response = h.response({
                status: 'success',
                message: 'Account has been updated.',
                data: checkUpdate
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Account failed to update.',
        });
        response.code(400);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function deleteUserByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        
        await deleteUser(userid);

        const checkDelete = await getUserData(userid);

        if(checkDelete.length === 0){
            const response = h.response({
                status: 'success',
                message: 'Account has been deleted.',
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Account failed to be deleted.',
        });
        response.code(400);
        return response;
        
    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function editUserPictureByUserIdHandler(request, h){
    try{
        const { image } = request.payload;
        const { userid } = request.params;
        const oldFileName = request.payload.image.hapi.filename;
        const afterDot = oldFileName.substr(oldFileName.indexOf('.'));
        const newFileName = Math.floor(1000 + Math.random() * 9000).toString() + "-profilePicture" + afterDot;

        if(image.bytes > 5000000){
            const response = h.response({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000',
            });
            response.code(413);
            return response;
        }
        
        const result = await editProfilePicture(userid, image, newFileName);

        const response = h.response({
            status: 'success',
            message: 'Profile picture successfully updated.',
            data: result
        });
        response.code(201);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(500);
        return response
    }
}

//Schedule System
async function createNewEventByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { title, description="empty", startDay, finishDay, startTime, finishTime } = request.payload;

        const eventId = nanoid(10);
        const finishStatus = false;
        const createdAt = getFormattedDateTime();
        const updatedAt = createdAt;        

        const data = {
            "id": eventId,
            "title": title,
            "description": description,
            "startDay": startDay,
            "finishDay": finishDay,
            "startTime": startTime,
            "finishTime": finishTime,
            "finishStatus": finishStatus,
            "createdAt": createdAt,
            "updatedAt": updatedAt
        }

        await storeNewEvent(userid, data);

        if(await getEvent(userid, eventId)){
            const response = h.response({
                status: 'success',
                message: 'New event successfully created.',
            });
            response.code(201);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'New event failed to be created.',
        });
        response.code(400);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function getEventListByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        
        const data = await getEvent(userid);

        if(data.length !== 0){
            const response = h.response({
                status: 'success',
                data: data
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Event not found.'
        });
        response.code(404);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function getEventByEventIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { eventid } = request.params;
        
        const data = await getEvent(userid, eventid);

        if(data.length !== 0){
            const response = h.response({
                status: 'success',
                data: data
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Event not found.'
        });
        response.code(404);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function editEventByEventIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { eventid } = request.params;
        const { title, description, startDay, finishDay, startTime, finishTime, finishStatus } = request.payload;
        const updatedAt = getFormattedDateTime();

        const editData = {
            "title": title,
            "description": description,
            "startDay": startDay,
            "finishDay": finishDay,
            "startTime": startTime,
            "finishTime": finishTime,
            "finishStatus": finishStatus,
            "updatedAt": updatedAt
        }

        const [checkUpdate] = await editEventData(userid, eventid, editData);

        if( checkUpdate.title === editData.title && 
            checkUpdate.description === editData.description && 
            checkUpdate.startDay === editData.startDay && 
            checkUpdate.finishDay === editData.finishDay && 
            checkUpdate.startTime === editData.startTime &&
            checkUpdate.finishTime === editData.finishTime &&
            checkUpdate.finishStatus === editData.finishStatus &&
            checkUpdate.updatedAt === editData.updatedAt){

            const response = h.response({
                status: 'success',
                message: 'Event has been updated.',
                data: checkUpdate
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Event failed to update.',
        });
        response.code(400);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function deleteEventByEventIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { eventid } = request.params;
        
        await deleteEvent(userid, eventid);

        const checkDelete = await getEvent(userid, eventid);

        if(checkDelete.length === 0){
            const response = h.response({
                status: 'success',
                message: 'Event has been deleted.',
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Event failed to be deleted.',
        });
        response.code(400);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

//Notes System

async function createNoteByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { title, description="empty" } = request.payload;

        const noteId = nanoid(10);
        const createdAt = getFormattedDateTime();
        const updatedAt = createdAt;        

        const data = {
            "id": noteId,
            "title": title,
            "description": description,
            "createdAt": createdAt,
            "updatedAt": updatedAt
        }

        await storeNewNote(userid, data);

        if(await getNote(userid, noteId)){
            const response = h.response({
                status: 'success',
                message: 'New note successfully created.',
            });
            response.code(201);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'New note failed to be created.',
        });
        response.code(400);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function getNotesListByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        
        const data = await getNote(userid);

        if(data.length !== 0){
            const response = h.response({
                status: 'success',
                data: data
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Notes not found.'
        });
        response.code(404);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function getNotesByNoteIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { noteid } = request.params;
        
        const data = await getNote(userid, noteid);

        if(data.length !== 0){
            const response = h.response({
                status: 'success',
                data: data
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Note not found.'
        });
        response.code(404);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function editNotesByNoteIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { noteid } = request.params;
        const { title, description="empty" } = request.payload;
        const updatedAt = getFormattedDateTime();

        const editData = {
            "title": title,
            "description": description,
            "updatedAt": updatedAt
        }

        const [checkUpdate] = await editNoteData(userid, noteid, editData);

        if( checkUpdate.title === editData.title && 
            checkUpdate.description === editData.description && 
            checkUpdate.updatedAt === editData.updatedAt){

            const response = h.response({
                status: 'success',
                message: 'Event has been updated.',
                data: checkUpdate
            });
            response.code(200);
            return response;
        }


        const response = h.response({
            status: 'fail',
            message: 'Event failed to update.',
        });
        response.code(400);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function deleteNotesByNoteIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { noteid } = request.params;
        
        await deleteNote(userid, noteid);

        const checkDelete = await getNote(userid, noteid);

        if(checkDelete.length === 0){
            const response = h.response({
                status: 'success',
                message: 'Note has been deleted.',
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Note failed to be deleted.',
        });
        response.code(400);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

//Notification System
async function createNotififcationByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { title, description } = request.payload;

        const notificationId = nanoid(10);
        const createdAt = getFormattedDateTime();       

        const data = {
            "id": notificationId,
            "title": title,
            "description": description,
            "createdAt": createdAt
        }

        await storeNewNotification(userid, data);

        if(await getNotification(userid, notificationId)){
            const response = h.response({
                status: 'success',
                message: 'New notification successfully created.',
            });
            response.code(201);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'New notification failed to be created.',
        });
        response.code(400);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function getNotififcationListByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        
        const data = await getNotification(userid);

        if(data.length !== 0){
            const response = h.response({
                status: 'success',
                data: data
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Notification not found.'
        });
        response.code(404);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

async function getNotificationByNotificationIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { notificationid } = request.params;
        
        const data = await getNotification(userid, notificationid);

        if(data.length !== 0){
            const response = h.response({
                status: 'success',
                data: data
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'fail',
            message: 'Notification not found.'
        });
        response.code(404);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
          });
          response.code(500);
          return response
    }
}

// Search System
async function searchDataHandler(request, h){
    try{
        const { userid } = request.params;
        const { searchWord } = request.payload;

        const result = await searchData(userid, searchWord);

        if(result[0].length !== 0 || result[1].length !== 0 || result[2].length !== 0){
            const response = h.response({
                status: 'success',
                data: result
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'success',
            message: 'No matching data.',
        });
        response.code(200);
        return response;

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(500);
        return response
    }
}

module.exports = { 
    createNewUserHandler, checkLoginUserHandler, authenticationHandler, getUserByUserIdHandler, editUserByUserIdHandler, deleteUserByUserIdHandler, editUserPictureByUserIdHandler,
    createNewEventByUserIdHandler, getEventListByUserIdHandler, getEventByEventIdHandler, editEventByEventIdHandler, deleteEventByEventIdHandler,
    createNoteByUserIdHandler, getNotesListByUserIdHandler, getNotesByNoteIdHandler, editNotesByNoteIdHandler, deleteNotesByNoteIdHandler,
    createNotififcationByUserIdHandler, getNotififcationListByUserIdHandler, getNotificationByNotificationIdHandler,
    searchDataHandler
};

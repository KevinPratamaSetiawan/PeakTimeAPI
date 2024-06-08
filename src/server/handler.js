const {nanoid} = require('nanoid');
const { 
    getFormattedDateTime,
    checkListedEmail, storeNewUser, getUserData, editUserData, deleteUser, updateAuthentication, editProfilePicture,
    storeNewForm, getForm,
    storeNewEvent, getEvent, editEventData, deleteEvent,
    storeNewNote, getNote, editNoteData, deleteNote,
    storeNewNotification, getNotification,
    searchData, predictChronotype
} = require('../service/serviceFunctions');


//Login/Profile System
async function createNewUserHandler(request, h){
    try{
        const { email, username, password } = request.payload;
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
        const { email, username, password } = request.payload;
        const updatedAt = getFormattedDateTime();

        const editData = {
            "email": email,
            "username": username,
            "password": password,
            "updatedAt": updatedAt
        }

        const [checkUpdate] = await editUserData(userid, editData);

        if( checkUpdate.email === editData.email && 
            checkUpdate.username === editData.username && 
            checkUpdate.password === editData.password && 
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

//Form System
async function saveFormDataByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { age, task, average_rest, mood_before_work, deadline, importance, sleep_average, urgency, total_gangguan, average_work_hour, work_days } = request.payload;

        let taskType = 0;
        let moodBeforeWork = 0;
        let taskDeadline = 0;
        let workDays = 0;

        const id = nanoid(5);
        const totalDistraction = total_gangguan.length;
        const createdAt = getFormattedDateTime();

        const taskTransform = ['Kreatif (Desain grafis, Penulis, dll)', 'Analitis (Analisis data, Analisis keuangan, dll)', 'Fisik (Pemain sepak bola, Pemain voli, Buruh, dll)', 'Administratif (Admin, Sekretaris, dll)', 'Komunikasi (Jurnalis, Penyiar, Public relation, dll)', 'Penelitian (Peneliti lingkungan, Peneliti budaya, Data scientist, dll)', 'Akademik (Dosen, Guru, Siswa, Mahasiswa, dll)'];
        const moodTransform = ['Semangat', 'Cemas', 'Malas'];
        const deadlineTransform = ['Kurang dari 3 hari', '3 hari hingga 1 minggu', '1 hingga 2 minggu', '2 minggu hingga 1 bulan', 'Lebih dari 1 bulan'];
        const workDaysTransform = ['1 hari', '2 hari', '3 hari', '4 hari', '5 hari', '6 hari', '7 hari'];

        for(let i=0;i<=7;i++){
            if(i<7 && task === taskTransform[i]){
                taskType = i;
            }

            if(i<3 && mood_before_work === moodTransform[i]){
                moodBeforeWork = i;
            }

            if(i<5 && deadline === deadlineTransform[i]){
                taskDeadline = i;
            }

            if(i>0 && work_days === workDaysTransform[i]){
                workDays = i+1;
            }
        }

        const formData = {
            'id': id,
            'userAge': age,
            'taskType': taskType,
            'averageRestHour': average_rest, 
            'moodBeforeWork': moodBeforeWork,
            'taskDeadline': taskDeadline,
            'taskImportance': importance,
            'sleepAverageHour': sleep_average,
            'taskUrgency': urgency,
            'totalDistraction': totalDistraction,
            'averageWorkHour': average_work_hour,
            'workDays': workDays,
            'createdAt': createdAt
        }

        await storeNewForm(userid, formData);

        if(await getForm(userid)){
            const response = h.response({
                status: 'success',
                message: 'Form data successfully stored.',
            });
            response.code(201);
            return response;
        }

    }catch(error){
        const response = h.response({
            status: 'fail',
            message: error.message,
        });
        response.code(500);
        return response
    }
}

async function getFormDataByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        
        const data = await getForm(userid);

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
            message: 'Form data not found.'
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

//Model System
async function createPredictionByUserIdHandler(request, h){
    try{
        const { userid } = request.params;
        const { model } = request.server.app;
        const [formData] = await getForm(userid);

        console.log(formData);

        const { chronotype, maxProbability } = await predictChronotype(model, formData);

        const response = h.response({
            status: 'success',
            message: 'Prediction success.',
            data:{
                chronotype,
                maxProbability
            }
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
    saveFormDataByUserIdHandler, getFormDataByUserIdHandler,
    createNewEventByUserIdHandler, getEventListByUserIdHandler, getEventByEventIdHandler, editEventByEventIdHandler, deleteEventByEventIdHandler,
    createNoteByUserIdHandler, getNotesListByUserIdHandler, getNotesByNoteIdHandler, editNotesByNoteIdHandler, deleteNotesByNoteIdHandler,
    createNotififcationByUserIdHandler, getNotififcationListByUserIdHandler, getNotificationByNotificationIdHandler,
    searchDataHandler, createPredictionByUserIdHandler
};

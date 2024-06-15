const { Storage } = require('@google-cloud/storage');
const con  = require('../service/connectDatabase');
const tf = require('@tensorflow/tfjs');
const tfdf = require('@tensorflow/tfjs-tfdf');
const DataFrame = require('dataframe-js').DataFrame;
const nodemailer = require('nodemailer');
const util = require('util');
const mysql = require('mysql');
require('dotenv').config();

const fs = require('fs').promises;
const os = require('os');
const path = require('path');

const queryAsync = util.promisify(con.query).bind(con);

// NOT TESTED YET
function getFormattedDateTime(){
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

//Login/Profile System
async function checkListedEmail(checkEmail, checkPassword = false){
    const query = 'SELECT id, email, password, authenticationCode FROM accounts WHERE email = ' + mysql.escape(checkEmail);

    try {
        const result = await queryAsync(query);

        if(result === undefined || result.length == 0){
            const data = {
                "emailStatus": false,
                "passwordStatus": false,
                "userId": "",
                "authenticationCode": ""
            };
            return data;
        }else{
            const [{ id, email, password, authenticationCode }] = result;
    
            if(checkPassword === false){
                const data = {
                    "emailStatus": true,
                    "passwordStatus": false,
                    "userId": "",
                    "authenticationCode": authenticationCode
                };
                return data;
            }else{
                if(checkEmail === email && checkPassword === password){
                    const data = {
                        "emailStatus": true,
                        "passwordStatus": true,
                        "userId": id,
                        "authenticationCode": authenticationCode
                    };
                    return data;
                }else if(checkEmail === email && checkPassword !== password){
                    const data = {
                        "emailStatus": true,
                        "passwordStatus": false,
                        "userId": "",
                        "authenticationCode": authenticationCode
                    };
                    return data;
                }
            }
        }
    } catch (error) {
        throw error;
    }

        
}

async function storeNewUser(data){
    const { id, email, username, password, authenticationCode, createdAt, updatedAt } = data;
    const defaultProfilePicture = process.env.DEFAULT_PROFILE_PICTURE;

    const query = 'INSERT INTO accounts (id, email, username, password, profilePictureUrl, authenticationCode, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [id, email, username, password, defaultProfilePicture, authenticationCode, createdAt, updatedAt];

    try {
        const result = await queryAsync(query, values);
        await sendAuthenticationEmail(email, authenticationCode)
        return result;
    } catch (error) {
        throw error;
    }
}

async function sendAuthenticationEmail(email, code){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.APP_PASSWORD,
        },
    });

    let mailOptions = {
        from: '"PeakTime" <peaktime.c241ps178@gmail.com>',
        to: email,
        subject: 'Email Authentication Code',
        text: `Your authentication code is ${code}`,
        html: `<b>Your authentication code is ${code}</b>`,
    };

    
    try {
        let info = await transporter.sendMail(mailOptions);
    
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        throw error;
    }
}

async function updateAuthentication(userId){
    const query = "UPDATE accounts SET authenticationCode = 'DONE' WHERE id = ?";
    const values = [userId];

    try {
        const result = await queryAsync(query, values);
        return await getUserData(userId);
    } catch (error) {
        throw error;
    }
}

async function getUserData(userId) {
    const query = 'SELECT id, email, username, profilePictureUrl, chronotype, authenticationCode FROM accounts WHERE id = ' + mysql.escape(userId);
    try {
        const result = await queryAsync(query);
        return result;
    } catch (error) {
        throw error;
    }
}

async function editUserData(userId, editData){
    const { email, username, password, updatedAt } = editData;
    const query = "UPDATE accounts SET email = ?, username = ?, password = ?, updatedAt = ? WHERE id = ?";
    const values = [email, username, password, updatedAt, userId];

    try {
        const result = await queryAsync(query, values);
        return await getUserData(userId);
    } catch (error) {
        throw error;
    }
}

async function deleteUser(userId){
    const query = 'DELETE FROM accounts WHERE id = ' + mysql.escape(userId);

    try {
        const result = await queryAsync(query);
    } catch (error) {
        throw error;
    }
}

async function editProfilePicture(userId, image, fileName){
    const profilePictureUrl = 'https://storage.cloud.google.com/peaktime-data/' + fileName;
    const query = "UPDATE accounts SET profilePictureUrl = ? WHERE id = ?";
    const values = [profilePictureUrl, userId];

    const projectId = process.env.PROJECT_ID;
    const keyFilename = process.env.KEY_FILENAME;
    const bucketName = process.env.BUCKET_NAME;
    
    const storage = new Storage({projectId, keyFilename});
    try {
        const connectBucket = storage.bucket(bucketName);

        const tempFilePath = path.join(os.tmpdir(), fileName);

        await fs.writeFile(tempFilePath, image);

        await connectBucket.upload(tempFilePath, {destination: fileName})

        await fs.unlink(tempFilePath);

        const [oldData] = await getUserData(userId);

        const deleteImageUrl = oldData.profilePictureUrl.substr(47);

        if(oldData.profilePictureUrl !== 'https://storage.cloud.google.com/peaktime-data/icon.jpg'){
            await connectBucket.file(deleteImageUrl).delete();
        }

        await queryAsync(query, values);
        return await getUserData(userId);
        
    } catch (error) {
        throw error;
    }
}

//Form System
async function storeNewForm(userId, data){
    const { id, userAge, taskType, averageRestHour,  moodBeforeWork, taskDeadline, taskImportance, sleepAverageHour, taskUrgency, totalDistraction, averageWorkHour, workDays, createdAt } = data;

    const query = 'INSERT INTO forms (id, fkUserIdForms, userAge, taskType, averageRestHour,  moodBeforeWork, taskDeadline, taskImportance, sleepAverageHour, taskUrgency, totalDistraction, averageWorkHour, workDays, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [id, userId, userAge, taskType, averageRestHour,  moodBeforeWork, taskDeadline, taskImportance, sleepAverageHour, taskUrgency, totalDistraction, averageWorkHour, workDays, createdAt];

    try {
        const result = await queryAsync(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getForm(userId) {
    const query = 'SELECT * FROM forms WHERE fkUserIdForms = ' + mysql.escape(userId);

    try {
        const result = await queryAsync(query);
        return result;
    } catch (error) {
        throw error;
    }
}

//Schedule System
async function storeNewEvent(userId, data){
    const { id, title, description, startDay, finishDay, startTime, finishTime, finishStatus, createdAt, updatedAt } = data;

    const query = 'INSERT INTO events (id, fkUserIdEvents, title, description, startDay, finishDay, startTime, finishTime, finishStatus, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [id, userId, title, description, startDay, finishDay, startTime, finishTime, finishStatus, createdAt, updatedAt];

    try {
        const result = await queryAsync(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getEvent(userId, eventId = false){
    if(eventId === false){
        const query = 'SELECT * FROM events WHERE fkUserIdEvents = ? ORDER BY updatedAt ASC';
        const values = [userId];

        try {
            const result = await queryAsync(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }else{
        const query = 'SELECT * FROM events WHERE fkUserIdEvents = ? AND id = ?';
        const values = [userId, eventId];

        try {
            const result = await queryAsync(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

async function editEventData(userId, eventId, editData){
    const { title, description, startDay, finishDay, startTime, finishTime, finishStatus, updatedAt } = editData;
    const query = "UPDATE events SET title = ?, description = ?, startDay = ?, finishDay = ?, startTime = ?, finishTime = ?, finishStatus = ?, updatedAt = ? WHERE id = ? AND fkUserIdEvents = ?";
    const values = [title, description, startDay, finishDay, startTime, finishTime, finishStatus, updatedAt, eventId, userId];

    try {
        const result = await queryAsync(query, values);
        return await getEvent(userId, eventId);
    } catch (error) {
        throw error;
    }
}

async function deleteEvent(userId, eventId){
    const query = 'DELETE FROM events WHERE id = ? AND fkUserIdEvents = ?';
    const values = [eventId, userId];

    try {
        const result = await queryAsync(query, values);
    } catch (error) {
        throw error;
    }
}

//Notes System
async function storeNewNote(userId, data){
    const { id, title, description, createdAt, updatedAt } = data;

    const query = 'INSERT INTO notes (id, fkUserIdNotes, title, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [id, userId, title, description, createdAt, updatedAt];

    try {
        const result = await queryAsync(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getNote(userId, noteId = false){
    if(noteId === false){
        const query = 'SELECT * FROM notes WHERE fkUserIdNotes = ? ORDER BY updatedAt DESC';
        const values = [userId];

        try {
            const result = await queryAsync(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }else{
        const query = 'SELECT * FROM notes WHERE fkUserIdNotes = ? AND id = ?';
        const values = [userId, noteId];

        try {
            const result = await queryAsync(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

async function editNoteData(userId, noteId, editData){
    const { title, description, updatedAt } = editData;
    const query = "UPDATE notes SET title = ?, description = ?, updatedAt = ? WHERE id = ? AND fkUserIdNotes = ?";
    const values = [title, description, updatedAt, noteId, userId];

    try {
        const result = await queryAsync(query, values);
        return await getNote(userId, noteId);
    } catch (error) {
        throw error;
    }
}

async function deleteNote(userId, noteId){
    const query = 'DELETE FROM notes WHERE id = ? AND fkUserIdNotes = ?';
    const values = [noteId, userId];

    try {
        await queryAsync(query, values);
    } catch (error) {
        throw error;
    }
}

//Notification System
async function storeNewNotification(userId, data){
    const { id, title, description, createdAt } = data;
    const query = 'INSERT INTO notifications (id, fkUserIdNotifications, title, description, createdAt) VALUES (?, ?, ?, ?, ?)';
    const values = [id, userId, title, description, createdAt];

    try {
        const result = await queryAsync(query, values);
        return result;
    } catch (error) {
        throw error;
    }
}

async function getNotification(userId, notificationId = false){
    if(notificationId === false){
        const query = 'SELECT * FROM notifications WHERE fkUserIdNotifications = ? ORDER BY updatedAt DESC';
        const values = [userId];

        try {
            const result = await queryAsync(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }else{
        const query = 'SELECT * FROM notifications WHERE fkUserIdNotifications = ? AND id = ?';
        const values = [userId, notificationId];

        try {
            const result = await queryAsync(query, values);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

// Search System
async function searchData(userId, searchWord){
    const query1 = `SELECT * FROM events WHERE fkUserIdEvents = ? AND title LIKE ${"'%"+searchWord+"%'"} ORDER BY updatedAt ASC`;
    const values1 = [userId];
    const query2 = `SELECT * FROM notes WHERE fkUserIdNotes = ? AND title LIKE ${"'%"+searchWord+"%'"} ORDER BY updatedAt DESC`;
    const values2 = [userId];
    const query3 = `SELECT * FROM notifications WHERE fkUserIdNotifications = ? AND title LIKE ${"'%"+searchWord+"%'"} ORDER BY createdAt DESC`;
    const values3 = [userId];

    try {
        const result1 = await queryAsync(query1, values1);
        const result2 = await queryAsync(query2, values2);
        const result3 = await queryAsync(query3, values3);

        const searchResult = [result1, result2, result3]

        return searchResult;
    } catch (error) {
        throw error;
    }
}

//Model System
async function predictChronotype(userId, model, formData){
    const { userAge, taskType, averageRestHour,  moodBeforeWork, taskDeadline, taskImportance, sleepAverageHour, taskUrgency, totalDistraction, averageWorkHour, workDays } = formData;
    const chronotypeList = ['Lion', 'Bear', 'Wolf', 'Dolphin'];

    const features = {
        'Age': [userAge],
        'Task': [taskType],
        'average_rest': [averageRestHour],
        'mood_before_work': [moodBeforeWork],
        'deadline': [taskDeadline],
        'importance': [taskImportance],
        'sleep_average': [sleepAverageHour],
        'urgency': [taskUrgency],
        'total_gangguan': [totalDistraction],
        'average_work_hour': [averageWorkHour],
        'work_days': [workDays]
    };

    // Dynamic Input
    const featuresTensor = {
        age: tf.tensor(features.Age, [1], 'int32'),
        task: tf.tensor(features.Task, [1], 'int32'),
        average_rest: tf.tensor(features.average_rest, [1], 'int32'),
        mood_before_work: tf.tensor(features.mood_before_work, [1], 'int32'),
        deadline: tf.tensor(features.deadline, [1], 'int32'),
        importance: tf.tensor(features.importance, [1], 'int32'),
        sleep_average: tf.tensor(features.sleep_average, [1], 'int32'),
        urgency: tf.tensor(features.urgency, [1], 'int32'),
        total_gangguan: tf.tensor(features.total_gangguan, [1], 'int32'),
        average_work_hour: tf.tensor(features.average_work_hour, [1], 'int32'),
        work_days: tf.tensor(features.work_days, [1], 'int32')
    };

    // Static Input: for testing
    // const featuresTensor = {
    //     age: tf.tensor(29, [1], 'int32'),
    //     task: tf.tensor(5, [1], 'int32'),
    //     average_rest: tf.tensor(30, [1], 'int32'),
    //     mood_before_work: tf.tensor(3, [1], 'int32'),
    //     deadline: tf.tensor(2, [1], 'int32'),
    //     importance: tf.tensor(3, [1], 'int32'),
    //     sleep_average: tf.tensor(7, [1], 'int32'),
    //     urgency: tf.tensor(1, [1], 'int32'),
    //     total_gangguan: tf.tensor(0, [1], 'int32'),
    //     average_work_hour: tf.tensor(8, [1], 'int32'),
    //     work_days: tf.tensor(5, [1], 'int32')
    // };

    try {
        const prediction = await model.executeAsync(featuresTensor);
        
        const predictionArray = prediction.arraySync()[0];
        // console.log("Prediction : ")
        // console.log(predictionArray)

        let maxProbability = -Infinity;
        let maxIndex = 0;

        for(let i=4;i<8;i++){
            if(predictionArray[i] > maxProbability){
                maxProbability = predictionArray[i];
                maxIndex = i;
            }
        }

        const chronotype = chronotypeList[maxIndex-4];
        maxProbability = maxProbability * 100;

        // console.log('Finish chrono :');
        // console.log(chronotype);
        // console.log('====================================');
        // console.log(maxProbability);

        const query = "UPDATE accounts SET chronotype = ? WHERE id = ?";
        const values = [chronotype, userId];

        await queryAsync(query, values);

        return { chronotype, maxProbability };
    } catch (error) {
        throw error;
    }
}

//Visual System
async function makeTime(hour, minute, second){
    let date = new Date();

    date.setHours(hour, minute, second, 0);

    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    let formattedTime = `${hours}:${minutes}`;

    return formattedTime;
}

async function getChronotypeData(chronotype){
    let description, percentage, workStartTime, workFinishTime, wakeUpTime, sleepTime;

    if(chronotype === "Lion"){
        description = "People with the lion chronotype tend to wake up early, and feel most energetic and productive before noon. Lions tend to feel most accomplished when they tackle their daily to-do list as soon as possible. As energy levels begin to fall in the early afternoon, lions typically wind down in the early evening and fall asleep early night. Roughly 15% of people have the lion chronotype.";
        percentage = "15% of population.";
        workStartTime = await makeTime(9, 0, 0);
        workFinishTime = await makeTime(14, 0, 0);
        wakeUpTime = await makeTime(6, 0, 0);
        sleepTime = await makeTime(22, 0, 0);
    }else if(chronotype === "Bear"){
        description = "The bear is the most common human chronotype, found in roughly 55% of the population. People with the bear chronotype — like bears in the wild — essentially follow the sun, waking up when the sun rises in early morning and retiring as darkness falls in the early evening.";
        percentage = "55% of population.";
        workStartTime = await makeTime(10, 0, 0);
        workFinishTime = await makeTime(14, 0, 0);
        wakeUpTime = await makeTime(7, 0, 0);
        sleepTime = await makeTime(23, 0, 0);
    }else if(chronotype === "Wolf"){
        description = "If you know someone who isn’t a “morning person,” chances are they’re a wolf — about 15% of the population has this chronotype. Wolves usually wake up later in the day. They’ll also get bursts of energy in the evening. Midnight or later is a common bedtime for wolves.";
        percentage = "15% of population";
        workStartTime = await makeTime(13, 0, 0);
        workFinishTime = await makeTime(17, 0, 0);
        wakeUpTime = await makeTime(7, 30, 0);
        sleepTime = await makeTime(0, 0, 0);
    }else if(chronotype === "Dolphin"){
        description = "About 10% of people have the dolphin chronotype, which is the hardest to form a schedule around without sacrificing sleep quality. This chronotype gets its name because dolphins in the wild remain alert while sleeping to evade predators. People with this chronotype tend to be sensitive to light and noise while they sleep, and prone to fragmented sleep patterns. Many are considered insomniacs.";
        percentage = "10% of population.";
        workStartTime = await makeTime(15, 0, 0);
        workFinishTime = await makeTime(19, 0, 0);
        wakeUpTime = await makeTime(6, 0, 0);
        sleepTime = await makeTime(23, 0, 0);
    }return { description, percentage, workStartTime, workFinishTime, wakeUpTime, sleepTime }
}

module.exports = { 
    getFormattedDateTime,
    checkListedEmail, storeNewUser, getUserData, editUserData, deleteUser, updateAuthentication, editProfilePicture,
    storeNewForm, getForm,
    storeNewEvent, getEvent, editEventData, deleteEvent,
    storeNewNote, getNote, editNoteData, deleteNote,
    storeNewNotification, getNotification,
    searchData, predictChronotype, getChronotypeData
};
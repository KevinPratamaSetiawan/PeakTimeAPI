const { Storage } = require('@google-cloud/storage');
const con  = require('../service/connectDatabase');
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
    const { id, email, username, password, birthdate, authenticationCode, createdAt, updatedAt } = data;
    const defaultProfilePicture = process.env.DEFAULT_PROFILE_PICTURE;

    const query = 'INSERT INTO accounts (id, email, username, password, birthdate, profilePictureUrl, authenticationCode, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [id, email, username, password, birthdate, defaultProfilePicture, authenticationCode, createdAt, updatedAt];

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
    const query = 'SELECT id, email, username, birthdate, profilePictureUrl, authenticationCode FROM accounts WHERE id = ' + mysql.escape(userId);
    try {
        const result = await queryAsync(query);
        return result;
    } catch (error) {
        throw error;
    }
}

async function editUserData(userId, editData){
    const { email, username, password, birthdate, authenticationCode, updatedAt } = editData;
    const query = "UPDATE accounts SET email = ?, username = ?, password = ?, birthdate = ?, updatedAt = ? WHERE id = ?";
    const values = [email, username, password, birthdate, updatedAt, userId];

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

module.exports = { 
    getFormattedDateTime,
    checkListedEmail, storeNewUser, getUserData, editUserData, deleteUser, updateAuthentication, editProfilePicture,
    storeNewEvent, getEvent, editEventData, deleteEvent,
    storeNewNote, getNote, editNoteData, deleteNote,
    storeNewNotification, getNotification,
    searchData
};
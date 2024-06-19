# Project: PeakTimeAPI
API endpoint for PeakTime App

We're creating a schedule manager app with one of the feature being a schedule recommender. the application helps users in improving their productivity by tracking and analyzing their daily activity, rest, and sleep schedules recommending personalized daily routines and classifying users chronotypes, allowing them to optimize their schedules according to their natural alertness and sleepiness patterns. Through this approach, we aim to help users gain a deeper understanding of their behavior patterns and improve their overall time management.

Credits:

- **C001D4KY0333 - Mike Jared Gunawan - Institut Pertanian Bogor**
    
- **C119D4KY0131 - Kevin Pratama Setiawan - Institut Teknologi Sumatra**
# 📁 Collection: User System 


## End-point: createNewUserHandler
**Request** Body/Payload :

- **`email`** varchar(255) NOT NULL
    
- **`username`** varchar(255) NOT NULL
    
- **`password`** varchar(255) NOT NULL
### Method: POST
>```
>http://34.143.179.237:3000/users
>```
### Body (**raw**)

```json
{
    "email": "c241.ps178.peaktime@gmail.com",
    "username": "Mr/Mrs. PeakTime",
    "password": "passwordinnit"
}
```

### Response: 201
```json
{
    "status": "success",
    "message": "Please look to your email for authentication code.",
    "data": {
        "userId": "web500a97tw_Tsnu"
    }
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Email already registered to an account."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: autenticationHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- **`code`** string(4) NOT NULL, string of int
### Method: POST
>```
>http://34.143.179.237:3000/users/{{userId}}
>```
### Body (**raw**)

```json
{
    "code": "0000"
}
```

### Response: 201
```json
{
    "status": "success",
    "message": "Account succesfully created.",
    "data": {
        "userId": "web500a97tw_Tsnu"
    }
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Wrong authentication code."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: checkLoginUserHandler
**Request** Body/Payload :

- **`email`** varchar(255) NOT NULL
    
- **`password`** varchar(255) NOT NULL
### Method: POST
>```
>http://34.143.179.237:3000/login
>```
### Body (**raw**)

```json
{
    "email": "c241.ps178.peaktime@gmail.com",
    "password": "passwordinnit"
}
```

### Response: 200
```json
{
    "status": "success",
    "message": "Login successfully.",
    "data": {
        "userId": "web500a97tw_Tsnu"
    }
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Account not found."
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Account not authenticate yet."
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Wrong password."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getUserByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Account data successfully fetched.",
    "data": {
        "id": "web500a97tw_Tsnu",
        "email": "c241.ps178.peaktime@gmail.com",
        "username": "Mr/Mrs. PeakTime",
        "password": "password innit",
        "profilePictureUrl": "https://storage.cloud.google.com/peaktime-data/icon.jpg",
        "chronotype": null,
        "authenticationCode": "DONE"
    }
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Account not found."
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Account not found."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: editUserByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- **`email`** varchar(255) OPTIONAL
    
- **`username`** varchar(255) OPTIONAL
    
- **`password`** varchar(255) OPTIONAL
    

**Note:** Atleast one edited.
### Method: PUT
>```
>http://34.143.179.237:3000/users/{{userId}}
>```
### Body (**raw**)

```json
{
    "email": "email",
    "username": "username",
    "password": "password"
}
```

### Response: 200
```json
{
    "status": "success",
    "message": "Account has been updated.",
    "data": {
        "id": "web500a97tw_Tsnu",
        "email": "email",
        "username": "username",
        "password": "password",
        "profilePictureUrl": "https://storage.cloud.google.com/peaktime-data/icon.jpg",
        "chronotype": null,
        "authenticationCode": "DONE"
    }
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Account failed to update."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: editUserPictureByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- **`image`** **file, PNG/JPEG/etc,** max size **`4MB`**
### Method: PUT
>```
>http://34.143.179.237:3000/users/{{userId}}/profile-picture
>```
### Body formdata

|Param|value|Type|
|---|---|---|
|image|postman-cloud:///1ef2c85b-2155-4630-bed7-91717e3eec94|file|


### Response: 200
```json
{
    "status": "success",
    "message": "Profile picture successfully updated.",
    "data": {
        "id": "web500a97tw_Tsnu",
        "email": "email",
        "username": "username",
        "password": "password",
        "profilePictureUrl": "https://storage.cloud.google.com/peaktime-data/7320-profilePicture.png",
        "chronotype": null,
        "authenticationCode": "DONE"
    }
}
```

### Response: 413
```json
{
    "status": "fail",
    "message": "Payload content length greater than maximum allowed: 4 MB"
}
```

### Response: 413
```json
{
    "status": "fail",
    "message": "Payload content length greater than maximum allowed: 4 MB"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: deleteUserByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- None
### Method: DELETE
>```
>http://34.143.179.237:3000/users/{{userId}}
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Account has been deleted."
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Account failed to be deleted.."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
# 📁 Collection: Form System 


## End-point: saveFormDataByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- **`age`** int NOT NULL
    
- **`task`** string NOT NULL
    
- **`average_rest`** int NOT NULL
    
- **`mood_before_work`** string NOT NULL
    
- **`deadline`** string NOT NULL
    
- **`importance`** int NOT NULL
    
- **`sleep_average`** int NOT NULL
    
- **`urgency`** int NOT NULL
    
- **`total_gangguan`****,** **ARRAY** of **string** NOT NULL
    
- **`average_work_hour`** int NOT NULL
    
- **`work_days`** string NOT NULL
### Method: POST
>```
>http://34.143.179.237:3000/users/{{userId}}/forms
>```
### Body (**raw**)

```json
{
    "age": 17,
    "task": "Kreatif (Desain grafis, Penulis, dll)",
    "average_rest": 2, 
    "mood_before_work": "Semangat",
    "deadline": "Kurang dari 3 hari",
    "importance": 5,
    "sleep_average": 8,
    "urgency": 3,
    "total_gangguan": ["asdasd","asdadsads","asdadasd"],
    "average_work_hour": 6,
    "work_days": "5 hari"
}
```

### Response: 201
```json
{
    "status": "success",
    "message": "Form data successfully stored."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getFormDataByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}/forms
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Form successfully fetched.",
    "data": {
        "id": "2E1OB",
        "fkUserIdForms": "web500a97tw_Tsnu",
        "userAge": 17,
        "taskType": 0,
        "averageRestHour": 2,
        "moodBeforeWork": 0,
        "taskDeadline": 0,
        "taskImportance": 5,
        "sleepAverageHour": 8,
        "taskUrgency": 3,
        "totalDistraction": 3,
        "averageWorkHour": 6,
        "workDays": 5,
        "createdAt": "2024-06-17T17:45:48.000Z"
    }
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Form data not found."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
# 📁 Collection: Event System 


## End-point: createNewEventByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- **`title`** varchar(255) NOT NULL
    
- **`description`** varchar(255) NOT NULL
    
- **`startDay`** string, format **YYYY-MM-DD**
    
- **`finishDay`** string, format **YYYY-MM-DD**, if finishDay == NULL then **finishDay = startDay**
    
- **`startTime`** string, format **HH:MM:SS**
    
- **`finishTime`** string, format **HH:MM:SS**
### Method: POST
>```
>http://34.143.179.237:3000/users/{{userId}}/events
>```
### Body (**raw**)

```json
{
    "title": "schoolday",
    "description": "description",
    "startDay": "2020-04-10",
    "finishDay": "2020-04-10",
    "startTime": "10:20:30",
    "finishTime": "10:20:30"
}
```

### Response: 201
```json
{
    "status": "success",
    "message": "New event successfully created.",
    "data": {
        "id": "ems68T2SmX",
        "fkUserIdEvents": "web500a97tw_Tsnu",
        "title": "schoolday",
        "description": "description",
        "startDay": "2020-04-09T17:00:00.000Z",
        "finishDay": "2020-04-09T17:00:00.000Z",
        "startTime": "10:20:30",
        "finishTime": "10:20:30",
        "finishStatus": 0,
        "createdAt": "2024-06-17T17:46:24.000Z",
        "updatedAt": "2024-06-17T17:46:24.000Z"
    }
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "New event failed to be created."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getEventListByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}/events
>```
### Response: 200
```json
{
    "status": "success",
    "message": "List of event fetched successfully.",
    "data": [
        {
            "id": "ems68T2SmX",
            "fkUserIdEvents": "web500a97tw_Tsnu",
            "title": "schoolday",
            "description": "description",
            "startDay": "2020-04-09T17:00:00.000Z",
            "finishDay": "2020-04-09T17:00:00.000Z",
            "startTime": "10:20:30",
            "finishTime": "10:20:30",
            "finishStatus": 0,
            "createdAt": "2024-06-17T17:46:24.000Z",
            "updatedAt": "2024-06-17T17:46:24.000Z"
        }
    ]
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Events not found."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getEventByEventIdHandler
**Paramaters :**

- `userId` string(16)
    
- `eventId` string(10)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}/events/{{eventId}}
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Event fetched successfully.",
    "data": {
        "id": "ems68T2SmX",
        "fkUserIdEvents": "web500a97tw_Tsnu",
        "title": "schoolday",
        "description": "description",
        "startDay": "2020-04-09T17:00:00.000Z",
        "finishDay": "2020-04-09T17:00:00.000Z",
        "startTime": "10:20:30",
        "finishTime": "10:20:30",
        "finishStatus": 0,
        "createdAt": "2024-06-17T17:46:24.000Z",
        "updatedAt": "2024-06-17T17:46:24.000Z"
    }
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Event not found."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: editEventByEventIdHandler
**Paramaters :**

- `userId` string(16)
    
- `eventId` string(10)
    

**Request** Body/Payload :

- **`title`** varchar(255) NOT NULL
    
- **`description`** varchar(255) NOT NULL
    
- **`startDay`** string, format **YYYY-MM-DD**
    
- **`finishDay`** string, format **YYYY-MM-DD**, if finishDay == NULL then **finishDay = startDay**
    
- **`startTime`** string, format **HH:MM:SS**
    
- **`finishTime`** string, format **HH:MM:SS**
    
- **`finishStatus`** int, **0** or **1** with default **0**
### Method: PUT
>```
>http://34.143.179.237:3000/users/{{userId}}/events/{{eventId}}
>```
### Body (**raw**)

```json
{
    "title": "schoolday",
    "description": "description222",
    "startDay": "2020-04-10",
    "finishDay": "2020-04-15",
    "startTime": "20:20:30",
    "finishTime": "20:20:30",
    "finishStatus": 1
}
```

### Response: 200
```json
{
    "status": "success",
    "message": "Event has been updated.",
    "data": {
        "id": "ems68T2SmX",
        "fkUserIdEvents": "web500a97tw_Tsnu",
        "title": "schoolday",
        "description": "description222",
        "startDay": "2020-04-09T17:00:00.000Z",
        "finishDay": "2020-04-14T17:00:00.000Z",
        "startTime": "20:20:30",
        "finishTime": "20:20:30",
        "finishStatus": 1,
        "createdAt": "2024-06-17T17:46:24.000Z",
        "updatedAt": "2024-06-17T17:47:07.000Z"
    }
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Event failed to update."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: deleteEventByEventIdHandler
**Paramaters :**

- `userId` string(16)
    
- `eventId` string(10)
    

**Request** Body/Payload :

- None
### Method: DELETE
>```
>http://34.143.179.237:3000/users/{{userId}}/events/{{eventId}}
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Event has been deleted."
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Event failed to be deleted."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
# 📁 Collection: Note System 


## End-point: createNoteByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- **`title`** varchar(255) NOT NULL
    
- **`description`** varchar(255) NOT NULL
### Method: POST
>```
>http://34.143.179.237:3000/users/{{userId}}/notes
>```
### Body (**raw**)

```json
{
    "title": "holiday task",
    "description": "description"
}
```

### Response: 201
```json
{
    "status": "success",
    "message": "New note successfully created.",
    "data": {
        "id": "BmzMP4TpED",
        "fkUserIdNotes": "web500a97tw_Tsnu",
        "title": "holiday task",
        "description": "description",
        "createdAt": "2024-06-17T17:47:36.000Z",
        "updatedAt": "2024-06-17T17:47:36.000Z"
    }
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "New note failed to be created."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getNotesListByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}/notes
>```
### Response: 200
```json
{
    "status": "success",
    "message": "List of note fetched successfully.",
    "data": [
        {
            "id": "BmzMP4TpED",
            "fkUserIdNotes": "web500a97tw_Tsnu",
            "title": "holiday task",
            "description": "description",
            "createdAt": "2024-06-17T17:47:36.000Z",
            "updatedAt": "2024-06-17T17:47:36.000Z"
        }
    ]
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Notes not found."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getNotesByNoteIdHandler
**Paramaters :**

- `userId` string(16)
    
- `noteId` string(10)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}/notes/{{noteId}}
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Note fetched successfully.",
    "data": {
        "id": "BmzMP4TpED",
        "fkUserIdNotes": "web500a97tw_Tsnu",
        "title": "holiday task",
        "description": "description",
        "createdAt": "2024-06-17T17:47:36.000Z",
        "updatedAt": "2024-06-17T17:47:36.000Z"
    }
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Note not found."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: editNotesByNoteIdHandler
**Paramaters :**

- `userId` string(16)
    
- `noteId` string(10)
    

**Request** Body/Payload :

- **`title`** varchar(255) NOT NULL
    
- **`description`** varchar(255) NOT NULL
### Method: PUT
>```
>http://34.143.179.237:3000/users/{{userId}}/notes/{{noteId}}
>```
### Body (**raw**)

```json
{
    "title": "titlechange3",
    "description": "descriptionchange3"
}
```

### Response: 200
```json
{
    "status": "success",
    "message": "Note updated successfully.",
    "data": {
        "id": "BmzMP4TpED",
        "fkUserIdNotes": "web500a97tw_Tsnu",
        "title": "titlechange3",
        "description": "descriptionchange3",
        "createdAt": "2024-06-17T17:47:36.000Z",
        "updatedAt": "2024-06-17T17:54:45.000Z"
    }
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Note failed to update."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: deleteNotesByNoteIdHandler
**Paramaters :**

- `userId` string(16)
    
- `noteId` string(10)
    

**Request** Body/Payload :

- None
### Method: DELETE
>```
>http://34.143.179.237:3000/users/{{userId}}/notes/{{noteId}}
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Note has been deleted."
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Note failed to be deleted."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
# 📁 Collection: Notification System 


## End-point: createNotififcationByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- **`title`** varchar(255) NOT NULL
    
- **`description`** varchar(255) NOT NULL
### Method: POST
>```
>http://34.143.179.237:3000/users/{{userId}}/notifications
>```
### Body (**raw**)

```json
{
    "title": "work notification",
    "description": "description"
}
```

### Response: 201
```json
{
    "status": "success",
    "message": "New notification successfully created.",
    "data": {
        "id": "0PYx0BaCA2",
        "fkUserIdNotifications": "web500a97tw_Tsnu",
        "title": "work notification",
        "description": "description",
        "createdAt": "2024-06-17T17:55:02.000Z"
    }
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "New notification failed to be created."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getNotififcationListByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}/notifications
>```
### Response: 200
```json
{
    "status": "success",
    "message": "List of notification fetched successfully.",
    "data": [
        {
            "id": "0PYx0BaCA2",
            "fkUserIdNotifications": "web500a97tw_Tsnu",
            "title": "work notification",
            "description": "description",
            "createdAt": "2024-06-17T17:55:02.000Z"
        }
    ]
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Notification not found."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: getNotificationByNotificationIdHandler
**Paramaters :**

- `userId` string(16)
    
- `notificationId` string(10)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}/notifications/{{notificationId}}
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Notification fetched successfully.",
    "data": {
        "id": "0PYx0BaCA2",
        "fkUserIdNotifications": "web500a97tw_Tsnu",
        "title": "work notification",
        "description": "description",
        "createdAt": "2024-06-17T17:55:02.000Z"
    }
}
```

### Response: 404
```json
{
    "status": "fail",
    "message": "Notification not found."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
# 📁 Collection: Recommendation Model System 


## End-point: createPredictionByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- None
### Method: POST
>```
>http://34.143.179.237:3000/users/{{userId}}/model
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Prediction success.",
    "data": {
        "chronotype": "Wolf",
        "maxProbability": 78.99995446205139
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
# 📁 Collection: Visualization System 


## End-point: getVisualDataByUserIdHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- None
### Method: GET
>```
>http://34.143.179.237:3000/users/{{userId}}/visuals
>```
### Response: 200
```json
{
    "status": "success",
    "message": "Data successfully fetched.",
    "data": {
        "chronotype": "Wolf",
        "description": "If you know someone who isn’t a “morning person,” chances are they’re a wolf — about 15% of the population has this chronotype. Wolves usually wake up later in the day. They’ll also get bursts of energy in the evening. Midnight or later is a common bedtime for wolves.",
        "percentage": "15% of population",
        "workStartTime": "13:00",
        "workFinishTime": "17:00",
        "wakeUpTime": "07:30",
        "sleepTime": "00:00"
    }
}
```

### Response: 400
```json
{
    "status": "fail",
    "message": "Error: there is no matching chronotype.",
    "data": {
        "chronotype": "undefined"
    }
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
# 📁 Collection: Search System 


## End-point: searchDataHandler
**Paramaters :**

- `userId` string(16)
    

**Request** Body/Payload :

- **`searchWord`** string NOT NULL
### Method: POST
>```
>http://34.143.179.237:3000/users/{{userId}}/search
>```
### Body (**raw**)

```json
{
    "searchWord": "a"
}
```

### Response: 200
```json
{
    "status": "success",
    "message": "Data successfully fetched.",
    "data": [
        [
            {
                "id": "bTb7ZRJx2L",
                "fkUserIdEvents": "web500a97tw_Tsnu",
                "title": "schoolday 1",
                "description": "description",
                "startDay": "2020-04-09T17:00:00.000Z",
                "finishDay": "2020-04-09T17:00:00.000Z",
                "startTime": "10:20:30",
                "finishTime": "10:20:30",
                "finishStatus": 0,
                "createdAt": "2024-06-17T17:56:37.000Z",
                "updatedAt": "2024-06-17T17:56:37.000Z"
            },
            {
                "id": "zKYThESCaw",
                "fkUserIdEvents": "web500a97tw_Tsnu",
                "title": "schoolday 2",
                "description": "description",
                "startDay": "2020-04-09T17:00:00.000Z",
                "finishDay": "2020-04-09T17:00:00.000Z",
                "startTime": "10:20:30",
                "finishTime": "10:20:30",
                "finishStatus": 0,
                "createdAt": "2024-06-17T17:56:38.000Z",
                "updatedAt": "2024-06-17T17:56:38.000Z"
            }
        ],
        [
            {
                "id": "xh6Zq2O4CH",
                "fkUserIdNotes": "web500a97tw_Tsnu",
                "title": "holiday task 2",
                "description": "description",
                "createdAt": "2024-06-17T17:56:40.000Z",
                "updatedAt": "2024-06-17T17:56:40.000Z"
            },
            {
                "id": "Z1S0QmrO3T",
                "fkUserIdNotes": "web500a97tw_Tsnu",
                "title": "holiday task 1",
                "description": "description",
                "createdAt": "2024-06-17T17:56:39.000Z",
                "updatedAt": "2024-06-17T17:56:39.000Z"
            }
        ],
        [
            {
                "id": "xMyvVeWdh5",
                "fkUserIdNotifications": "web500a97tw_Tsnu",
                "title": "work notification 2",
                "description": "description",
                "createdAt": "2024-06-17T17:56:42.000Z"
            },
            {
                "id": "mdHtu9WEZV",
                "fkUserIdNotifications": "web500a97tw_Tsnu",
                "title": "work notification 1",
                "description": "description",
                "createdAt": "2024-06-17T17:56:41.000Z"
            },
            {
                "id": "YH0kx2JZbW",
                "fkUserIdNotifications": "web500a97tw_Tsnu",
                "title": "work notification 0",
                "description": "description",
                "createdAt": "2024-06-17T17:56:40.000Z"
            },
            {
                "id": "0PYx0BaCA2",
                "fkUserIdNotifications": "web500a97tw_Tsnu",
                "title": "work notification",
                "description": "description",
                "createdAt": "2024-06-17T17:55:02.000Z"
            }
        ]
    ]
}
```

### Response: 200
```json
{
    "status": "success",
    "message": "No matching data."
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)

NestJS
- well organized code 
- Modular design 
- Modern using typescript, decorators 
- feature rich 
- REST APIS
- graphql
- Queues
- Integrated with ORMs
- Authentication
- Microservices
- Data Validation 
- Logging

**Install Nest CLI**
npm install -g @nestjs/cli

<!-- check if nestjs is working -->
nest --help

**create a new project**
nest new *nest-event-backend*
nest-event-backend -> is the project name

**Generate Modules**
nest generate module events

**Start development server**
npm run start:dev

**Project structure**
- By default it is in standard mode
- Monorepo supported -many apps from 1 code repository

Main
- entry point of the application 
  - boostrap 
    - responsible for creating the project and start the server

Module 
- should have at least 1 module 
- comprises of controllers, services, entities and other smaller building blocks
- Modules are defined in their own module files, and the class decorator @module is used to describe them. 
  
controllers
- it let you define your api end points 

Service 
- is a class where you will put the business logic application of the application something not directly connected


**Controllers**
- Routes
  ![Alt text](https://file%2B.vscode-resource.vscode-cdn.net/Users/kparwan/Desktop/Screenshot%202023-06-09%20at%2010.23.26.png?version%3D1686291867162)

  Essentially controller is a class that contains some actions which run some code asa reaction to our root bank matched. 

  So that like an interface to your API entry point of your application.

  ![Alt text](https://file%2B.vscode-resource.vscode-cdn.net/Users/kparwan/Desktop/Screenshot%202023-06-09%20at%2010.25.07.png?version%3D1686291914963)

  The job of the controller is to return reponse with Data. Usually in JSON.
  it creates end points in your application using specific Puff's and HTTP verbs

![Alt text](https://file%2B.vscode-resource.vscode-cdn.net/Users/kparwan/Desktop/FireShot%20Capture%20001%20-%20Master%20NestJS%209%20-%20Node.js%20Framework%202023%20-%20opmg.udemy.com.png?version%3D1686292374709)


Summary: 
- Requests are handled by controllers, that are classes, having methods called actions. 
- A controller class is decorated with a @controller decorator, which can be used to specify a path prefix 
- HTTP verb decorators like @Get or @Post are used to specify actions, the HTTP verb of the actions and the path. 
- Response should be returned from the controller action method

**Note**
Every time you create a controller module, the module it is created in must be aware of that. ( in this case here update app.module )

**Route Parameters**
Get(":id") // Decorator and inside is the parameter name 
FindOne(@Param('id') id){ // Action and inside is the @param decorator

}
Routes can have dynamic parts, called route parameters
Routes parameters are defined by colon, followed by parameter name 
Parameters are passed to actions using the @Param decorator

Routes status 
![Alt text](https://file%2B.vscode-resource.vscode-cdn.net/Users/kparwan/Desktop/FireShot%20Capture%20002%20-%20Master%20NestJS%209%20-%20Node.js%20Framework%202023%20-%20opmg.udemy.com.png?version%3D1686295343060)


**Request Payload - Data Transfer Objects** 
DTO ( Data Transfer Object ) is a fancy name for defining the input properties and their types upfront. ( In typescript its similar to interfaces )

using types is beneficial to you and your team mates in the long run, everything would be more explicit, less error prone. 

**Mysql** 
system: Mysql
server: mysql
Username: root
password: example

**Postgres**
system: PostgreSQL
server: postgres
Username: postgres
password: example

**How to create Database**
First step is to install the type orm
*npm install --save @nestjs/typeorm typeorm mysql*

How to know you're connected is when you see this line in the terminal 
*[Nest] 34593  - 09/06/2023, 23:14:55     LOG [InstanceLoader] TypeOrmModule dependencies initialized +35ms*

**Repository**
 In nestJs you rarely creates classes, you received them by a machanism called **dependency injection**

Repository methods return a promise as all database operations are asynchronous

**Input Validation**
npm i --save class-validator class-transformer [ another type of built in pipes]

**Dependency Injections**
Dependency injections job is to out what other classes a class need and pass them there. 

**Application config**
test configuration for each env for example, test, dev, stage, production..
npm i --save @nestjs/config

# How to use prisma
- first install "npm i -D prisma" 
- Install "npm i @prisma/client"
- npx prisma init
- For help "npx prisma --help"
- To run the DB "npx prisma migrate dev"
- Run "npx prisma generate" adds typrscript to your schema
- npx prisma studio => it runs an IDE on localhost


# Updating DB and model 
- Add your changes 
- run "npx prisma migrate dev"
- Prisma will ask to name the new migration. Add anything you want, for example, update model. 


# Dto Validation
- use class validator 
- npm i --save class-validator class-transformer

# Pipes
- pipes are function that transform your data


# E2E testing
- use pactum 
- npm install -D pactum
# NodeJS Project

## Installation

1. git clone the final version of the repository
2. cd Project 
3. npm install
4. npm run populate to generate data
5. npm start

 ## Testing 

 Unit tests are implemented for metrics operations and user operations.<br/>
 Run them with npm run test

 ## App tutorial
 
 1. Start by creating an account or logging in to "arnaud" or "jean" (password="pass")
 2. On the metrics page, you can add, update or delete metrics and of course visualize them in a graph
 3. On the accout page, you can modify your email adress or delete your account
 4. Log in as an admin (username = "admin", password ="admin") to check the admin page. You can delete any user here.

 ## Routes
 
 1. /signup
 2. /login

 Once logged in you can access: <br/>
 1. /metrics
 2. /account
 3. /admin if you're admin

 ## GitLab

 Link to GitLab Project : https://gitlab.com/PainAuChoco/NodeJS/ <br/>
 The pipeline of CI is composed of 2 stages<br/>
 1. Test
 2. Build

 ## Encoutered difficulties 
 
 1. Lot of information with hundred of new dependencies to ingest at the beginning of the class.
 2. Test strange failure because of asynchronous JS functions
 3. Splitting up code
 4. Using Docker outside of GitLab pipeline

Arnaud Emprin and Jean Leroy<br/>
SI International Group 1<br/>
ECE Paris

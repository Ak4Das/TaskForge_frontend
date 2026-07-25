# PRD
## Login page
- User can login with registered email and password
- Implement authentication to validate user
- If email not registered then user will redirected to signin page
- If login successful then user will redirected to Dashboard page automatically
- Create new token valid for 24hrs and store inside localstorage

## SignUp page
- User can create account with name, email, password
- Implement authentication to check email is already present or not and create unique token
- password is converted into hashed with bcrypt before save to database
- Create token valid for 24hrs store inside localstorage

## Dashboard 
- List of all ongoing projects with filter on status
- Add new task and add new project btns present on the dashboard
- All current task assign to user are listed in table format with filter functionality on status of tasks

## Project Management
- All projects are listed 
- search and filter functionality implemented
- Add new project btn to add a new project

## Project Details page
- displayed all project related data
- project tasks are listed on a table you can implement various filters (status, owners, tags etc.) on the table of data and sorting functionality (priority, Due date) is also available
- Edit task and add new task btn is available on this page

## Task Details page
- All task related details are displayed on this page
- Edit task and mark as completed btn is available on this page

## Team management page
- All teams are listed in this page
- Add new team form is available
- Edit team btn is available on this page

## Team Details page
- All data related to a particular team is listed here
- All team members data are listed in  table format with searching and sorting functionality 
- Edit team and add new member btn are available on this page

## Reports page
- Pending Work Across Projects data is shown using bar chart
- Tasks Closed By Team data shown using pie chart
- Tasks Closed By Owner data shown using doughnut chart

## Settings page
- User can change his name and password

## sidebar
- contain all main navigation pages links

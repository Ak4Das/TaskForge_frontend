## How to implement context in project?
- First import createContext from react and call it to get context object
- Now all of those components between which i want to share context data put all of those inside the context.Provider component with value as prop containing the context data which i want to share across the children's 
- Now when i want to access the context value i just simply import useContext from react also import context from createContext.js and call useContext with context as a argument
- In this project i pass login user and setUser as value of context if token is valid then user will fetch otherwise user will be null

## Login logic
- User enter email and password and submit form
- call the Login api inside onSubmit handler
- backend checks is any user exists with this email
- then checks password is valid or not by comparing with bcrypt.compare
- If password correct then generate token using jwt.sign and sends via response
- store the token inside localstorage and then fetch user and update user state inside ContextProvider
- Then navigate to Dashboard

## Signup logic
- User enter name, email, password and submit the form
- call the signup api inside onSubmit handler 
- backend checks if any user already exists with same email address
- if not then create new user and save to db
- next create token and send it via response
- store the token inside localstorage and then fetch user and update user state inside ContextProvider
- Then navigate to Dashboard

## NormalLayout
- Controls toggle btw sidebar and compressSidebar
- and render its children inside main tag

## Dashboard
- list all the projects and filter projects by status
- list all the tasks assign to login user and filter by status implemented via url query method
- add new task form, open or close form via url query method
- add new project form, open or close form via url query method

## ProtectedLayout
- Only difference btw NormalLayout and ProtectedLayout is inside protected layout i check user to be null or not if null then navigate to login page
- When user login successfully then user will fetched and update user state inside ContextProvider

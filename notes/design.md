
# Data Requirements

Coaches
- list of coach(es)

Coach
- id
- firstName
- lastName
- description of the coach
- hourly rate (currency)
- areas of expertise
    - an array of string, where each element is the area of expertise


Requests (the messages)
- list of request(s)
    

CoachingRequest
- requestId
- coachId the id of the coach that this request is for
- message (string) to the coach
- email address of the sender


## Vuex requirements
- coaches module
- requests module

### getters
- getAllCoaches
- getAllRequests

### mutations
- register a (new) coach
- setCoaches in Vuex

- contactCoach will create a new request to a coach
- setRequests in Vuex

### actions
- loadCoaches from a DB and then set them in vuex
- loadRequests from a DB and then set them in vuex



# Layout Plan
- MainHeader, will appear on all pages
    - has navbar links (on right side)
        - `Coaches` goes to /coaches
        - `Requests` goes to /requests
        - `Register` goes to /register
    
- RequestList
    - displays a list of ALL RequestDetail(s)  (this could be used by an Admin)
        - Timestamp  To                From           Message
        -   date     coach-full-name   sender-email   first 20 chars of message...
        - clicking a row should show a modal 
- RequestDetail
    - email address of the requester
    - message of the request (text area)
    - has a dummy button "Respond", which would be used by a coach to contact the requester
    
- CoachesList
    - two column layout page layout
      - left half contains:
        - will have a filter input, that can filter coaches by area of expertise
        - underneath that, each list item will show the currently filtered coaches firstName, lastName and areas 
          of expertise
      - right half shows CoachDetail component when an item in the CoachList is clicked:
        - clicking on an element in this list display the (CoachDetail) component on the right side

- CoachDetail
    - receives coach id
    - displays the information for a coach
      - firstName lastName
      - description
      - hourly rate
      - areas of expertise, (perhaps display these a small badges in a flex container?)
    - has a contact button that when clicked will go to the ContactForm
    - later on consider making this a modal pop-up

- CoachRegistrationForm
    - used to register a new coach
    - firstName, lastName, description of coach, hourly rate
    - areas of expertise, space separated string that will be split into separate strings before being stored
    - submit button, submits then navigates to CoachList
    - cancel button goes back to CoachesList

- Contact Coach Form
    - maybe a modal
    - separate route
    - send in the coachId as a prop
    - email input 
    - message text area
    - submit, cancel buttons for this form
        - submit creates a new request object for the coach
    
    
# Routes
- `/coaches` loads a list of coaches (CoachList)
- `/coaches/:id` view the details of a coach (CoachDetail)
- `/register` coach registration component (CoachRegistrationForm)
- `/contact` form component that is used to send a coach a message (creates a new request) (ContactForm)
- `/requests` view all incoming requests received (RequestList)


# Deployment
- option 1, separate docker containers for:
  - SPA - just need an HTTP server
  - REST API (default port should be 8181)
  - MongoDB (using this uri: mongodb://root:password@localhost:27017/findACoachDB?authSource=admin )


### docker build command for frontend, rest-api
> docker build -t findacoach-app .

- to create a new tag
> docker tag node-docker:latest node-docker:v1.0.0

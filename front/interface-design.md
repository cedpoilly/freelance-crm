# Interface Design

## Initial Version - No Auth

### Home route: Client List

List all the clients available from the database. \

Navbar:

- [✔️] Search -> Local search for clients (can evolve to a back-end search)
- [✔️] Create client   -> Opens the Create client modal
- [✔️] Edit client   -> Opens the Create client modal
- [✔️] Create project  -> Opens the Create project modal
- [✔️] Edit project  -> Opens the Create project modal
- [ ] Settings

Topbar:

- [✔️] IsCodementor filter {toggle}
- [✔️] Tags filter         {multi-select}

Columns:

- Full name (virtual)
- Rate
- IsCodementor
- Level
- Service type
- Project count
- Actions -> Archive | View Projects

Actions:

- [✔️] View all details on click -> View/Edit/Create details modal
- [ ] Archive on button press
- [✔️] Open project list -> View projects -> separate list


### Components

The Data Table

Revamp the filters:

- [ ] Show a filter icon, that toggles the list of options
- [ ] The first option is a text search
- [ ] Other options are a selection of dropdowns & toggles

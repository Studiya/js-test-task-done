import React, {Component} from 'react';
import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            newId: '',
            newFirstName: '',
            newLastName: '', 
            newDob: '', 
            newLocation: '',
            countOfKiev: 0,
            sumOfAges: 0,
            longestString: '',
            editFormOpen: false,
            editId: '',
            editFirstName: '',
            editLastName: '', 
            editDob: '', 
            editLocation: ''
        };
        this.addUser = this.addUser.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.countKievUsers = this.countKievUsers.bind(this);
        this.realizeThreeAges = this.realizeThreeAges.bind(this);
        this.realizeLongetName = this.realizeLongestName.bind(this);
        this.closeEditForm = this.closeEditForm.bind(this);
        this.sendEditForm = this.sendEditForm.bind(this);
    }

    componentDidMount() {

        axios.get('/users')
            .then((response) => {
                let usersArray = [];
                response.data.map(user => {
                    usersArray.push({id: user.id, first_name: user.first_name, last_name: user.last_name, dob: user.dob, location: user.location})
                })

                this.setState({
                    users: this.state.users.concat(usersArray)
                })
            })
            .then((response) => {
                this.countKievUsers()
                this.realizeThreeAges()
                this.realizeLongestName()
            }).catch((erorr) => {
                console.log('error') 
            })
    }

    removeItem(removedUser) {

        const newUsersList = this.state.users.filter(user => {
            return user !== removedUser;
        })

        this.setState({
            users: [...newUsersList]
        })

        axios.delete('/users/' + removedUser.id)
        .then((response) => {
            this.countKievUsers()
            this.realizeThreeAges()
            this.realizeLongestName()
        }).catch((erorr) => {
            console.log('error') 
        })
    }

    handleChange(event) {

        if(event.target.id === 'firstName') {
            this.setState({
                newFirstName: event.target.value
            })
        }
        else if(event.target.id === 'lastName') {
            this.setState({
                newLastName: event.target.value
            })
        }
        else if(event.target.id === 'dob') {
            this.setState({
                newDob: event.target.value
            })
        }
        else if(event.target.id === 'location') {
            this.setState({
                newLocation: event.target.value
            })
        }
        else if(event.target.id === 'editFirstName') {
            this.setState({
                editFirstName: event.target.value
            })
        }
        else if(event.target.id === 'editLastName') {
            this.setState({
                editLastName: event.target.value
            })
        }
        else if(event.target.id === 'editDob') {
            this.setState({
                editDob: event.target.value
            })
        }
        else if(event.target.id === 'editLocation') {
            this.setState({
                editLocation: event.target.value
            })
        }

      }

    addUser(e) {
        e.preventDefault();

    // Here I didn't see before that you generated user.id in actions.create()
        // axios.get('/users')
        // .then((response) => {
            
        //     this.setState({
        //         newId: parseInt(response.data[response.data.length - 1].id) + 1,
        //     })
            
        // })
        // .then((response) => {

        //     this.setState({
        //         newId: this.state.newId.toString()
        //     })

        // }).catch((error) => {

        //     this.setState({
        //         newId: '1'
        //     })

        // })

    // Here I didn't see before that you generated user.id in actions.create()    

        const body = {
            // id: this.state.newId,
            first_name: this.state.newFirstName,     
            last_name: this.state.newLastName, 
            dob: this.state.newDob.split('-').reverse().join('.'), 
            location: this.state.newLocation 
        }

        axios.post('/users', body)
        .then((response) => {
            this.setState({
                users: []
            })
        }).catch((erorr) => {
            
        }) 

        axios.get('/users')
            .then((response) => {
                let usersArray = [];
                response.data.map(user => {
                    usersArray.push({id: user.id, first_name: user.first_name, last_name: user.last_name, dob: user.dob, location: user.location})
                })

                this.setState({
                    users: this.state.users.concat(usersArray)
                })
            })
            .then((response) => {
                this.countKievUsers()
                this.realizeThreeAges()
                this.realizeLongestName()
            }).catch((erorr) => {
                console.log('error') 
            })

        e.target.reset();

    }

    countKievUsers() {
        this.setState({
            countOfKiev: 0
        })

        this.state.users.map(user => {
            if(user.location === "Kiev" || user.location === "kiev") {
                this.setState({
                    countOfKiev: this.state.countOfKiev + 1
                })
            }
        })
    }

    realizeLongestName() {
        let names = [];

        this.state.users.map(user => {
            let name = user.first_name + ' ' + user.last_name
            names.push(name)
        })

        names.sort(function(a, b){
            if(a.length > b.length) return 1;
            if(a.length < b.length) return -1;
        })
        
        this.setState({
            longestString: names[names.length - 1]
        })
    }

    realizeThreeAges() {

        this.setState({
            sumOfAges: 0
        })

        let presentYear = new Date().getFullYear()
        let years = []
        this.state.users.map(user => {
            let year = user.dob.split('.')
            years.push(year[year.length - 1])
        })

        years.sort(function(a, b){
            if(parseInt(a) > parseInt(b)) return 1;
            if(parseInt(a) < parseInt(b)) return -1;
        })

        for(let i = 0; i < 3; i++) {
            let age = presentYear - years[i]
            this.setState({
                sumOfAges: this.state.sumOfAges + age
            })
        }
    }

    openEditForm(editUser) {

        this.setState(prevState => {
            return{
                editFormOpen: !prevState.editFormOpen,
                editId: editUser.id,
                editFirstName: editUser.first_name,
                editLastName: editUser.last_name,
                editDob: editUser.dob.split('.').reverse().join('-'),
                editLocation: editUser.location
            }
        })
    }

    closeEditForm() {
        this.setState(prevState => {
            return{
                editFormOpen: !prevState.editFormOpen
            }
        })
    }

    sendEditForm(e) {
        e.preventDefault();
        const body = {
            id: this.state.editId,
            first_name: this.state.editFirstName,     
            last_name: this.state.editLastName, 
            dob: this.state.editDob.split('-').reverse().join('.'), 
            location: this.state.editLocation 
        }

        axios.put('/users/' + body.id, body)
        .then((response) => {
            this.setState({
                users: []
            })
        }).catch((erorr) => {
            
        }) 

        axios.get('/users')
            .then((response) => {
                let usersArray = [];
                response.data.map(user => {
                    usersArray.push({id: user.id, first_name: user.first_name, last_name: user.last_name, dob: user.dob, location: user.location})
                })

                this.setState({
                    users: this.state.users.concat(usersArray)
                })
            })
            .then((response) => {
                this.countKievUsers()
                this.realizeThreeAges()
                this.realizeLongestName()
            }).catch((erorr) => {
                console.log('error') 
            })

        this.setState(prevState => {
            return{
                editFormOpen: !prevState.editFormOpen
            }
        })    
    }

  render() {

    const {users, newFirstName, newLastName, newDob, newLocation, countOfKiev, sumOfAges, longestString, editFormOpen, editFirstName, editLastName, editDob, editLocation} = this.state;
    return (
      <div>
        <h1>Code here</h1>

        {
            users.length > 0 &&
            <table className="table">
            <caption>Shopping List</caption>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>DOB</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                    users.map(user => {
                        return (
                            <tr key={user.id}>
                              <td>{user.first_name}</td>
                              <td>{user.last_name}</td>
                              <td>{user.dob}</td>
                              <td>{user.location}</td>
                              <td className="text-right">
                                    <button onClick={(e)=> this.openEditForm(user)} type="button">
                                        Edit
                                    </button>
                                    <button onClick={(e)=> this.removeItem(user)} type="button">
                                        Delete
                                    </button>
                              </td>
                            </tr>
                        )
                    })
                }
              </tbody>
            </table>
        }

        {
        users.length > 0 &&
        <div className="summary">
            <h2>Summary</h2>
            <div>Count of users from Kiev or kiev - <span className="count-from-kiev">{countOfKiev}</span></div>
            <div>Sum of three oldest users ages - <span className="count-from-kiev">{sumOfAges}</span></div>
            <div>Longest string of first name + lastname - <span className="count-from-kiev">{longestString}</span></div>
        </div>
        }

        <form onSubmit={this.addUser}>
            <div>
                <div className="field-wrap">
                    <label htmlFor="newItemInput">First name</label>  
                    <input type="text" placeholder="First name" id="firstName" onChange={this.handleChange} /> 
                </div> 
                <div className="field-wrap">
                    <label htmlFor="newItemInput">Last name</label>  
                    <input type="text" placeholder="Last name" id="lastName" onChange={this.handleChange} /> 
                </div> 
                <div className="field-wrap">
                    <label htmlFor="newItemInput">Date of birth</label>  
                    <input type="date" placeholder="Date" id="dob" onChange={this.handleChange} /> 
                </div> 
                <div className="field-wrap">
                    <label htmlFor="newItemInput">Location</label>  
                    <input type="text" placeholder="Location" id="location" onChange={this.handleChange} /> 
                </div> 
            </div>
            { 
                (newFirstName !== '' && newLastName !== '' && newDob !== '' && newLocation !== '') &&
                <button type="submit" className="btn btn-primary">Add</button>
            }
        </form>
        {
            editFormOpen &&
            <form className="edit-form" onSubmit={this.sendEditForm}>
                <span className="close-edit-form" onClick={this.closeEditForm}>X</span>
                <div>
                    <div className="field-wrap">
                        <label htmlFor="newItemInput">First name</label>  
                        <input type="text" placeholder="First name" id="editFirstName" onChange={this.handleChange} value={editFirstName}/> 
                    </div> 
                    <div className="field-wrap">
                        <label htmlFor="newItemInput">Last name</label>  
                        <input type="text" placeholder="Last name" id="editLastName" onChange={this.handleChange} value={editLastName}/> 
                    </div> 
                    <div className="field-wrap">
                        <label htmlFor="newItemInput">Date of birth</label>  
                        <input type="date" placeholder="Date" id="editDob" onChange={this.handleChange} value={editDob}/> 
                    </div> 
                    <div className="field-wrap">
                        <label htmlFor="newItemInput">Location</label>  
                        <input type="text" placeholder="Location" id="editLocation" onChange={this.handleChange} value={editLocation}/> 
                    </div> 
                </div>
                <button type="submit" className="btn btn-primary">Edit user</button>
            </form>
        }
      </div>
    );
  }
}

export default App;

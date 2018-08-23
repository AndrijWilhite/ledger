import React from 'react';
import swal from 'sweetalert2';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AcctView from './acctView'

var users = [{
  userName: 'admin',
  password: 'admin',
  funds: 1,
  transactions: []
}];

localStorage.setItem('users', JSON.stringify(users));

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      loggedIn: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  //handles input and state change for login fields
  handleChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.id;

    this.setState({
      [name]: value
    });
  }

  //handles the login functionality
  handleSubmit(e) {
    var self = this;
    e.preventDefault();

    users.forEach(user => {
      let tick = 0;
      if (user.userName === this.state.userName && user.password === this.state.password) {

        self.setState({
          loggedIn: true
        });

      } else {
        tick += 1;

        if (tick === users.length) {
          swal({
            title: 'No Account Found',
            text: "Please create one!",
            confirmButtonText: 'Create!'
          })
        }
      }
    })
  };

  //creates account
  handleCreateAccount() {
    swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2']
    }).queue([{
        title: 'User Name',
        text: 'Pick a User Name'
      },
      {
        title: 'Password',
        text: 'Set a Password'
      }
    ]).then((result) => {
      if (result.value) {
        users.forEach(user => {
          if (user.userName === result.value[0]) {
            swal({
              title: 'Error! Username already in use!',
              confirmButtonText: 'Okay'
            })
          } else {
            swal({
              title: 'All done!',
              confirmButtonText: 'Create'
            }).then(() => {
              var data = JSON.parse(localStorage.getItem('users'))
              data.push({
                userName: result.value[0],
                password: result.value[1],
                funds: 0,
                transactions: []
              })
              users.push({
                userName: result.value[0],
                password: result.value[1],
              })
              localStorage.setItem('users', JSON.stringify(data));

            });
          }
        });
      }
    })
  };

  handleLogOut() {
    this.setState({
      userName: "",
      password: "",
      loggedIn: false
    })
  };

  render() {

    return ( 
      <div>
      <h1>Finance Ledger</h1>
      {
        this.state.loggedIn ?
          <div>
          <AcctView
            user = {this.state}
            logOut = {this.handleLogOut}
        />
        </div> :
        <div>
        <TextField
          required
          id = "userName"
          label = "User Name"
          value = {this.state.userName}
          margin = "normal"
          onChange = {this.handleChange}
        />
        <TextField
          required
          id = "password"
          label = "Password"
          value = {this.state.password}
          margin = "normal"
          onChange = {this.handleChange}
        />
        <Button
          variant = "contained"
          color = "primary"
          onClick = {this.handleSubmit}
        >
        Login
        </Button>
        <Button
          variant = "contained"
          color = "primary"
          onClick = {this.handleCreateAccount}
        >
        Create Account
        </Button>
        </div>
      }
      </div>
    );
  }
}

export default Login;
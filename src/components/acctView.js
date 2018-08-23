import React from "react";
import _ from 'underscore';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import swal from 'sweetalert2';

export default class AcctView extends React.Component {
    constructor() {
        super();
        this.state = {
            content: null
        };
        this.addFunds = this.addFunds.bind(this);
        this.withDrawFunds = this.withDrawFunds.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    componentDidMount() {
        var self = this;
        let data = JSON.parse(localStorage.getItem('users'));

        data.forEach(user => {
            if (user.userName === this.props.user.userName) {
                var acctData = {
                    userName: user.userName,
                    funds: user.funds,
                    transactions: user.transactions,
                    password: user.password
                }
                self.setState({
                    content: acctData
                })
            }
        })
    };

    addFunds() {
        swal({
            title: 'Add Funds!',
            text: 'Enter how much you would like to add:',
            input: 'number',
            confirmButtonText: 'Add it!'
        }).then((result) => {
            if (result.value) {
                this.setState({
                    content: {
                        userName: this.state.content.userName,
                        password: this.state.content.password,
                        funds: parseInt(result.value, 10) + this.state.content.funds,
                        transactions: this.state.content.transactions.concat({
                            "type": "deposit",
                            "amount": result.value,
                            "age": Date.now()
                        })
                    }
                })
            }
        });
    };

    withDrawFunds() {
        swal({
            title: 'Withdraw Funds!',
            text: 'Enter how much you would like to withdraw:',
            input: 'number',
            confirmButtonText: 'Take it!'
        }).then((result) => {
            if (result.value) {
                this.setState({
                    content: {
                        userName: this.state.content.userName,
                        password: this.state.content.password,
                        funds: this.state.content.funds - parseInt(result.value, 10),
                        transactions: this.state.content.transactions.concat({
                            "type": "withdraw",
                            "amount": result.value,
                            "age": Date.now()
                        })
                    }
                })
            }
        });
    };

    logOut() {
        var data = JSON.parse(localStorage.getItem('users'));

        for (var i = 0; i < data.length; i++) {

            if (data[i].userName === this.state.content.userName) {
                data[i].funds = this.state.content.funds;

                var newTrans = _.uniq(this.state.content.transactions, 'age');
                data[i].transactions = newTrans;
                localStorage.setItem('users', JSON.stringify(data));
            }
        }
        this.props.logOut();
    };

    render() {

        return (

            <div>
            <Paper>
                <MenuList>
                    <MenuItem onClick = {this.addFunds}>Add Funds</MenuItem> 
                    <MenuItem onClick = {this.withDrawFunds}>WithDraw Funds</MenuItem>
                    <MenuItem onClick = {this.logOut}>Logout</MenuItem> 
                </MenuList>
            </Paper>
            {this.state.content ?
                    <h1>{"Funds: $" + this.state.content.funds}</h1> 
                    :
                    <div>
                    </div>
            } {this.state.content ?
                    <Table >
                        <TableHead >
                            <TableRow >
                                <TableCell>Type</TableCell>
                                <TableCell numeric>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody> {
                            this.state.content.transactions.map(row => {
                                return (
                                    <TableRow key = {row.id}>
                                        <TableCell
                                        component = "th"
                                        scope = "row" > {row.type}
                                        </TableCell>
                                        <TableCell numeric>
                                        {row.type === "deposit" ? "$" + row.amount : "-$" + row.amount}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                        </TableBody>
                    </Table>
                    :
                    <div>
                    </div>    
            }
            </div>
        )
    };
};